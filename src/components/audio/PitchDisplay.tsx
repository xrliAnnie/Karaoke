'use client'

import { useEffect, useRef } from 'react'

interface PitchDisplayProps {
  frequency: number | null
  note: string | null
  isRecording: boolean
}

export default function PitchDisplay({
  frequency,
  note,
  isRecording
}: PitchDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pitchHistoryRef = useRef<Array<{ frequency: number; time: number }>>([])
  
  // Update pitch history
  useEffect(() => {
    if (isRecording && frequency && frequency > 0) {
      // console.log('Updating pitch history with frequency:', frequency)
      pitchHistoryRef.current.push({
        frequency,
        time: Date.now()
      })
      
      // Keep only the last 100 pitch values (about 2-3 seconds of data)
      if (pitchHistoryRef.current.length > 100) {
        pitchHistoryRef.current.shift()
      }
      
      drawPitchGraph()
    }
    
    if (!isRecording) {
      // Clear pitch history when not recording
      if (pitchHistoryRef.current.length > 0) {
        console.log('Clearing pitch history')
        pitchHistoryRef.current = []
      }
      
      // Clear canvas
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
    }
  }, [frequency, isRecording])
  
  const drawPitchGraph = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const history = pitchHistoryRef.current
    if (history.length < 2) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set up graph styling
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = 'rgb(56, 189, 248)' // primary-400
    
    // Find min and max frequencies for scaling
    const minFreq = Math.min(...history.map(p => p.frequency))
    const maxFreq = Math.max(...history.map(p => p.frequency))
    const range = maxFreq - minFreq || 100 // Prevent division by zero
    
    // Draw the pitch line
    ctx.beginPath()
    
    history.forEach((point, index) => {
      const x = (index / (history.length - 1)) * canvas.width
      
      // Scale frequency to canvas height (inverted, as lower y is higher on canvas)
      const normalizedFreq = (point.frequency - minFreq) / range
      const y = canvas.height - (normalizedFreq * (canvas.height * 0.8) + canvas.height * 0.1)
      
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    
    ctx.stroke()
    
    // Draw a horizontal line for the current frequency
    if (frequency && frequency > 0) {
      const normalizedCurrentFreq = (frequency - minFreq) / range
      const y = canvas.height - (normalizedCurrentFreq * (canvas.height * 0.8) + canvas.height * 0.1)
      
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(232, 121, 249, 0.5)' // secondary-400 with transparency
      ctx.setLineDash([5, 5])
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
  
  // Format frequency to 2 decimal places
  const formattedFrequency = frequency ? frequency.toFixed(2) : '--'
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Pitch Detection</h3>
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-gray-400 mr-2">Frequency:</span>
            <span className="font-mono">{formattedFrequency} Hz</span>
          </div>
          <div>
            <span className="text-gray-400 mr-2">Note:</span>
            <span className="font-mono text-xl font-bold text-primary-300">{note || '--'}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-2 h-48 relative">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          width={800}
          height={200}
        />
        
        {!isRecording && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            {frequency ? 'Recording stopped' : 'Start recording to see pitch visualization'}
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {isRecording && pitchHistoryRef.current.length > 0 ? 
          `Collecting data: ${pitchHistoryRef.current.length} points` : 
          'No pitch data available'}
      </div>
    </div>
  )
} 
'use client'

import { useEffect, useRef, useState } from 'react'
import { AudioData } from '@/types/audio'
import { detectPitch } from '@/utils/pitchDetection'

interface AudioRecorderProps {
  isRecording: boolean
  onStartRecording: () => void
  onStopRecording: (audioData: AudioData) => void
  onPitchDetected: (frequency: number, note: string) => void
}

export default function AudioRecorder({
  isRecording,
  onStartRecording,
  onStopRecording,
  onPitchDetected
}: AudioRecorderProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  
  // Request microphone permission
  useEffect(() => {
    async function requestMicrophonePermission() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setHasPermission(true)
        streamRef.current = stream
        
        // Initialize audio context and analyzer
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        analyser.fftSize = 2048
        
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
        
        audioContextRef.current = audioContext
        analyserRef.current = analyser
        sourceRef.current = source
        
      } catch (err) {
        console.error('Error accessing microphone:', err)
        setError('Microphone access denied. Please allow microphone access to use this feature.')
        setHasPermission(false)
      }
    }
    
    requestMicrophonePermission()
    
    return () => {
      // Clean up resources when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])
  
  // Handle recording state changes
  useEffect(() => {
    if (!hasPermission || !streamRef.current || !analyserRef.current) return
    
    if (isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRecording, hasPermission])
  
  const startRecording = () => {
    if (!streamRef.current) return
    
    audioChunksRef.current = []
    startTimeRef.current = Date.now()
    
    const mediaRecorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = mediaRecorder
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data)
      }
    }
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const duration = Date.now() - startTimeRef.current
      
      onStopRecording({
        url: audioUrl,
        blob: audioBlob,
        duration
      })
    }
    
    mediaRecorder.start()
    startPitchDetection()
  }
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }
  
  const startPitchDetection = () => {
    if (!analyserRef.current || !audioContextRef.current) return
    
    const analyser = analyserRef.current
    const bufferLength = analyser.fftSize
    const dataArray = new Float32Array(bufferLength)
    
    const detectPitchAndScheduleNext = () => {
      analyser.getFloatTimeDomainData(dataArray)
      
      const { frequency, note } = detectPitch(dataArray, audioContextRef.current!.sampleRate)
      
      if (frequency > 0) {
        onPitchDetected(frequency, note)
      }
      
      animationFrameRef.current = requestAnimationFrame(detectPitchAndScheduleNext)
    }
    
    animationFrameRef.current = requestAnimationFrame(detectPitchAndScheduleNext)
  }
  
  return (
    <div className="flex flex-col items-center">
      {error && (
        <div className="text-red-500 mb-4 text-center">
          {error}
        </div>
      )}
      
      <button
        onClick={isRecording ? () => {} : onStartRecording}
        disabled={!hasPermission || isRecording}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-600 animate-pulse-slow' 
            : hasPermission 
              ? 'bg-primary-600 hover:bg-primary-700' 
              : 'bg-gray-600 cursor-not-allowed'
        }`}
        aria-label={isRecording ? 'Recording in progress' : 'Start recording'}
      >
        <span className="text-3xl">🎙️</span>
      </button>
      
      {isRecording && (
        <button
          onClick={() => onStopRecording({
            url: '',
            blob: new Blob(),
            duration: Date.now() - startTimeRef.current
          })}
          className="mt-4 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Stop Recording
        </button>
      )}
    </div>
  )
} 
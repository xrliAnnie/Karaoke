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
    console.log('Requesting microphone permission...')
    
    async function requestMicrophonePermission() {
      try {
        console.log('Attempting to access microphone...')
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        console.log('Microphone access granted!', stream)
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
        
        console.log('Audio context and analyzer set up successfully')
        
      } catch (err) {
        console.error('Error accessing microphone:', err)
        setError('Microphone access denied. Please allow microphone access to use this feature.')
        setHasPermission(false)
      }
    }
    
    requestMicrophonePermission()
    
    return () => {
      // Clean up resources when component unmounts
      console.log('Cleaning up audio resources...')
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
    console.log('Recording state changed:', isRecording, 'hasPermission:', hasPermission)
    
    if (!hasPermission) {
      console.log('No microphone permission yet')
      return
    }
    
    if (!streamRef.current) {
      console.log('No stream available')
      return
    }
    
    if (!analyserRef.current) {
      console.log('No analyzer available')
      return
    }
    
    if (isRecording) {
      console.log('Starting recording...')
      startRecording()
    } else if (mediaRecorderRef.current) {
      console.log('Stopping recording...')
      stopRecording()
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isRecording, hasPermission])
  
  const startRecording = () => {
    if (!streamRef.current) {
      console.error('No stream available for recording')
      return
    }
    
    console.log('Initializing recording...')
    audioChunksRef.current = []
    startTimeRef.current = Date.now()
    
    try {
      const mediaRecorder = new MediaRecorder(streamRef.current)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available from recorder:', event.data.size)
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        console.log('MediaRecorder stopped, processing audio...')
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const duration = Date.now() - startTimeRef.current
        
        console.log('Audio recorded:', { 
          duration, 
          blobSize: audioBlob.size, 
          url: audioUrl 
        })
        
        onStopRecording({
          url: audioUrl,
          blob: audioBlob,
          duration
        })
      }
      
      // Start recording with 100ms timeslices to get frequent ondataavailable events
      mediaRecorder.start(100)
      console.log('MediaRecorder started:', mediaRecorder.state)
      startPitchDetection()
    } catch (err) {
      console.error('Error starting MediaRecorder:', err)
      setError('Failed to start recording. Please try again.')
    }
  }
  
  const stopRecording = () => {
    console.log('Stopping recording, mediaRecorder state:', mediaRecorderRef.current?.state)
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
        console.log('MediaRecorder stopped')
      } catch (err) {
        console.error('Error stopping MediaRecorder:', err)
      }
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }
  
  const startPitchDetection = () => {
    if (!analyserRef.current || !audioContextRef.current) {
      console.error('Analyzer or audio context not available')
      return
    }
    
    console.log('Starting pitch detection...')
    const analyser = analyserRef.current
    const bufferLength = analyser.fftSize
    const dataArray = new Float32Array(bufferLength)
    
    const detectPitchAndScheduleNext = () => {
      analyser.getFloatTimeDomainData(dataArray)
      
      const { frequency, note } = detectPitch(dataArray, audioContextRef.current!.sampleRate)
      
      if (frequency > 0) {
        // console.log('Detected pitch:', frequency.toFixed(2), 'Hz', note)
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
      
      <div className="mb-2 text-center">
        <p className="text-sm text-gray-400">
          Microphone: {hasPermission === null ? 'Requesting access...' : 
                      hasPermission ? 'Access granted' : 'Access denied'}
        </p>
      </div>
      
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
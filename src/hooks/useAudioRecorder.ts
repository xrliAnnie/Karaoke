'use client'

import { useState, useRef, useCallback } from 'react'
import { AudioData, PitchData } from '@/types/audio'
import { generateSessionId, logRecordingSession } from '@/utils/logger'

interface UseAudioRecorderReturn {
  isRecording: boolean
  hasPermission: boolean | null
  error: string | null
  recordedAudio: AudioData | null
  pitchHistory: PitchData[]
  startRecording: () => void
  stopRecording: () => void
  onPitchDetected: (frequency: number, note: string) => void
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordedAudio, setRecordedAudio] = useState<AudioData | null>(null)
  const [pitchHistory, setPitchHistory] = useState<PitchData[]>([])
  
  const sessionIdRef = useRef<string>(generateSessionId())
  const startTimeRef = useRef<number>(0)
  
  // Reset pitch history when starting a new recording
  const startRecording = useCallback(() => {
    setPitchHistory([])
    sessionIdRef.current = generateSessionId()
    startTimeRef.current = Date.now()
    setIsRecording(true)
  }, [])
  
  // Log the session when stopping recording
  const stopRecording = useCallback(() => {
    setIsRecording(false)
    
    const duration = Date.now() - startTimeRef.current
    
    // Log the recording session
    logRecordingSession({
      sessionId: sessionIdRef.current,
      duration,
      pitchData: pitchHistory
    }).then(result => {
      if (!result.success) {
        console.warn('Failed to log recording session:', result.message)
      }
    })
  }, [pitchHistory])
  
  // Track pitch data as it's detected
  const onPitchDetected = useCallback((frequency: number, note: string) => {
    if (isRecording && frequency > 0) {
      const pitchData: PitchData = {
        frequency,
        note,
        time: Date.now() - startTimeRef.current
      }
      
      setPitchHistory(prev => [...prev, pitchData])
    }
  }, [isRecording])
  
  return {
    isRecording,
    hasPermission,
    error,
    recordedAudio,
    pitchHistory,
    startRecording,
    stopRecording,
    onPitchDetected
  }
} 
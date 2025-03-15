'use client'

import { useState } from 'react'
import Link from 'next/link'
import AudioRecorder from '@/components/audio/AudioRecorder'
import PitchDisplay from '@/components/audio/PitchDisplay'
import { AudioData } from '@/types/audio'

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentPitch, setCurrentPitch] = useState<number | null>(null)
  const [currentNote, setCurrentNote] = useState<string | null>(null)
  const [recordedAudio, setRecordedAudio] = useState<AudioData | null>(null)
  
  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordedAudio(null)
  }
  
  const handleStopRecording = (audioData: AudioData) => {
    setIsRecording(false)
    setRecordedAudio(audioData)
    // Here we would send the audio data to the backend for logging
  }
  
  const handlePitchDetected = (frequency: number, note: string) => {
    setCurrentPitch(frequency)
    setCurrentNote(note)
  }

  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary-400 hover:text-primary-300">
          ← Back to Home
        </Link>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Record Your Voice</h1>
        
        <div className="flex flex-col items-center mb-8">
          <AudioRecorder 
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onPitchDetected={handlePitchDetected}
          />
          
          <div className="mt-4 text-center">
            {isRecording ? (
              <p className="text-secondary-400 animate-pulse">Recording in progress...</p>
            ) : (
              <p className="text-gray-400">Press the microphone button to start recording</p>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <PitchDisplay 
            frequency={currentPitch} 
            note={currentNote} 
            isRecording={isRecording}
          />
        </div>
        
        {recordedAudio && (
          <div className="mt-8 p-4 bg-gray-900 rounded-lg">
            <h3 className="text-xl font-medium mb-3">Recorded Audio</h3>
            <audio 
              src={recordedAudio.url} 
              controls 
              className="w-full"
            />
            <p className="text-sm text-gray-400 mt-2">
              Duration: {Math.round(recordedAudio.duration / 1000)} seconds
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 
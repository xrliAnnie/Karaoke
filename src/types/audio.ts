export interface AudioData {
  url: string
  blob: Blob
  duration: number
}

export interface PitchData {
  frequency: number
  note: string
  time: number
}

export interface RecordingSession {
  sessionId: string
  timestamp: string
  pitchData: PitchData[]
  duration: number
} 
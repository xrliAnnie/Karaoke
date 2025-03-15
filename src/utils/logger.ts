import { PitchData, RecordingSession } from '@/types/audio'

/**
 * Logs a recording session to the backend API
 */
export async function logRecordingSession({
  sessionId,
  duration,
  pitchData
}: {
  sessionId: string
  duration: number
  pitchData: PitchData[]
}): Promise<{ success: boolean; message: string }> {
  try {
    const session: RecordingSession = {
      sessionId,
      timestamp: new Date().toISOString(),
      duration,
      pitchData
    }
    
    const response = await fetch('/api/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(session)
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('Error logging session:', result.error)
      return { success: false, message: result.error || 'Failed to log session' }
    }
    
    return { success: true, message: 'Session logged successfully' }
  } catch (error) {
    console.error('Error logging session:', error)
    return { success: false, message: 'Failed to log session' }
  }
}

/**
 * Generates a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
} 
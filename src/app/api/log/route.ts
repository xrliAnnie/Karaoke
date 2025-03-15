import { NextResponse } from 'next/server'
import { RecordingSession } from '@/types/audio'

// This is a simple logging API for Week 1
// In Week 2, this would be enhanced to store data in Supabase

export async function POST(request: Request) {
  try {
    const data: RecordingSession = await request.json()
    
    // Validate the data
    if (!data.sessionId || !data.timestamp || !Array.isArray(data.pitchData)) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      )
    }
    
    // In a real application, we would store this data in a database
    // For Week 1, we'll just log it to the console
    console.log('Recording session logged:', {
      sessionId: data.sessionId,
      timestamp: data.timestamp,
      duration: data.duration,
      pitchDataPoints: data.pitchData.length
    })
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Session logged successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error logging session:', error)
    
    return NextResponse.json(
      { error: 'Failed to log session' },
      { status: 500 }
    )
  }
} 
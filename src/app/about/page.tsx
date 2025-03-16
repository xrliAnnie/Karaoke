import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container-app py-8">
      <div className="mb-6">
        <Link href="/" className="text-primary-400 hover:text-primary-300">
          ← Back to Home
        </Link>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
        <h1 className="text-3xl font-bold mb-6">About the Karaoke App</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-primary-300 mb-2">What is this app?</h2>
            <p className="text-gray-300">
              This AI-powered karaoke application helps you improve your singing by providing real-time 
              pitch detection and feedback. The app analyzes your voice as you sing and shows you how 
              accurately you're hitting the notes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-primary-300 mb-2">How it works</h2>
            <p className="text-gray-300 mb-4">
              The app uses advanced audio processing algorithms to detect the pitch of your voice in real-time.
              Here's how the process works:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 ml-4">
              <li>Your voice is captured through your device's microphone</li>
              <li>The audio signal is processed to extract frequency information</li>
              <li>The frequency is converted to musical notes (e.g., C4, D#5)</li>
              <li>The detected pitch is displayed visually in real-time</li>
            </ol>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-primary-300 mb-2">Coming Soon</h2>
            <p className="text-gray-300 mb-4">
              We're actively working on enhancing the app with these exciting features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
              <li>User accounts to save your progress</li>
              <li>Synchronized lyrics display</li>
              <li>Score tracking and performance analytics</li>
              <li>Song library with karaoke tracks</li>
              <li>Social sharing of your performances</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-primary-300 mb-2">Privacy</h2>
            <p className="text-gray-300">
              Your privacy is important to us. All audio processing happens directly in your browser - 
              your voice recordings are not sent to our servers unless you explicitly choose to save them.
              We only collect anonymous usage data to help improve the application.
            </p>
          </section>
          
          <div className="mt-8 pt-6 border-t border-gray-700">
            <Link href="/record" className="btn-primary">
              Try It Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 
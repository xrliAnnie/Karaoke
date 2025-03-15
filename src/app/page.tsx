import Link from 'next/link'

export default function Home() {
  return (
    <div className="container-app py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
          AI-Powered Karaoke
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Record your voice and get real-time pitch feedback. Practice your singing skills with our advanced audio analysis technology.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/record" 
            className="btn-primary"
          >
            Start Singing
          </Link>
          <Link 
            href="/about" 
            className="btn-secondary"
          >
            Learn More
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          title="Real-time Pitch Detection" 
          description="See your pitch in real-time as you sing, helping you stay on key and improve your vocal accuracy."
          icon="🎵"
        />
        <FeatureCard 
          title="Audio Recording" 
          description="High-quality audio capture with an intuitive interface for recording and playback."
          icon="🎙️"
        />
        <FeatureCard 
          title="Visual Feedback" 
          description="Clear visual representation of your pitch to help you understand and improve your singing."
          icon="📊"
        />
      </div>
    </div>
  )
}

function FeatureCard({ 
  title, 
  description, 
  icon 
}: { 
  title: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 hover:border-primary-500 transition-colors">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-medium text-primary-300 mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
} 
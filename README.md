# AI-Powered Karaoke Application

A web-based karaoke application with real-time pitch detection and feedback.

## Project Overview

This application allows users to record their voice and receive real-time pitch feedback. The core functionality is implemented in a Next.js frontend where audio is captured and processed locally using the Web Audio API and custom pitch detection algorithms.

### Features (Week 1)

- **Audio Recording**: Capture user's voice using the device microphone
- **Real-time Pitch Detection**: Analyze the user's singing pitch in real-time
- **Visual Feedback**: Display the detected pitch with a responsive visualization
- **Playback**: Listen to recorded audio

### Upcoming Features

- **User Authentication**: Create accounts and save progress (Week 2)
- **Lyric Display**: Synchronized lyrics with timing information (Week 3)
- **Score Tracking**: Performance analytics and scoring (Week 3)

## Technical Implementation

- **Frontend**: Next.js with React, TypeScript, and Tailwind CSS
- **Audio Processing**: Web Audio API for capturing and analyzing audio
- **Pitch Detection**: Custom implementation using autocorrelation algorithm
- **State Management**: React hooks for local state management
- **Styling**: Tailwind CSS for responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/karaoke-app.git
   cd karaoke-app
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Click on "Start Singing" to access the recording page
2. Grant microphone permissions when prompted
3. Click the microphone button to start recording
4. Sing into your microphone and observe the real-time pitch detection
5. Click the stop button to end recording
6. Listen to your recording using the playback controls

## Project Structure

```
karaoke-app/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── page.tsx          # Home page
│   │   ├── record/           # Recording functionality
│   │   └── about/            # About page
│   ├── components/           # React components
│   │   └── audio/            # Audio-related components
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   │   └── pitchDetection.ts # Pitch detection algorithm
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── ...                       # Config files
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project is part of a 3-week development sprint
- Inspired by karaoke applications and vocal training tools 
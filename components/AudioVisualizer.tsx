import React from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isPlaying }) => {
  return (
    <div className="h-16 flex items-center justify-center gap-1 w-full max-w-xs mx-auto opacity-80">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`w-2 bg-indigo-500 rounded-full transition-all duration-150 ease-in-out
            ${isPlaying ? 'animate-pulse-ring' : 'h-2'}
          `}
          style={{
            height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '10%',
            animationDelay: `${i * 0.1}s`,
            opacity: isPlaying ? 1 : 0.3
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;
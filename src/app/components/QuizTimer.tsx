import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface QuizTimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
}

export function QuizTimer({ initialMinutes, onTimeUp }: QuizTimerProps) {
  // The state now lives HERE, so only this tiny component re-renders every second!
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);

  useEffect(() => {
    if (timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => onTimeUp(), 0); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-2 font-semibold ${timeRemaining < 300 ? 'text-[#dc2626]' : 'text-[#1e40af]'}`}>
      <Clock className="w-5 h-5" />
      <span>{formatTime(timeRemaining)}</span>
    </div>
  );
}
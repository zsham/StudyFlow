import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, Brain, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TIMER_MODES } from '@/src/constants';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { TimerSettings } from '@/src/types';

interface PomodoroTimerProps {
  onSessionComplete: (type: 'focus' | 'short-break' | 'long-break', duration: number) => void;
  settings: TimerSettings;
}

type Mode = keyof typeof TIMER_MODES;

export function PomodoroTimer({ onSessionComplete, settings }: PomodoroTimerProps) {
  const [mode, setMode] = useState<Mode>('FOCUS');
  
  const getDuration = (m: Mode) => {
    switch(m) {
      case 'FOCUS': return settings.focus * 60;
      case 'SHORT_BREAK': return settings.shortBreak * 60;
      case 'LONG_BREAK': return settings.longBreak * 60;
      default: return 25 * 60;
    }
  };

  const [timeLeft, setTimeLeft] = useState(getDuration('FOCUS'));
  const [isActive, setIsActive] = useState(false);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(getDuration(mode));
  }, [mode, settings]);

  useEffect(() => {
    resetTimer();
  }, [mode, resetTimer, settings]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      const currentMode = TIMER_MODES[mode];
      toast.success(`${currentMode.label} session complete!`);
      
      onSessionComplete(
        mode === 'FOCUS' ? 'focus' : mode === 'SHORT_BREAK' ? 'short-break' : 'long-break',
        Math.floor(getDuration(mode) / 60)
      );

      // Auto-switch modes
      if (mode === 'FOCUS') {
        setMode('SHORT_BREAK');
      } else {
        setMode('FOCUS');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onSessionComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden border-none shadow-2xl bg-zinc-950 text-zinc-100">
      <CardContent className="p-8 flex flex-col items-center space-y-8">
        <div className="flex space-x-2 bg-zinc-900 p-1 rounded-xl">
          {(Object.keys(TIMER_MODES) as Mode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setMode(m)}
              className={`rounded-lg transition-all duration-300 ${
                mode === m ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m === 'FOCUS' && <Brain className="w-4 h-4 mr-2" />}
              {m === 'SHORT_BREAK' && <Coffee className="w-4 h-4 mr-2" />}
              {m === 'LONG_BREAK' && <Moon className="w-4 h-4 mr-2" />}
              {TIMER_MODES[m].label}
            </Button>
          ))}
        </div>

        <div className="relative flex items-center justify-center w-64 h-64">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-zinc-900"
            />
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="753.98"
              initial={{ strokeDashoffset: 753.98 }}
              animate={{ strokeDashoffset: 753.98 - (753.98 * progress) / 100 }}
              transition={{ duration: 0.5, ease: "linear" }}
              className={TIMER_MODES[mode].accent}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <motion.span 
              key={timeLeft}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl font-mono font-bold tracking-tighter"
            >
              {formatTime(timeLeft)}
            </motion.span>
            <span className="text-zinc-500 uppercase tracking-widest text-xs mt-2">
              {TIMER_MODES[mode].label}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            size="lg"
            variant="outline"
            onClick={resetTimer}
            className="rounded-full w-14 h-14 border-zinc-800 bg-transparent hover:bg-zinc-900 text-zinc-400"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            onClick={toggleTimer}
            className={`rounded-full w-20 h-20 shadow-lg transition-all duration-300 ${
              isActive 
                ? 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200' 
                : `${TIMER_MODES[mode].color} text-white hover:opacity-90`
            }`}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </Button>
          <div className="w-14 h-14" /> {/* Spacer for symmetry */}
        </div>
      </CardContent>
    </Card>
  );
}

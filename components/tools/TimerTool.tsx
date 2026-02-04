
import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Pause } from 'lucide-react';

const TimerTool = () => {
    const [hours, setHours] = useState<string>('');
    const [minutes, setMinutes] = useState<string>('');
    const [seconds, setSeconds] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    
    // Audio context for generating sounds
    const audioCtxRef = useRef<AudioContext | null>(null);

    const playNotification = () => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const now = ctx.currentTime;

        // Play 5 brighter, clearer beeps, louder volume
        [0, 0.5, 1.0, 1.5, 2.0].forEach((delay) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Triangle wave produces a brighter tone than sine
            osc.type = 'triangle';
            // Higher pitch (880Hz - A5) is easier to notice
            osc.frequency.setValueAtTime(880, now + delay); 
            
            // Snappier envelope for a clear "ding"
            gain.gain.setValueAtTime(0, now + delay);
            // Increased volume from 0.2 to 0.6 for better noticeability
            gain.gain.linearRampToValueAtTime(0.6, now + delay + 0.02); // Quick fade in
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4); // Smooth fade out

            osc.start(now + delay);
            osc.stop(now + delay + 0.4);
        });
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            playNotification();
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const handleStart = () => {
        // Initialize or resume AudioContext
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }

        // Resume if paused and time remains
        if (timeLeft > 0) {
            setIsRunning(true);
            return;
        }

        // Start new timer
        const h = parseInt(hours || '0', 10);
        const m = parseInt(minutes || '0', 10);
        const s = parseInt(seconds || '0', 10);
        const total = (h * 3600) + (m * 60) + s;

        if (total > 0) {
            setTimeLeft(total);
            setIsRunning(true);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
    }

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setHours('');
        setMinutes('');
        setSeconds('');
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl">
            <div className="mb-12 relative">
                <div className="text-[15vw] md:text-[180px] font-bold text-slate-200 leading-none font-mono tabular-nums tracking-tighter drop-shadow-2xl">
                    {formatTime(timeLeft)}
                </div>
                {isRunning && (
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-blue-500 animate-pulse text-sm font-bold uppercase tracking-widest">
                        Running
                    </div>
                )}
            </div>

            <div className="flex gap-4 mb-12">
                <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="HH"
                    min="0"
                    disabled={isRunning}
                    className="w-32 py-6 text-4xl bg-slate-800 border-2 border-slate-700 rounded-2xl text-center text-white placeholder-slate-600 focus:border-blue-500 focus:ring-0 outline-none disabled:opacity-30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="MM"
                    min="0"
                    max="59"
                    disabled={isRunning}
                    className="w-32 py-6 text-4xl bg-slate-800 border-2 border-slate-700 rounded-2xl text-center text-white placeholder-slate-600 focus:border-blue-500 focus:ring-0 outline-none disabled:opacity-30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <input
                    type="number"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    placeholder="SS"
                    min="0"
                    max="59"
                    disabled={isRunning}
                    className="w-32 py-6 text-4xl bg-slate-800 border-2 border-slate-700 rounded-2xl text-center text-white placeholder-slate-600 focus:border-blue-500 focus:ring-0 outline-none disabled:opacity-30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
            </div>

            <div className="flex gap-6">
                {!isRunning ? (
                    <button
                        onClick={handleStart}
                        className="flex items-center gap-3 px-10 py-4 text-xl font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-2xl transition-all shadow-lg shadow-blue-900/40 hover:scale-105 active:scale-95"
                    >
                        <Play className="fill-current w-6 h-6" /> {timeLeft > 0 ? "Resume" : "Start"}
                    </button>
                ) : (
                    <button
                        onClick={handleStop}
                        className="flex items-center gap-3 px-10 py-4 text-xl font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                        <Pause className="fill-current w-6 h-6" /> Pause
                    </button>
                )}
                
                <button
                    onClick={handleReset}
                    className="flex items-center gap-3 px-10 py-4 text-xl font-bold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                    <RotateCcw className="w-6 h-6" /> Reset
                </button>
            </div>
        </div>
    );
};

export default TimerTool;

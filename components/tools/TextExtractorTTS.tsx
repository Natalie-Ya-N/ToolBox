import React, { useState, useEffect, useRef } from 'react';
import { Volume2, FileText, Upload, Trash, Eye, Play, Pause, Square, Settings } from 'lucide-react';

interface VoiceOption {
    name: string;
    lang: string;
    voice: SpeechSynthesisVoice;
}

const TextExtractorTTS = () => {
    const [text, setText] = useState('');
    const [fileName, setFileName] = useState('');
    const [voices, setVoices] = useState<VoiceOption[]>([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [volume, setVolume] = useState(1);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [status, setStatus] = useState('');

    const synth = window.speechSynthesis;
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synth.getVoices();
            const options = availableVoices.map(v => ({
                name: v.name,
                lang: v.lang,
                voice: v
            }));
            setVoices(options);
            const zhVoice = options.find(v => v.lang.includes('zh'));
            if (zhVoice) setSelectedVoice(zhVoice.name);
            else if (options.length > 0) setSelectedVoice(options[0].name);
        };

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            synth.cancel();
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const buffer = event.target?.result as ArrayBuffer;
                const decoder = new TextDecoder('utf-8');
                const decodedText = decoder.decode(buffer);
                setText(decodedText);
                setStatus('File loaded successfully');
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handlePlay = () => {
        if (!text) {
            setStatus('Please input text first');
            return;
        }

        if (isPaused) {
            synth.resume();
            setIsPaused(false);
            setIsSpeaking(true);
            return;
        }

        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        const voice = voices.find(v => v.name === selectedVoice)?.voice;
        if (voice) utterance.voice = voice;

        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setStatus('Speaking...');
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            setStatus('Done');
        };
        utterance.onerror = (e) => {
            console.error(e);
            setIsSpeaking(false);
            setStatus('Error occurred');
        };

        synth.speak(utterance);
    };

    const handlePause = () => {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            setIsPaused(true);
            setStatus('Paused');
        } else if (synth.paused) {
            synth.resume();
            setIsPaused(false);
            setStatus('Speaking...');
        }
    };

    const handleStop = () => {
        synth.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
        setStatus('Stopped');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Column: Input */}
            <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
                <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                            <FileText className="mr-2 h-4 w-4" /> Text Source
                        </h2>
                        <div className="text-xs text-slate-500 font-mono">
                            {text.length} chars
                        </div>
                    </div>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="flex-1 w-full p-4 bg-transparent text-slate-100 placeholder-slate-600 outline-none resize-none font-sans leading-relaxed text-sm"
                        placeholder="Type or paste text here..."
                    />
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-6">
                    <div className="border-2 border-dashed border-slate-700 hover:border-blue-500/50 rounded-xl p-6 text-center transition-colors cursor-pointer relative group bg-slate-950/30">
                        <input 
                            type="file" 
                            accept=".txt" 
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                            <p className="text-slate-400 text-sm font-medium">Drop .txt file here</p>
                        </div>
                        {fileName && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                <span className="text-xs font-medium text-blue-300">{fileName}</span>
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    setFileName('');
                                    setText('');
                                }} className="text-slate-400 hover:text-red-400 z-10"><Trash className="h-3 w-3"/></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Controls */}
            <div className="flex flex-col gap-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                        <Volume2 className="h-5 w-5 text-blue-500" />
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Controls</h2>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button onClick={handlePlay} disabled={isSpeaking && !isPaused} className="w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <Play className="h-6 w-6 ml-1 fill-current" />
                        </button>
                        <button onClick={handlePause} disabled={!isSpeaking && !isPaused} className="w-14 h-14 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <Pause className="h-6 w-6 fill-current" />
                        </button>
                        <button onClick={handleStop} disabled={!isSpeaking && !isPaused} className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            <Square className="h-6 w-6 fill-current" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Voice</label>
                            <select 
                                value={selectedVoice} 
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="w-full p-3 border border-slate-700 rounded-xl bg-slate-950 text-slate-200 text-sm focus:border-blue-500 outline-none transition-colors"
                            >
                                {voices.map(v => (
                                    <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                                ))}
                            </select>
                        </div>

                        {[
                            { label: 'Speed', val: rate, set: setRate, min: 0.5, max: 2 },
                            { label: 'Pitch', val: pitch, set: setPitch, min: 0.5, max: 2 },
                            { label: 'Volume', val: volume, set: setVolume, min: 0, max: 1 }
                        ].map((control) => (
                            <div key={control.label} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                                    <span>{control.label}</span>
                                    <span className="text-blue-400">{control.label === 'Volume' ? Math.round(control.val * 100) + '%' : control.val + 'x'}</span>
                                </div>
                                <input 
                                    type="range" min={control.min} max={control.max} step="0.1" 
                                    value={control.val} onChange={(e) => control.set(parseFloat(e.target.value))}
                                    className="w-full accent-blue-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>

                    {status && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-center text-xs font-mono text-blue-400">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextExtractorTTS;
import React, { useState, useRef } from 'react';
import { RotateCcw, Palette, Copy, Check } from 'lucide-react';

const DEFAULTS = {
    '--c-bg': '#050A15',
    '--c-title': '#FFFFFF',
    '--c-shape-1': '#3AA99F',
    '--c-shape-2': '#DA702C',
    '--c-shape-3': '#879A39',
    '--c-shape-4': '#8B7EC8',
    '--c-shape-5': '#4385BE',
    '--c-shape-6': '#d0a215',
    '--c-data': '#AF3029',
    '--c-body': '#cbd5e1',
    '--c-sub': '#94A3B8'
};

interface ControlRowProps {
    label: string;
    cssVar: keyof typeof DEFAULTS;
    value: string;
    onChange: (key: keyof typeof DEFAULTS, value: string) => void;
    onCopy: (key: string, value: string) => void;
    copiedKey: string | null;
}

const ControlRow = ({ label, cssVar, value, onChange, onCopy, copiedKey }: ControlRowProps) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-3 hover:bg-slate-800/50 transition-all rounded-lg my-1 group gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover:text-slate-200 transition-colors shrink-0">{label}</label>
        <div className="flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-full ring-1 ring-slate-700 overflow-hidden shrink-0 cursor-pointer hover:ring-slate-500 transition-all shadow-sm">
                <input 
                    type="color" 
                    value={value} 
                    onChange={(e) => onChange(cssVar, e.target.value)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] p-0 m-0 cursor-pointer border-0 bg-transparent"
                />
            </div>
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-md overflow-hidden focus-within:border-blue-500 transition-all">
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => onChange(cssVar, e.target.value)}
                    maxLength={7}
                    className="w-20 py-1 px-2 font-mono text-xs font-bold text-slate-300 bg-transparent outline-none uppercase"
                />
                <div className="flex border-l border-slate-800 bg-slate-900/50">
                    <button 
                        onClick={() => onCopy(cssVar, value)}
                        className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                        title="Copy Hex"
                    >
                        {copiedKey === cssVar ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const ColorDebugger = () => {
    const [colors, setColors] = useState(DEFAULTS);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateColor = (key: keyof typeof DEFAULTS, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const resetColors = () => {
        setColors(DEFAULTS);
    };

    const handleCopy = async (key: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value.toUpperCase());
            setCopiedKey(key);
            setTimeout(() => setCopiedKey(null), 1500);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 lg:m-0 m-[-8px]">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 bg-slate-900/80 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col z-10 font-sans shrink-0 max-h-[40vh] lg:max-h-full">
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <h1 className="text-sm font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                        <Palette className="w-4 h-4 text-blue-500" />
                        Palette Controls
                    </h1>
                    <button 
                        onClick={resetColors}
                        className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-800"
                        title="Reset All Defaults"
                    >
                        <RotateCcw className="w-4 h-4"/>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="space-y-1">
                        <ControlRow label="Background" cssVar="--c-bg" value={colors['--c-bg']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                        <ControlRow label="Big Title" cssVar="--c-title" value={colors['--c-title']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                    </div>
                    
                    <div>
                        <div className="mb-2 px-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">Shapes</div>
                        <div className="bg-slate-950/30 rounded-lg border border-slate-800/50 p-1">
                            <ControlRow label="Shape 1" cssVar="--c-shape-1" value={colors['--c-shape-1']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                            <ControlRow label="Shape 2" cssVar="--c-shape-2" value={colors['--c-shape-2']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                            <ControlRow label="Shape 3" cssVar="--c-shape-3" value={colors['--c-shape-3']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                            <ControlRow label="Shape 4" cssVar="--c-shape-4" value={colors['--c-shape-4']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                            <ControlRow label="Shape 5" cssVar="--c-shape-5" value={colors['--c-shape-5']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                            <ControlRow label="Shape 6" cssVar="--c-shape-6" value={colors['--c-shape-6']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                        </div>
                    </div>

                    <div className="pb-4">
                        <div className="mb-2 px-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">Typography</div>
                        <div className="bg-slate-950/30 rounded-lg border border-slate-800/50 p-1">
                            <ControlRow label="Key Data" cssVar="--c-data" value={colors['--c-data']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                            <ControlRow label="Body Text" cssVar="--c-body" value={colors['--c-body']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                            <ControlRow label="Sub Text" cssVar="--c-sub" value={colors['--c-sub']} onChange={updateColor} onCopy={handleCopy} copiedKey={copiedKey} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Area */}
            <div 
                ref={containerRef}
                className="flex-1 overflow-auto relative transition-colors duration-200"
                style={{ 
                    ...Object.entries(colors).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
                    backgroundColor: 'var(--c-bg)' 
                } as React.CSSProperties}
            >
                <div className="min-h-full w-full flex items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-3xl mx-auto flex flex-col items-center z-10">
                        
                        <div className="mb-6 md:mb-10 text-center">
                            <h1 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--c-title)' }}>Palette Preview</h1>
                        </div>

                        {/* Shapes Container */}
                        <div className="flex justify-center items-center gap-3 md:gap-6 mb-6 md:mb-12 flex-wrap">
                            <svg width="64" height="64" viewBox="0 0 100 100" className="w-10 h-10 md:w-16 md:h-16 transform hover:scale-110 transition-transform drop-shadow-lg" style={{ color: 'var(--c-shape-1)' }}>
                                <circle cx="50" cy="50" r="48" fill="currentColor" />
                            </svg>
                            <svg width="64" height="64" viewBox="0 0 100 100" className="w-10 h-10 md:w-16 md:h-16 transform hover:scale-110 transition-transform drop-shadow-lg" style={{ color: 'var(--c-shape-2)' }}>
                                <rect x="5" y="5" width="90" height="90" rx="15" fill="currentColor" />
                            </svg>
                            <svg width="64" height="64" viewBox="0 0 100 100" className="w-10 h-10 md:w-16 md:h-16 transform hover:scale-110 transition-transform drop-shadow-lg" style={{ color: 'var(--c-shape-3)' }}>
                                 <path d="M50 5 L95 90 L5 90 Z" fill="currentColor"/>
                            </svg>
                            <svg width="64" height="64" viewBox="0 0 100 100" className="w-10 h-10 md:w-16 md:h-16 transform hover:scale-110 transition-transform drop-shadow-lg" style={{ color: 'var(--c-shape-4)' }}>
                                <path d="M50 5 L63 35 L95 38 L72 60 L78 92 L50 78 L22 92 L28 60 L5 38 L37 35 Z" fill="currentColor" />
                            </svg>
                            <svg width="64" height="64" viewBox="0 0 100 100" className="w-10 h-10 md:w-16 md:h-16 transform hover:scale-110 transition-transform drop-shadow-lg" style={{ color: 'var(--c-shape-5)' }}>
                                <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="currentColor" />
                            </svg>
                            <svg width="64" height="64" viewBox="0 0 100 100" className="w-10 h-10 md:w-16 md:h-16 transform hover:scale-110 transition-transform drop-shadow-lg" style={{ color: 'var(--c-shape-6)' }}>
                                <polygon points="50,5 95,50 50,95 5,50" fill="currentColor" />
                            </svg>
                        </div>

                        {/* Content Section */}
                        <div className="w-full rounded-2xl p-5 md:p-8 border border-slate-700/50">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
                                <h2 className="text-xl font-bold" style={{ color: 'var(--c-title)' }}>Detailed Analysis</h2>
                                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: 'var(--c-data)', color: 'var(--c-bg)' }}>
                                    Live Data Feed
                                </span>
                            </div>

                            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--c-body)' }}>
                                This is a live preview of your color palette. You can see how the background, 
                                titles, body text, and UI shapes interact with each other in a real-world layout.
                                Adjust the values on the left to fine-tune your design's accessibility and visual appeal.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <div className="flex-1 min-w-[150px] p-3 rounded-lg border border-slate-800">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--c-sub)' }}>Accessibility Score</h4>
                                    <div className="text-2xl font-mono font-bold" style={{ color: 'var(--c-data)' }}>98/100</div>
                                </div>
                                <div className="flex-1 min-w-[150px] p-3 rounded-lg border border-slate-800">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: 'var(--c-sub)' }}>Contrast Ratio</h4>
                                    <div className="text-2xl font-mono font-bold" style={{ color: 'var(--c-data)' }}>14.2:1</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorDebugger;
import React, { useState, useRef } from 'react';
import { RotateCcw, Palette } from 'lucide-react';

const DEFAULTS = {
    '--c-bg': '#050A15',
    '--c-title': '#FFFFFF',
    '--c-shape-1': '#da702c',
    '--c-shape-2': '#879a39',
    '--c-shape-3': '#8b7ec8',
    '--c-shape-4': '#3aa99f',
    '--c-data': '#a31a1a',
    '--c-body': '#FFFFFF',
    '--c-sub': '#878580'
};

const ColorDebugger = () => {
    const [colors, setColors] = useState(DEFAULTS);
    const containerRef = useRef<HTMLDivElement>(null);

    const updateColor = (key: keyof typeof DEFAULTS, value: string) => {
        setColors(prev => ({ ...prev, [key]: value }));
    };

    const resetColors = () => {
        setColors(DEFAULTS);
    };

    const ControlRow = ({ label, cssVar }: { label: string, cssVar: keyof typeof DEFAULTS }) => (
        <div className="flex items-center justify-between py-2 px-3 hover:bg-slate-800 transition-all rounded-lg my-1 group">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wide group-hover:text-slate-200 transition-colors">{label}</label>
            <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full ring-1 ring-slate-600 overflow-hidden shrink-0 cursor-pointer hover:ring-slate-400 transition-all">
                    <input 
                        type="color" 
                        value={colors[cssVar]} 
                        onChange={(e) => updateColor(cssVar, e.target.value)}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 m-0 cursor-pointer border-0"
                    />
                </div>
                <input 
                    type="text" 
                    value={colors[cssVar]} 
                    onChange={(e) => updateColor(cssVar, e.target.value)}
                    maxLength={7}
                    className="w-24 py-1 text-center font-mono text-sm font-bold text-slate-300 bg-slate-900 border border-slate-700 rounded focus:border-blue-500 outline-none uppercase transition-all"
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-slate-900 rounded-2xl shadow-2xl border border-slate-800">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-96 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col z-10 font-sans">
                <div className="p-4 border-b border-slate-800 bg-slate-900">
                    <h1 className="text-lg font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
                        <Palette className="w-5 h-5 text-blue-500" />
                        Palette Controls
                    </h1>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="space-y-1">
                        <ControlRow label="Background" cssVar="--c-bg" />
                        <ControlRow label="Big Title" cssVar="--c-title" />
                    </div>
                    
                    <div>
                        <div className="mb-3 px-2 text-sm font-black text-blue-500 uppercase tracking-widest">Shapes</div>
                        <div className="bg-slate-950/30 rounded-lg border border-slate-800/50 p-2">
                            <ControlRow label="Shape 1" cssVar="--c-shape-1" />
                            <ControlRow label="Shape 2" cssVar="--c-shape-2" />
                            <ControlRow label="Shape 3" cssVar="--c-shape-3" />
                            <ControlRow label="Shape 4" cssVar="--c-shape-4" />
                        </div>
                    </div>

                    <div>
                        <div className="mb-3 px-2 text-sm font-black text-blue-500 uppercase tracking-widest">Typography</div>
                        <div className="bg-slate-950/30 rounded-lg border border-slate-800/50 p-2">
                            <ControlRow label="Key Data" cssVar="--c-data" />
                            <ControlRow label="Body Text" cssVar="--c-body" />
                            <ControlRow label="Sub Text" cssVar="--c-sub" />
                        </div>
                    </div>

                    <button 
                        onClick={resetColors}
                        className="w-full py-3 px-4 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white text-slate-400 rounded-lg transition-all text-sm font-bold flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                        <RotateCcw className="w-4 h-4"/> Reset Default
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div 
                ref={containerRef}
                className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden relative transition-colors duration-200"
                style={{ 
                    ...colors, 
                    backgroundColor: 'var(--c-bg)' 
                } as React.CSSProperties}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`, backgroundSize: '20px 20px', color: 'var(--c-body)' }}></div>

                <div className="w-full max-w-4xl p-4 md:p-12 transition-all duration-300 transform scale-100 flex flex-col items-center z-10">
                    
                    <div className="mb-8 md:mb-12 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight" style={{ color: 'var(--c-title)' }}>Heading</h1>
                    </div>

                    <div className="flex justify-center items-center gap-4 md:gap-8 mb-8 md:mb-16 flex-wrap">
                        <svg width="60" height="60" viewBox="0 0 100 100" className="transform hover:scale-110 transition-transform md:w-20 md:h-20" style={{ color: 'var(--c-shape-1)' }}>
                            <circle cx="50" cy="50" r="50" fill="currentColor" />
                        </svg>
                        <svg width="60" height="60" viewBox="0 0 100 100" className="transform hover:scale-110 transition-transform md:w-20 md:h-20" style={{ color: 'var(--c-shape-2)' }}>
                            <rect x="10" y="10" width="80" height="80" rx="15" fill="currentColor" />
                        </svg>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="transform hover:scale-110 transition-transform md:w-20 md:h-20" style={{ color: 'var(--c-shape-3)' }}>
                             <path d="M12 2L1.5 21h21L12 2z"/>
                        </svg>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="transform hover:scale-110 transition-transform md:w-20 md:h-20" style={{ color: 'var(--c-shape-4)' }}>
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                    </div>

                    <div className="space-y-4 md:space-y-6 text-center max-w-2xl">
                        <div className="text-3xl md:text-4xl font-black" style={{ color: 'var(--c-data)' }}>
                            Key Data Point
                        </div>

                        <p className="text-lg md:text-xl font-normal leading-relaxed" style={{ color: 'var(--c-body)' }}>
                            This is the body text. Color hierarchy is crucial for visual flow. Use the panel on the left to experiment with different schemes in real-time.
                        </p>

                        <hr className="border-t-2 my-6 md:my-8 opacity-20 w-full" style={{ borderColor: 'var(--c-body)' }} />

                        <div className="text-sm md:text-base font-medium tracking-wide uppercase" style={{ color: 'var(--c-sub)' }}>
                            Secondary Info / Tags #TAG01
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorDebugger;
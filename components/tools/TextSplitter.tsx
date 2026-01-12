import React, { useState } from 'react';
import { Scissors, Copy, Check, FileText, LayoutList } from 'lucide-react';

const SPLIT_SIZE = 2500;

const TextSplitter = () => {
    const [inputText, setInputText] = useState('');
    const [chunks, setChunks] = useState<string[]>([]);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const handleSplit = () => {
        if (!inputText) return;
        
        const newChunks: string[] = [];
        let start = 0;
        const text = inputText;

        while (start < text.length) {
            if (start + SPLIT_SIZE >= text.length) {
                newChunks.push(text.slice(start));
                break;
            }
            let targetEnd = start + SPLIT_SIZE;
            const lastNewLine = text.lastIndexOf('\n', targetEnd);
            
            if (lastNewLine > start) {
                newChunks.push(text.slice(start, lastNewLine + 1));
                start = lastNewLine + 1;
            } else {
                newChunks.push(text.slice(start, targetEnd));
                start = targetEnd;
            }
        }
        setChunks(newChunks);
    };

    const copyChunk = async (text: string, index: number) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row gap-6">
            {/* Input Section */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Input
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-slate-500 font-mono">
                            {inputText.length.toLocaleString()} chars
                        </span>
                        <button 
                            onClick={handleSplit}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-900/20"
                        >
                            <Scissors className="h-3 w-3" /> Split
                        </button>
                    </div>
                </div>
                
                <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your long text here to split it into chunks..."
                    className="flex-1 w-full bg-slate-950/50 p-4 text-slate-300 placeholder-slate-600 outline-none resize-none font-sans leading-relaxed text-sm"
                />
            </div>

            {/* Output Section */}
            <div className="w-full md:w-1/2 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <LayoutList className="h-4 w-4" /> Segments
                    </h2>
                    <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded">
                        {chunks.length} PARTS
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30 scrollbar-thin scrollbar-thumb-slate-700">
                    {chunks.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-xl">
                            <Scissors className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">Ready to split text</p>
                        </div>
                    ) : (
                        chunks.map((chunk, index) => (
                            <div key={index} className="bg-slate-900 rounded-xl border border-slate-800 flex flex-col shadow-sm group hover:border-slate-700 transition-colors">
                                <div className="flex justify-between items-center px-3 py-2 border-b border-slate-800/50">
                                    <span className="text-xs font-bold text-slate-500">PART {index + 1}</span>
                                    <button 
                                        onClick={() => copyChunk(chunk, index)}
                                        className={`text-xs px-2 py-1 rounded transition-colors duration-200 flex items-center gap-1 ${
                                            copiedIndex === index 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                                        }`}
                                    >
                                        {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                        {copiedIndex === index ? 'COPIED' : 'COPY'}
                                    </button>
                                </div>
                                <div className="p-3 text-sm text-slate-300 font-mono leading-relaxed h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                                    {chunk}
                                </div>
                                <div className="px-3 py-1.5 bg-slate-950/30 border-t border-slate-800/50 rounded-b-xl">
                                    <span className="text-[10px] text-slate-600 font-mono">
                                        {chunk.length.toLocaleString()} chars
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextSplitter;
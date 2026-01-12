import React, { useState } from 'react';
import { Copy, ClipboardPaste, Trash2, ArrowUp, ArrowDown, Download, Columns } from 'lucide-react';

interface TextState {
    text: string;
    enCount: number;
    cnCount: number;
}

const DualTextbox = () => {
    const [left, setLeft] = useState<TextState>({ text: '', enCount: 0, cnCount: 0 });
    const [right, setRight] = useState<TextState>({ text: '', enCount: 0, cnCount: 0 });

    const countStats = (text: string) => {
        const englishWords = text.match(/[a-zA-Z]+/g) || [];
        const englishWordCount = text.trim() === '' ? 0 : englishWords.length;
        const chineseChars = text.match(/[\u4E00-\u9FFF]/g) || [];
        return { enCount: englishWordCount, cnCount: chineseChars.length };
    };

    const handleTextChange = (side: 'left' | 'right', text: string) => {
        const stats = countStats(text);
        const newState = { text, ...stats };
        if (side === 'left') setLeft(newState);
        else setRight(newState);
    };

    const handleCopy = async (text: string) => {
        try { await navigator.clipboard.writeText(text); } catch(e) {}
    };

    const handlePaste = async (side: 'left' | 'right') => {
        try {
            const text = await navigator.clipboard.readText();
            handleTextChange(side, text);
        } catch(e) {}
    };

    const handleDelete = (side: 'left' | 'right') => {
        handleTextChange(side, '');
    };

    const moveCursor = (side: 'left' | 'right', pos: 'start' | 'end') => {
        const id = side === 'left' ? 'left-textarea' : 'right-textarea';
        const el = document.getElementById(id) as HTMLTextAreaElement;
        if (el) {
            el.focus();
            if (pos === 'start') el.setSelectionRange(0, 0);
            else el.setSelectionRange(el.value.length, el.value.length);
        }
    };

    const exportHtml = () => {
        const content = `
<!DOCTYPE html>
<html>
<head><title>Exported Text</title><style>body{display:flex;gap:20px;padding:20px;background:#0f172a;color:#f1f5f9;font-family:sans-serif}textarea{width:50%;height:90vh;background:#1e293b;color:#f1f5f9;padding:15px;border:1px solid #334155;border-radius:8px;font-size:16px;line-height:1.5}</style></head>
<body>
<textarea>${left.text}</textarea>
<textarea>${right.text}</textarea>
</body>
</html>`;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dual_text_${new Date().toISOString().slice(0, 10)}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const TextColumn = ({ side, state }: { side: 'left' | 'right', state: TextState }) => (
        <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2 flex items-center gap-2">
                    <Columns className="w-3 h-3" /> {side} Panel
                </span>
                <div className="flex gap-2">
                    <button onClick={() => handleCopy(state.text)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-blue-400 transition-colors" title="Copy"><Copy size={16}/></button>
                    <button onClick={() => handlePaste(side)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-green-400 transition-colors" title="Paste"><ClipboardPaste size={16}/></button>
                    <button onClick={() => handleDelete(side)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400 transition-colors" title="Clear"><Trash2 size={16}/></button>
                </div>
            </div>
            
            <div className="flex-1 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <textarea 
                    id={`${side}-textarea`}
                    value={state.text}
                    onChange={(e) => handleTextChange(side, e.target.value)}
                    className="flex-1 w-full bg-slate-900 p-4 outline-none resize-none font-sans leading-relaxed text-slate-200 text-base"
                    placeholder="Enter text..."
                />
                <div className="flex justify-between items-center px-4 py-2 bg-slate-950/50 text-slate-500 text-xs border-t border-slate-800/50 font-mono">
                    <div className="flex gap-4">
                        <span>EN: <span className="text-slate-300">{state.enCount}</span></span>
                        <span>CN: <span className="text-slate-300">{state.cnCount}</span></span>
                    </div>
                    <div className="flex gap-1">
                        <button onClick={() => moveCursor(side, 'start')} className="p-1 hover:bg-slate-800 rounded transition-colors"><ArrowUp size={14}/></button>
                        <button onClick={() => moveCursor(side, 'end')} className="p-1 hover:bg-slate-800 rounded transition-colors"><ArrowDown size={14}/></button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col relative">
            <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 pb-16">
                <TextColumn side="left" state={left} />
                <TextColumn side="right" state={right} />
            </div>
            <button 
                onClick={exportHtml}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-900/40 flex items-center gap-2 font-bold z-50 transition-all hover:scale-105 active:scale-95"
            >
                <Download size={20} /> Export HTML
            </button>
        </div>
    );
};

export default DualTextbox;
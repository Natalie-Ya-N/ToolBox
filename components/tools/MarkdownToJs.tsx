import React, { useState } from 'react';
import { Copy, Check, ArrowRightLeft } from 'lucide-react';

const MarkdownToJs = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);

    const convert = () => {
        let jsStringLiteral = JSON.stringify(input);
        if (jsStringLiteral.startsWith('"') && jsStringLiteral.endsWith('"')) {
            jsStringLiteral = jsStringLiteral.slice(1, -1);
        }
        setOutput(jsStringLiteral);
    };

    const copyToClipboard = async () => {
        if (!output) return;
        try {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">Input Text / Markdown</label>
                    </div>
                    <textarea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`# Hello World!\n\nPaste your content here...`}
                        className="flex-1 w-full p-4 bg-transparent text-slate-100 placeholder-slate-600 outline-none font-mono text-sm resize-none leading-relaxed"
                    />
                </div>

                <div className="flex items-center justify-center">
                     <button 
                        onClick={convert}
                        className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95 group"
                        title="Convert"
                    >
                        <ArrowRightLeft className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                        <label className="text-sm font-bold text-slate-300 uppercase tracking-wider">JS String Output</label>
                        <button 
                            onClick={copyToClipboard}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                copied 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copied ? 'COPIED' : 'COPY'}
                        </button>
                    </div>
                    <textarea 
                        readOnly
                        value={output}
                        placeholder="Result will appear here..."
                        className="flex-1 w-full p-4 bg-transparent text-blue-300 placeholder-slate-700 outline-none font-mono text-sm resize-none leading-relaxed"
                    />
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-mono text-slate-500">
                <span className="flex items-center gap-2"><span className="text-slate-300">"</span> → <span className="text-slate-300">\"</span></span>
                <span className="flex items-center gap-2"><span className="text-slate-300">\</span> → <span className="text-slate-300">\\</span></span>
                <span className="flex items-center gap-2"><span className="text-slate-300">Newline</span> → <span className="text-slate-300">\n</span></span>
            </div>
        </div>
    );
};

export default MarkdownToJs;
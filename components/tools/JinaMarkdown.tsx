import React, { useState } from 'react';
import { ExternalLink, Trash2, ArrowRight } from 'lucide-react';

const JinaMarkdown = () => {
    const [url, setUrl] = useState('');
    const [convertedUrl, setConvertedUrl] = useState('');

    const handleConvert = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputUrl = e.target.value;
        setUrl(inputUrl);
        if (inputUrl) {
            setConvertedUrl("https://r.jina.ai/" + inputUrl);
        } else {
            setConvertedUrl("");
        }
    };

    const clearInput = () => {
        setUrl('');
        setConvertedUrl('');
    };

    return (
        <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight">
                    Jina Reader
                </h1>
                <p className="text-slate-400 text-lg flex items-center justify-center gap-2">
                    Turn any URL into LLM-friendly Markdown
                    <a href="https://jina.ai/reader/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </p>
            </div>

            <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label htmlFor="urlInput" className="text-sm font-medium text-slate-300 uppercase tracking-wider">Target URL</label>
                            {url && (
                                <button 
                                    onClick={clearInput}
                                    className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 className="h-3 w-3" /> Clear
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                id="urlInput" 
                                value={url}
                                onChange={handleConvert}
                                placeholder="https://example.com/article"
                                className="w-full p-4 pr-12 text-lg rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-slate-100 placeholder-slate-600 shadow-inner font-mono" 
                            />
                        </div>
                    </div>

                    {convertedUrl && (
                        <div className="pt-6 border-t border-slate-800 animate-slide-up">
                            <p className="text-sm font-medium text-slate-300 uppercase tracking-wider mb-3">Reader URL</p>
                            <div className="group relative p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-blue-500/50 transition-colors">
                                <a 
                                    href={convertedUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-lg text-blue-400 hover:text-blue-300 break-all font-mono leading-relaxed"
                                >
                                    <span className="shrink-0 p-2 bg-blue-500/10 rounded-lg"><ArrowRight className="w-4 h-4"/></span>
                                    {convertedUrl}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JinaMarkdown;
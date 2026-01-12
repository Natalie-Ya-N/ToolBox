import React, { useState, useEffect } from 'react';
import { Copy, Trash, Settings, FileText, Code } from 'lucide-react';

const PromptTemplate = () => {
    const [template, setTemplate] = useState('');
    const [variables, setVariables] = useState<string[]>([]);
    const [values, setValues] = useState<Record<string, string>>({});
    const [output, setOutput] = useState('');

    useEffect(() => {
        const regex = /<([^>]+)>/g;
        const matches = new Set<string>();
        let match;
        while ((match = regex.exec(template)) !== null) {
            matches.add(match[1]);
        }
        const newVars = Array.from(matches);
        setVariables(newVars);
    }, [template]);

    useEffect(() => {
        let result = template;
        variables.forEach(v => {
            const val = values[v] || `<${v}>`;
            result = result.split(`<${v}>`).join(val);
        });
        setOutput(result);
    }, [template, variables, values]);

    const handleValueChange = (variable: string, value: string) => {
        setValues(prev => ({ ...prev, [variable]: value }));
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (e) {
            console.error(e);
        }
    };

    const pasteTemplate = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setTemplate(text);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full">
            {/* Left Column: Template & Variables */}
            <div className="flex-1 flex flex-col gap-6 min-h-0">
                {/* Template Input */}
                <div className="flex-[2] bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-lg">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Settings className="w-4 h-4" /> Template
                        </h2>
                        <div className="flex gap-2">
                            <button onClick={pasteTemplate} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-colors">Paste</button>
                            <button onClick={() => setTemplate('')} className="px-3 py-1 bg-slate-800 hover:bg-red-900/50 text-slate-300 hover:text-red-400 rounded-lg text-xs font-bold transition-colors">Clear</button>
                        </div>
                    </div>
                    <textarea 
                        value={template}
                        onChange={(e) => setTemplate(e.target.value)}
                        placeholder="Enter template here using <variable> syntax..."
                        className="flex-1 w-full bg-transparent text-slate-100 p-4 outline-none resize-none font-mono text-sm leading-relaxed placeholder-slate-600"
                    />
                </div>

                {/* Variables Input */}
                <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-lg">
                    <div className="px-4 py-3 border-b border-slate-800 bg-slate-900">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Code className="w-4 h-4" /> Variables
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30 scrollbar-thin scrollbar-thumb-slate-700">
                        {variables.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-600">
                                <p className="text-sm italic">Define variables in template using &lt;brackets&gt;</p>
                            </div>
                        ) : (
                            variables.map(v => (
                                <div key={v} className="space-y-1">
                                    <label className="text-xs font-bold text-blue-400 font-mono">{v}</label>
                                    <textarea 
                                        value={values[v] || ''}
                                        onChange={(e) => handleValueChange(v, e.target.value)}
                                        rows={2}
                                        className="w-full bg-slate-800 p-2 rounded-lg border border-slate-700 focus:border-blue-500 outline-none text-sm text-slate-200 resize-none font-sans"
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Result */}
            <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden shadow-lg min-h-0">
                <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4"/> Result
                    </h2>
                    <button 
                        onClick={() => copyToClipboard(output)} 
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold text-white transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-900/20"
                    >
                        <Copy className="w-3 h-3" /> Copy
                    </button>
                </div>
                <div className="flex-1 w-full bg-slate-950/50 p-4 text-slate-200 overflow-auto whitespace-pre-wrap font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
                    {output}
                </div>
            </div>
        </div>
    );
};

export default PromptTemplate;
import React, { useState, useEffect } from 'react';
import { TOOLS_DATA } from './NotebookLMData';
import { FileText, Copy, Wand2, Check, Brain, ExternalLink } from 'lucide-react';

const NotebookLMGenerator = () => {
    const [selectedToolIndex, setSelectedToolIndex] = useState(0);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [copied, setCopied] = useState(false);

    const currentTool = TOOLS_DATA[selectedToolIndex];
    const roles = Object.keys(currentTool.roles);
    
    // Set default role when tool changes
    useEffect(() => {
        if (roles.length > 0) {
            setSelectedRole(roles[0]);
        }
        setFormValues({});
        setGeneratedPrompt('');
    }, [selectedToolIndex]);

    const currentRoleData = currentTool.roles[selectedRole as keyof typeof currentTool.roles];

    const handleInputChange = (key: string, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleMultiSelectChange = (key: string, value: string) => {
        setFormValues(prev => {
            const currentValues = prev[key] || [];
            if (currentValues.includes(value)) {
                return { ...prev, [key]: currentValues.filter((v: string) => v !== value) };
            } else {
                return { ...prev, [key]: [...currentValues, value] };
            }
        });
    };

    const generatePrompt = () => {
        if (!currentRoleData) return;

        let prompt = currentRoleData.template;
        const vars = currentRoleData.vars;

        Object.keys(vars).forEach(key => {
            const isMulti = key.endsWith('__multi');
            // Cast to any to avoid TypeScript inference error (Property 'length' does not exist on type 'never')
            const varConfig = vars[key as keyof typeof vars] as any;
            let value = formValues[key];

            if (Array.isArray(varConfig)) {
                if (!value) {
                    // Default to first option if not selected (for single select)
                    if (!isMulti && varConfig.length > 0) {
                        value = varConfig[0];
                    } else if (isMulti) {
                        value = [];
                    }
                }

                if (isMulti && Array.isArray(value)) {
                    // Format multi-select values as a list
                    const formattedList = value.length > 0 
                        ? value.map((item: string) => `• ${item}`).join('\n')
                        : '• (无)';
                    prompt = prompt.replace(`{${key}}`, formattedList);
                } else {
                    prompt = prompt.replace(`{${key}}`, value);
                }
            } else {
                // Handle text input variables (strings in config)
                prompt = prompt.replace(`{${key}}`, value || '');
            }
        });

        setGeneratedPrompt(prompt);
    };

    const copyToClipboard = async () => {
        if (!generatedPrompt) return;
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Left Panel: Configuration */}
                <div className="w-full lg:w-[420px] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 shrink-0">
                    
                    {/* Tool Selector */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg shrink-0">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                            Studio Tool
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {TOOLS_DATA.map((tool, index) => (
                                <button
                                    key={tool.StudioTool}
                                    onClick={() => setSelectedToolIndex(index)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedToolIndex === index
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                                    }`}
                                >
                                    {tool.StudioTool}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Role Selector & Description */}
                    {currentRoleData && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-2 shrink-0">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                                    Role / Mode
                                </label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:border-blue-500 outline-none transition-colors"
                                >
                                    {roles.map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {currentRoleData.description}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Dynamic Form */}
                    {currentRoleData && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2 mb-4">
                                <Brain className="w-4 h-4" /> Parameters
                            </h3>
                            
                            <div className="space-y-4">
                                {Object.entries(currentRoleData.vars).map(([key, options]) => {
                                    const isMulti = key.endsWith('__multi');
                                    const isArray = Array.isArray(options);
                                    const label = key.replace('__multi', '').replace('_', ' ').toUpperCase();
                                    
                                    return (
                                        <div key={key} className={`flex ${isMulti ? 'items-start' : 'items-center'} gap-2`}>
                                            <label className="text-xs font-bold text-blue-400 font-mono w-24 shrink-0 pt-2 break-words">
                                                {label}
                                            </label>
                                            
                                            <div className="flex-1 min-w-0">
                                                {isArray ? (
                                                    isMulti ? (
                                                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto bg-slate-950/30 p-2 rounded-xl border border-slate-800/50 scrollbar-thin scrollbar-thumb-slate-700">
                                                            {(options as string[]).map((opt) => (
                                                                <label key={opt} className="flex items-start gap-3 p-2 hover:bg-slate-800/50 rounded-lg cursor-pointer transition-colors group">
                                                                    <div className="relative flex items-center mt-0.5">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={(formValues[key] || []).includes(opt)}
                                                                            onChange={() => handleMultiSelectChange(key, opt)}
                                                                            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-slate-600 checked:bg-blue-600 checked:border-blue-600 transition-all"
                                                                        />
                                                                        <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
                                                                    </div>
                                                                    <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors select-none leading-tight">{opt}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <select
                                                                value={formValues[key] || ''}
                                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-blue-500 outline-none appearance-none transition-colors text-sm truncate pr-8"
                                                            >
                                                                <option value="" disabled>Select an option...</option>
                                                                {(options as string[]).map((opt) => (
                                                                    <option key={opt} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                            </div>
                                                        </div>
                                                    )
                                                ) : (
                                                    <input 
                                                        type="text"
                                                        value={formValues[key] || ''}
                                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                                        placeholder={options as string}
                                                        className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:border-blue-500 outline-none transition-colors text-sm placeholder-slate-600"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Output */}
                <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg h-[600px] lg:h-auto">
                    <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center shrink-0">
                        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Generated Prompt
                        </h2>
                        <div className="flex gap-2">
                            <button 
                                onClick={generatePrompt}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-900/20"
                            >
                                <Wand2 className="h-3 w-3" /> Generate
                            </button>
                            <button 
                                onClick={copyToClipboard}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                    copied 
                                    ? 'bg-green-500/20 text-green-400' 
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 relative bg-slate-950/50">
                        <textarea 
                            value={generatedPrompt}
                            readOnly
                            placeholder="Select options and click Generate..."
                            className="absolute inset-0 w-full h-full p-6 bg-transparent text-slate-200 placeholder-slate-600 outline-none resize-none font-mono text-sm leading-relaxed"
                        />
                    </div>
                </div>
            </div>

            <div className="text-center pb-2">
                <a 
                    href="https://gist.githubusercontent.com/weihua-studio/051d3a6a6a50ef1690166b9502212c5e/raw/0cc983bef094bbf773da7ab78111efb0ff469264/library_index.json" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-600 hover:text-blue-400 transition-colors flex items-center justify-center gap-1"
                >
                    <ExternalLink className="w-3 h-3" />
                    Reference Source: weihua-studio/library_index.json
                </a>
            </div>
        </div>
    );
};

export default NotebookLMGenerator;
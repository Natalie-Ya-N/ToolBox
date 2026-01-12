import React, { useState, useEffect, useRef } from 'react';
import { Save, Copy, Trash2, StickyNote, ChevronDown, Check } from 'lucide-react';

const TemplateNote = () => {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('template_note_text');
        if (saved) setText(saved);
    }, []);

    const saveToStorage = (value: string) => {
        localStorage.setItem('template_note_text', value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setText(newVal);
        saveToStorage(newVal);
    };

    const insertAtCursor = (textToInsert: string, type: 'block' | 'inline' | 'wrap' = 'inline') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = textarea.value;
        
        let insertion = textToInsert;
        let newCursorPos = start + textToInsert.length;

        // Logic adapted from the provided script
        if (type === 'wrap') {
            // For code blocks logic from original script
            insertion = textToInsert + '\n';
            newCursorPos = start + textToInsert.length;
        } else if (textToInsert.endsWith('\n')) {
             // If the inserted text naturally ends with newline
             newCursorPos = start + textToInsert.length;
        }

        const newText = currentText.substring(0, start) + insertion + currentText.substring(end);
        
        setText(newText);
        saveToStorage(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            insertAtCursor(value + '\n', 'inline');
            e.target.value = ""; // Reset dropdown
        }
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard');
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear the note?')) {
            setText('');
            saveToStorage('');
            showNotification('Cleared');
        }
    };

    const handleManualSave = () => {
        saveToStorage(text);
        showNotification('Saved manually');
    };

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 2000);
    };

    const elements = [
        "# Role:", "# Output Language:", "# Context:", "# Task Descriptions:", 
        "# Goals:", "# Target Audience:", "# Instructions:", "# Workflow:", 
        "# Skills:", "# Key Results:", "# Examples: ", "# Constraints:", 
        "# Output Specifications:", "# Initialization:"
    ];

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg h-full">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-800 bg-slate-900 flex flex-col md:flex-row gap-4 justify-between items-center z-10">
                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="relative group">
                            <select 
                                onChange={handleDropdownChange}
                                className="appearance-none bg-slate-800 hover:bg-slate-700 text-slate-200 pl-4 pr-10 py-2 rounded-lg border border-slate-700 focus:border-blue-500 outline-none transition-all text-sm font-medium cursor-pointer"
                                defaultValue=""
                            >
                                <option value="" disabled>Insert Element...</option>
                                {elements.map(el => (
                                    <option key={el} value={el}>{el}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="h-8 w-px bg-slate-700 mx-1 hidden md:block"></div>

                        <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                            <button onClick={() => insertAtCursor('# ')} className="px-3 py-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-mono text-sm font-bold transition-colors" title="Header 1">#</button>
                            <button onClick={() => insertAtCursor('## ')} className="px-3 py-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-mono text-sm font-bold transition-colors" title="Header 2">##</button>
                            <button onClick={() => insertAtCursor('```\n', 'wrap')} className="px-3 py-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-mono text-sm font-bold transition-colors" title="Code Block">'''</button>
                            <button onClick={() => insertAtCursor('"""\n', 'wrap')} className="px-3 py-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-mono text-sm font-bold transition-colors" title="Content Block">"""</button>
                            <button onClick={() => insertAtCursor('---\n', 'wrap')} className="px-3 py-1.5 hover:bg-slate-700 rounded text-slate-300 hover:text-white font-mono text-sm font-bold transition-colors" title="Divider">---</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                         {notification && (
                            <span className="text-xs text-green-400 font-medium animate-fade-in flex items-center gap-1 mr-2">
                                <Check className="w-3 h-3" /> {notification}
                            </span>
                        )}
                        <button 
                            onClick={handleManualSave}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button 
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Copy className="w-4 h-4" /> Copy
                        </button>
                        <button 
                            onClick={handleClear}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Trash2 className="w-4 h-4" /> Clear
                        </button>
                    </div>
                </div>

                {/* Editor */}
                <textarea 
                    ref={textareaRef}
                    value={text}
                    onChange={handleChange}
                    className="flex-1 w-full bg-slate-950 p-6 text-slate-200 placeholder-slate-600 outline-none resize-none font-mono text-sm leading-relaxed"
                    placeholder="# Start writing your temporary note..."
                    spellCheck={false}
                />
                
                {/* Status Bar */}
                <div className="px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-500 font-mono flex justify-between">
                    <span>{text.length} characters</span>
                    <span>Auto-saving enabled</span>
                </div>
            </div>
        </div>
    );
};

export default TemplateNote;
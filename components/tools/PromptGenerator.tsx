import React, { useState, useEffect, useRef } from 'react';
import { 
    Wand2, Save, FolderOpen, RotateCcw, Copy, Download, 
    Plus, Minus, Edit3, FileText, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';

// Default initial values from the provided HTML
const INITIAL_DATA = {
    scene: "中国大学宿舍，千禧年，上铺",
    gender: "女性",
    age: "19岁左右",
    race: "东亚",
    bodyType: "苗条，腰线分明；身材比例自然",
    skinTone: "浅中性色调",
    hairLength: "前刘海加后马尾，不失女人的英气妩媚",
    hairStyle: "刘海",
    hairColor: "黑色，有发丝",
    posture: "坐在电脑桌旁边的黑色椅子上",
    rightHand: "撑着床边",
    leftArm: "在躯干旁自然下垂",
    torso: "身体轻微后仰",
    top: "亚麻男士白色衬衫低垂，扣子都是系上的",
    bottom: "穿着米白色的长百褶裙",
    socks: "不体现",
    accessories: "无",
    environmentDesc: "可以看到大学宿舍的下铺",
    lightSource: "比较暗，是来自宿舍的灯光",
    lightQuality: "千禧年有颗粒的画质",
    whiteBalance: "5200",
    cameraModel: "佳能相机",
    focalLength: "35",
    aperture: "1.8",
    iso: "100",
    shutterSpeed: "0.01",
    exposureComp: "-0.3",
    focus: "对焦于镜中影像的躯干和短裤",
    depthOfField: "人物大特写",
    aspectRatio: "9:16",
    angle: "特写",
    compositionNote: "保持主体居中，人物为主体，所有的元素应该都作为背景有一定虚化",
};

const INITIAL_FURNITURE = [""];
const INITIAL_NEGATIVE = [
    "任何地方出现粉色/品红色",
    "美颜滤镜/磨皮皮肤；没有毛孔的外观",
    "夸张或扭曲的人体结构",
    "NSFW，透视面料，走光",
    "商标，品牌名，可读的用户界面文本",
    "虚假的人像模式模糊，CGI/插画感"
];

const PromptGenerator = () => {
    const [formData, setFormData] = useState(INITIAL_DATA);
    const [furniture, setFurniture] = useState<string[]>(INITIAL_FURNITURE);
    const [negativePrompts, setNegativePrompts] = useState<string[]>(INITIAL_NEGATIVE);
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleArrayChange = (
        index: number, 
        value: string, 
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setter(prev => {
            const newArr = [...prev];
            newArr[index] = value;
            return newArr;
        });
    };

    const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, ""]);
    };

    const removeArrayItem = (
        index: number, 
        arr: string[], 
        setter: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        if (arr.length <= 1) {
            showToast('error', '至少需要保留一项');
            return;
        }
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const generatePrompt = () => {
        setIsLoading(true);
        // Simulate processing delay
        setTimeout(() => {
            try {
                if (!formData.scene.trim()) {
                    showToast('error', '场景描述不能为空');
                    setIsLoading(false);
                    return;
                }

                let prompt = `### **场景**\n${formData.scene}\n\n---\n\n`;
                
                prompt += `### **主体**\n`;
                prompt += `* **性别表现**: ${formData.gender}\n`;
                prompt += `* **年龄段**: ${formData.age}\n`;
                prompt += `* **种族**: ${formData.race}\n`;
                prompt += `* **身材**: ${formData.bodyType}\n`;
                prompt += `* **肤色**: ${formData.skinTone}\n`;
                prompt += `* **发型**:\n`;
                prompt += `    * **长度**: ${formData.hairLength}\n`;
                prompt += `    * **样式**: ${formData.hairStyle}\n`;
                prompt += `    * **颜色**: ${formData.hairColor}\n`;
                prompt += `* **姿势**:\n`;
                prompt += `    * **站姿**: ${formData.posture}\n`;
                prompt += `    * **右手**: ${formData.rightHand}\n`;
                prompt += `    * **左臂**: ${formData.leftArm}\n`;
                prompt += `    * **躯干**: ${formData.torso}\n`;
                prompt += `* **着装**:\n`;
                prompt += `    * **上衣**: ${formData.top}\n`;
                prompt += `    * **下装**: ${formData.bottom}\n`;
                prompt += `    * **袜子**: ${formData.socks}\n`;
                prompt += `    * **配饰**: ${formData.accessories}\n\n`;
                
                prompt += `---\n\n`;
                
                prompt += `### **环境**\n`;
                prompt += `* **描述**: ${formData.environmentDesc}\n`;
                const validFurniture = furniture.filter(f => f.trim() !== '');
                if (validFurniture.length > 0) {
                    prompt += `* **陈设**:\n`;
                    validFurniture.forEach(item => {
                        prompt += `    * ${item}\n`;
                    });
                }
                prompt += `\n`;
                
                prompt += `---\n\n`;
                
                prompt += `### **灯光**\n`;
                prompt += `* **光源**: ${formData.lightSource}\n`;
                prompt += `* **光线质感**: ${formData.lightQuality}\n`;
                prompt += `* **白平衡**: ${formData.whiteBalance}K\n\n`;
                
                prompt += `---\n\n`;
                
                prompt += `### **相机**\n`;
                prompt += `* **模式**: ${formData.cameraModel}\n`;
                prompt += `* **等效焦距**: ${formData.focalLength}mm\n`;
                prompt += `* **曝光**:\n`;
                prompt += `    * **光圈**: f/${formData.aperture}\n`;
                prompt += `    * **感光度**: ISO ${formData.iso}\n`;
                prompt += `    * **快门速度**: ${formData.shutterSpeed}秒\n`;
                prompt += `    * **曝光补偿**: ${formData.exposureComp}EV\n`;
                prompt += `* **对焦**: ${formData.focus}\n`;
                prompt += `* **景深**: ${formData.depthOfField}\n`;
                prompt += `* **构图**:\n`;
                prompt += `    * **宽高比**: ${formData.aspectRatio}\n`;
                prompt += `    * **角度**: ${formData.angle}\n`;
                prompt += `    * **备注**: ${formData.compositionNote}\n\n`;
                
                prompt += `---\n\n`;
                
                prompt += `### **负面提示词**\n`;
                const validNegatives = negativePrompts.filter(n => n.trim() !== '');
                if (validNegatives.length > 0) {
                    validNegatives.forEach(item => {
                        prompt += `* ${item}\n`;
                    });
                } else {
                    prompt += `* 无\n`;
                }

                setGeneratedPrompt(prompt);
                showToast('success', '提示词生成成功');
                
                // Scroll to result
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);

            } catch (error) {
                console.error(error);
                showToast('error', '生成失败');
            } finally {
                setIsLoading(false);
            }
        }, 600);
    };

    const handleReset = () => {
        setFormData(INITIAL_DATA);
        setFurniture(INITIAL_FURNITURE);
        setNegativePrompts(INITIAL_NEGATIVE);
        setGeneratedPrompt('');
        showToast('success', '表单已重置');
    };

    const handleCopy = async () => {
        if (!generatedPrompt) return;
        try {
            await navigator.clipboard.writeText(generatedPrompt);
            showToast('success', '已复制到剪贴板');
        } catch (e) {
            showToast('error', '复制失败');
        }
    };

    const handleDownload = () => {
        if (!generatedPrompt) return;
        const blob = new Blob([generatedPrompt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '提示词_' + new Date().toISOString().slice(0, 10) + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('success', '已下载文件');
    };

    const handleSaveTemplate = () => {
        const data = {
            formData,
            furniture,
            negativePrompts
        };
        localStorage.setItem('promptTemplate', JSON.stringify(data));
        showToast('success', '模板已保存');
    };

    const handleLoadTemplate = () => {
        try {
            const saved = localStorage.getItem('promptTemplate');
            if (!saved) {
                showToast('error', '没有保存的模板');
                return;
            }
            const data = JSON.parse(saved);
            if (data.formData) setFormData(data.formData);
            if (data.furniture) setFurniture(data.furniture);
            if (data.negativePrompts) setNegativePrompts(data.negativePrompts);
            showToast('success', '模板已加载');
        } catch (e) {
            showToast('error', '加载模板失败');
        }
    };

    const renderPreview = (text: string) => {
        if (!text) return <p className="text-slate-500 italic text-center">点击"生成提示词"按钮查看预览</p>;
        
        // Simple manual parsing to avoid dangerouslySetInnerHTML for everything
        const lines = text.split('\n');
        return lines.map((line, idx) => {
            if (line.startsWith('### **')) {
                const content = line.replace(/### \*\*(.*?)\*\*/, '$1');
                return <h3 key={idx} className="font-bold text-lg text-slate-200 mt-4 mb-2">{content}</h3>;
            }
            if (line.trim() === '---') {
                return <hr key={idx} className="my-4 border-slate-700" />;
            }
            if (line.startsWith('* **')) {
                const parts = line.match(/\* \*\*(.*?)\*\*: (.*)/);
                if (parts) {
                    return (
                        <p key={idx} className="mb-1 text-slate-300">
                            <strong className="text-slate-200">• {parts[1]}:</strong> {parts[2]}
                        </p>
                    );
                }
            }
            if (line.startsWith('    * **')) {
                const parts = line.match(/    \* \*\*(.*?)\*\*: (.*)/);
                if (parts) {
                    return (
                        <p key={idx} className="mb-1 ml-6 text-slate-400">
                            <span className="text-slate-300">• {parts[1]}:</span> {parts[2]}
                        </p>
                    );
                }
            }
             if (line.startsWith('    * ')) {
                return <p key={idx} className="mb-1 ml-6 text-slate-400">• {line.replace('    * ', '')}</p>;
            }
            if (line.startsWith('* ')) {
                return <p key={idx} className="mb-1 text-slate-300"><strong>•</strong> {line.replace('* ', '')}</p>;
            }
            if (line.trim() === '') return <br key={idx} />;
            return <p key={idx} className="text-slate-300">{line}</p>;
        });
    };

    const InputField = ({ label, name, list }: { label: string, name: keyof typeof INITIAL_DATA, list?: string[] }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-1">{label}</label>
            <input 
                type="text" 
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                list={list ? `${name}-options` : undefined}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-600 transition-colors"
            />
            {list && (
                <datalist id={`${name}-options`}>
                    {list.map(opt => <option key={opt} value={opt} />)}
                </datalist>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header / Nav Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm">
                <div className="flex items-center">
                    <Wand2 className="text-blue-500 w-6 h-6 mr-3" />
                    <span className="font-bold text-xl text-slate-100">Portrait Prompt Generator</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handleSaveTemplate} className="flex items-center px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium transition-colors">
                        <Save className="w-4 h-4 mr-2" /> 保存模板
                    </button>
                    <button onClick={handleLoadTemplate} className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors">
                        <FolderOpen className="w-4 h-4 mr-2" /> 加载模板
                    </button>
                </div>
            </div>

            {/* Main Form */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
                    <Edit3 className="text-blue-500 mr-2 w-5 h-5" /> 提示词配置
                </h2>

                <div className="space-y-6">
                    {/* Scene */}
                    <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/30">
                        <h3 className="font-bold text-lg text-slate-200 mb-4">场景</h3>
                        <InputField label="场景描述" name="scene" />
                    </div>

                    {/* Subject */}
                    <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/30">
                        <h3 className="font-bold text-lg text-slate-200 mb-4">主体</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="性别表现" name="gender" list={["女性", "男性", "中性"]} />
                            <InputField label="年龄段" name="age" />
                            <InputField label="种族" name="race" list={["东亚", "欧洲", "非洲", "美洲", "其他"]} />
                            <InputField label="身材" name="bodyType" />
                            <InputField label="肤色" name="skinTone" list={["浅中性色调", "深中性色调", "冷色调", "暖色调"]} />
                        </div>

                        <div className="mt-5">
                            <h4 className="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider">发型</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <InputField label="长度" name="hairLength" />
                                <InputField label="样式" name="hairStyle" />
                                <InputField label="颜色" name="hairColor" />
                            </div>
                        </div>

                        <div className="mt-5">
                            <h4 className="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider">姿势</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="站姿" name="posture" />
                                <InputField label="右手" name="rightHand" />
                                <InputField label="左臂" name="leftArm" />
                                <InputField label="躯干" name="torso" />
                            </div>
                        </div>

                        <div className="mt-5">
                            <h4 className="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider">着装</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="上衣" name="top" />
                                <InputField label="下装" name="bottom" />
                                <InputField label="袜子" name="socks" />
                                <InputField label="配饰" name="accessories" />
                            </div>
                        </div>
                    </div>

                    {/* Environment */}
                    <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/30">
                        <h3 className="font-bold text-lg text-slate-200 mb-4">环境</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-400 mb-1">描述</label>
                            <textarea 
                                name="environmentDesc"
                                value={formData.environmentDesc}
                                onChange={handleInputChange}
                                rows={2}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-200 placeholder-slate-600 transition-colors"
                            />
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider">陈设</h4>
                            <div className="space-y-3">
                                {furniture.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <input 
                                            type="text" 
                                            value={item}
                                            onChange={(e) => handleArrayChange(idx, e.target.value, setFurniture)}
                                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-200"
                                        />
                                        {idx === furniture.length - 1 ? (
                                            <button onClick={() => addArrayItem(setFurniture)} className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                                        ) : (
                                            <button onClick={() => removeArrayItem(idx, furniture, setFurniture)} className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                                        )}
                                    </div>
                                ))}
                                {furniture.length > 0 && furniture[furniture.length - 1] !== '' && (
                                     <button onClick={() => addArrayItem(setFurniture)} className="w-full py-2 border-2 border-dashed border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600 rounded-lg transition-colors text-sm flex justify-center items-center gap-2">
                                        <Plus className="w-4 h-4" /> 添加陈设
                                     </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lighting */}
                    <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/30">
                        <h3 className="font-bold text-lg text-slate-200 mb-4">灯光</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputField label="光源" name="lightSource" />
                            <InputField label="光线质感" name="lightQuality" />
                            <InputField label="白平衡 (K)" name="whiteBalance" />
                        </div>
                    </div>

                    {/* Camera */}
                    <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/30">
                        <h3 className="font-bold text-lg text-slate-200 mb-4">相机</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="模式" name="cameraModel" list={["佳能相机", "尼康相机", "索尼相机", "富士相机"]} />
                            <InputField label="等效焦距 (mm)" name="focalLength" />
                            
                            <div className="md:col-span-2">
                                <h4 className="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider">曝光</h4>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <InputField label="光圈 (f)" name="aperture" />
                                    <InputField label="感光度 (ISO)" name="iso" />
                                    <InputField label="快门速度 (秒)" name="shutterSpeed" />
                                    <InputField label="曝光补偿 (EV)" name="exposureComp" />
                                </div>
                            </div>
                            
                            <InputField label="对焦" name="focus" />
                            <InputField label="景深" name="depthOfField" />
                            
                            <div className="md:col-span-2">
                                <h4 className="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider">构图</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <InputField label="宽高比" name="aspectRatio" list={["9:16", "1:1", "3:2", "16:9", "4:3"]} />
                                    <InputField label="角度" name="angle" />
                                    <div className="md:col-span-1">
                                        <InputField label="构图备注" name="compositionNote" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Negative Prompts */}
                    <div className="border border-slate-800 rounded-lg p-5 bg-slate-950/30">
                        <h3 className="font-bold text-lg text-slate-200 mb-4">负面提示词</h3>
                        <div className="space-y-3">
                            {negativePrompts.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={item}
                                        onChange={(e) => handleArrayChange(idx, e.target.value, setNegativePrompts)}
                                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-200"
                                        placeholder="输入负面提示词"
                                    />
                                    <button onClick={() => removeArrayItem(idx, negativePrompts, setNegativePrompts)} className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"><Minus className="w-4 h-4" /></button>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem(setNegativePrompts)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex justify-center items-center gap-2">
                                <Plus className="w-4 h-4" /> 添加负面提示词
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <button onClick={handleReset} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center">
                            <RotateCcw className="w-4 h-4 mr-2" /> 重置
                        </button>
                        <button onClick={generatePrompt} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-900/40 flex items-center">
                            <Wand2 className="w-4 h-4 mr-2" /> 生成提示词
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div ref={resultRef} className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg">
                <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
                    <FileText className="text-blue-500 mr-2 w-5 h-5" /> 生成结果
                </h2>
                
                <div className="mb-6">
                    <textarea 
                        value={generatedPrompt}
                        readOnly
                        rows={8}
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-200 font-mono text-sm leading-relaxed resize-none"
                    />
                </div>

                <div className="flex gap-4">
                    <button onClick={handleCopy} className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center">
                        <Copy className="w-4 h-4 mr-2" /> 复制
                    </button>
                    <button onClick={handleDownload} className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors flex justify-center items-center">
                        <Download className="w-4 h-4 mr-2" /> 下载
                    </button>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-slate-400 mb-3 text-sm uppercase tracking-wider">预览效果</h3>
                    <div className="bg-slate-950/50 p-6 rounded-lg border border-slate-800 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                        {renderPreview(generatedPrompt)}
                    </div>
                </div>
            </div>

            {/* Loading Modal */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
                    <div className="bg-slate-900 rounded-xl p-8 shadow-2xl border border-slate-800 flex items-center flex-col gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-slate-200 font-medium">生成中，请稍候...</p>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {notification && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center z-50 animate-fade-in-up">
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    ) : (
                        <AlertCircle className="w-5 h-5 mr-2 text-red-400" />
                    )}
                    <span className="font-medium">{notification.message}</span>
                </div>
            )}
        </div>
    );
};

export default PromptGenerator;

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

// Helper to read file as base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const Animate: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('Cinematic slow motion');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [loading, setLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedVideoUrl(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
       const file = e.dataTransfer.files[0];
       if (file.type.startsWith('image/')) {
         setSelectedFile(file);
         setPreviewUrl(URL.createObjectURL(file));
         setGeneratedVideoUrl(null);
         setError(null);
       }
    }
  };

  const generateVideo = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setError(null);
      setStatusText('Проверка API ключа...');

      // API Key Check & Selection
      // @ts-ignore
      if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
         // @ts-ignore
         await window.aistudio.openSelectKey();
      }
      // Re-check just in case, though prompt implies assume success
      // @ts-ignore
      if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
          throw new Error('API ключ не выбран. Пожалуйста, выберите ключ для продолжения.');
      }

      setStatusText('Подготовка изображения...');
      const base64Data = await fileToBase64(selectedFile);
      const mimeType = selectedFile.type;

      // Init AI with ENV key (which is injected after selection)
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      setStatusText('Запуск Veo (это может занять время)...');
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
          imageBytes: base64Data,
          mimeType: mimeType,
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      setStatusText('Генерация видео...');
      
      // Polling loop
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
        setStatusText('Обработка кадров...');
      }

      if (operation.response?.generatedVideos?.[0]?.video?.uri) {
        const downloadLink = operation.response.generatedVideos[0].video.uri;
        // Fetch with API Key appended
        setStatusText('Загрузка результата...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setGeneratedVideoUrl(videoUrl);
      } else {
        throw new Error('Видео не было сгенерировано. Попробуйте другое изображение.');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Произошла ошибка при генерации.');
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  return (
    <div className="min-h-screen bg-brand-ghost pt-10 pb-24 px-6 md:px-12">
       <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 md:mb-20 text-center">
             <span className="font-marker text-emerald-600 text-2xl md:text-3xl mb-4 block transform -rotate-2">Powered by Veo</span>
             <h1 className="font-display font-black text-5xl md:text-8xl text-brand-carbon uppercase leading-none tracking-tighter">
               AI ВИДЕО
             </h1>
             <p className="mt-6 text-gray-500 font-bold uppercase tracking-widest text-xs md:text-sm max-w-lg mx-auto">
               Оживи свои лучшие моменты с корта. Загрузи фото и позволь нейросети создать магию.
             </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             
             {/* LEFT: Upload & Controls */}
             <div className="space-y-8">
                {/* Upload Area */}
                <div 
                   className={`relative border-2 border-dashed rounded-[32px] p-8 transition-all h-[300px] flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group ${selectedFile ? 'border-emerald-500 bg-white' : 'border-gray-300 hover:border-emerald-400 bg-white/50'}`}
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={handleDrop}
                   onClick={() => fileInputRef.current?.click()}
                >
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                   />
                   
                   {previewUrl ? (
                      <div className="w-full h-full relative z-10">
                         <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-2xl" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                            <span className="text-white font-bold uppercase text-xs tracking-widest">ИЗМЕНИТЬ</span>
                         </div>
                      </div>
                   ) : (
                      <div className="pointer-events-none">
                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <i className="fa-solid fa-cloud-arrow-up text-brand-carbon text-2xl"></i>
                         </div>
                         <p className="font-display font-bold text-brand-carbon uppercase mb-2">ЗАГРУЗИ ФОТО</p>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ИЛИ ПЕРЕТАЩИ СЮДА</p>
                      </div>
                   )}
                </div>

                {/* Controls */}
                <div className="bg-white p-6 rounded-[32px] shadow-lg border border-gray-100">
                   <div className="mb-6">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">ПРОМПТ (ОПИСАНИЕ)</label>
                      <input 
                         type="text" 
                         value={prompt}
                         onChange={(e) => setPrompt(e.target.value)}
                         className="w-full bg-brand-ghost border border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-carbon text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                         placeholder="Опиши движение..."
                      />
                   </div>

                   <div className="mb-8">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">ФОРМАТ ВИДЕО</label>
                      <div className="flex bg-brand-ghost p-1.5 rounded-xl">
                         <button 
                            onClick={() => setAspectRatio('16:9')}
                            className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${aspectRatio === '16:9' ? 'bg-white shadow-md text-brand-carbon' : 'text-gray-400 hover:text-gray-600'}`}
                         >
                            16:9
                         </button>
                         <button 
                            onClick={() => setAspectRatio('9:16')}
                            className={`flex-1 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${aspectRatio === '9:16' ? 'bg-white shadow-md text-brand-carbon' : 'text-gray-400 hover:text-gray-600'}`}
                         >
                            9:16
                         </button>
                      </div>
                   </div>

                   <button 
                      onClick={generateVideo}
                      disabled={!selectedFile || loading}
                      className={`w-full py-5 rounded-xl font-display font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                        !selectedFile || loading 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'btn-gradient text-white shadow-premium hover:shadow-green-500/30 hover:scale-[1.02] active:scale-95'
                      }`}
                   >
                      {loading ? (
                         <>
                            <i className="fa-solid fa-circle-notch fa-spin"></i>
                            ГЕНЕРАЦИЯ...
                         </>
                      ) : (
                         <>
                            СГЕНЕРИРОВАТЬ
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                         </>
                      )}
                   </button>
                   {statusText && <p className="text-center text-xs font-bold text-emerald-600 mt-4 animate-pulse">{statusText}</p>}
                   {error && <p className="text-center text-xs font-bold text-red-500 mt-4">{error}</p>}
                </div>
             </div>

             {/* RIGHT: Result */}
             <div className="flex flex-col">
                <div className="bg-black rounded-[32px] overflow-hidden shadow-2xl border border-gray-800 flex-grow relative min-h-[300px] flex items-center justify-center group">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                   
                   {generatedVideoUrl ? (
                      <video 
                         src={generatedVideoUrl} 
                         controls 
                         autoPlay 
                         loop 
                         className="w-full h-full object-contain relative z-10"
                      />
                   ) : (
                      <div className="text-center relative z-10 opacity-30">
                         <i className="fa-solid fa-film text-6xl text-white mb-4 block"></i>
                         <span className="font-display font-black text-white uppercase text-xl">ЗДЕСЬ БУДЕТ ВИДЕО</span>
                      </div>
                   )}
                   
                   {/* Decorative elements */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                   <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                </div>

                {/* Billing Info */}
                <p className="text-center mt-6 text-[10px] text-gray-400">
                   * Функция требует платный API ключ. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-emerald-500">Подробнее о тарифах</a>.
                </p>
             </div>

          </div>
       </div>
    </div>
  );
};

export default Animate;


import React, { useState } from 'react';
import { createTgLink } from '../constants';
import { useSeo } from '../hooks/useSeo';

const Training: React.FC = () => {
  useSeo({
    title: 'Тренировки по бадминтону в Казани',
    description: 'Тренировки по бадминтону в Казани для взрослых и детей: группы для новичков и продолжающих, игровые занятия, персональные тренировки. Расписание и запись в Smashers.',
    image: '/Gemini_Generated_Image_l5hojql5hojql5ho.png',
  });
  const [activeTab, setActiveTab] = useState('novice');
  const [selectedGoal, setSelectedGoal] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 1. DATA: Comparison Widget (Conversion Logic)
  const goals = [
    {
        id: 0,
        tabTitle: "Just Fun",
        title: "ИГРОВАЯ ТРЕНИРОВКА",
        desc: "Минимум теории, максимум игры. Идеально для разгрузки мозга и сжигания калорий.",
        price: "1200₽",
        priceNote: "/ занятие",
        telegramLink: createTgLink("Здравствуйте! Хочу записаться на игровую тренировку. Есть ли места?")
    },
    {
        id: 1,
        tabTitle: "Learn Basics",
        title: "ГРУППА START",
        desc: "Пошаговое обучение с нуля. Постановка хвата, ударов и перемещений за 8 занятий.",
        price: "1200₽",
        priceNote: "/ занятие",
        telegramLink: createTgLink("Здравствуйте! Хочу записаться в группу START для новичков.")
    },
    {
        id: 2,
        tabTitle: "Level Up",
        title: "ГРУППА PRO",
        desc: "Тактика, сложные комбинации и функциональная подготовка для участия в турнирах.",
        price: "1200₽",
        priceNote: "/ занятие",
        telegramLink: createTgLink("Здравствуйте! Хочу записаться в группу PRO. У меня уже есть опыт.")
    }
  ];

  // 2. DATA: FAQ
  const faqs = [
    { q: "Нужна ли своя ракетка?", a: "Нет! Мы выдаем весь необходимый инвентарь: профессиональные ракетки Yonex и воланы. Все включено в стоимость занятия." },
    { q: "Какая нужна обувь?", a: "Обязательно сменная обувь на светлой или немаркой (non-marking) подошве. Это защищает покрытие корта." },
    { q: "Есть ли душ?", a: "Да, в раздевалках есть просторные душевые и фен." },
    { q: "Сколько человек в группе?", a: "В группе от 12 до 32 человек, с 1-2 профессиональными тренерами. Это обеспечивает индивидуальный подход к каждому." },
    { q: "Проводите ли вы корпоративные тренировки?", a: "Да, мы организуем корпоративные и закрытые тренировки для компаний. Напишите администратору для обсуждения деталей." },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({top: y, behavior: 'smooth'});
        setActiveTab(id);
    }
  };

  return (
    <div className="bg-white font-body text-brand-carbon overflow-x-hidden">
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.2); }
            50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
            100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.2); }
        }
      `}</style>

      {/* 1. HERO SECTION (KINETIC WOW REDESIGN) */}
      <section className="relative pt-32 md:pt-40 pb-20 px-4 md:px-12 bg-brand-ghost border-b border-gray-200 overflow-hidden min-h-[85vh] flex flex-col justify-center">
        {/* Abstract Background Elements with WOW factor */}
        <div className="absolute inset-0 pointer-events-none z-0">
           {/* Dynamic Mesh Gradients */}
           <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-emerald-400/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply animate-float"></div>
           <div className="absolute bottom-[-10%] right-[-5%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-400/10 rounded-full blur-[80px] md:blur-[100px] mix-blend-multiply animate-float" style={{animationDelay: '2s'}}></div>
           <div className="absolute top-[30%] left-[40%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-brand-lime/10 rounded-full blur-[60px] md:blur-[80px] mix-blend-multiply animate-float" style={{animationDelay: '4s'}}></div>
           
           {/* Grid overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.03]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full">
            {/* Badge */}
            <div className="text-center mb-8 md:mb-10">
                <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full border border-emerald-500/30 bg-white/50 backdrop-blur-sm text-emerald-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-sm animate-fade-in-up hover:scale-105 transition-transform cursor-default">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    ACADEMY 2026
                </span>
            </div>

            {/* Typography: Massive & Dynamic */}
            <div className="text-center mb-12 md:mb-16 relative">
                <h1 className="font-display font-black uppercase tracking-tighter leading-[0.9] animate-fade-in-up select-none">
                    <span className="block text-brand-carbon text-4xl sm:text-6xl md:text-9xl mb-2 md:mb-4 drop-shadow-sm relative z-10 transform transition-transform hover:scale-[1.02] duration-500">
                        ТВОЙ УРОВЕНЬ
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 text-4xl sm:text-6xl md:text-9xl filter drop-shadow-lg relative z-10 bg-[length:200%_auto] animate-shine">
                        ТВОЯ ИГРА
                    </span>
                </h1>
                {/* Decorative blurred text behind for depth */}
                <h1 className="absolute top-2 md:top-4 left-0 w-full font-display font-black uppercase tracking-tighter leading-[0.9] opacity-5 blur-sm select-none pointer-events-none scale-105">
                     <span className="block text-brand-carbon text-4xl sm:text-6xl md:text-9xl mb-2 md:mb-4">ТВОЙ УРОВЕНЬ</span>
                     <span className="block text-brand-carbon text-4xl sm:text-6xl md:text-9xl">ТВОЯ ИГРА</span>
                </h1>
            </div>

            {/* Subtitle */}
            <p className="text-gray-500 text-base md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed text-center mb-16 md:mb-20 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                Выбери свой формат и начни прогрессировать уже сегодня. <br className="hidden md:block"/>
                <span className="text-emerald-600 font-bold">Профессиональный подход</span> для каждого игрока.
            </p>

            {/* Navigation - Premium Tactical Grid */}
            <div className="max-w-5xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 justify-center">
                    {[
                        { id: 'novice', label: 'НАЧИНАЮЩИЕ', icon: 'fa-seedling' },
                        { id: 'advanced', label: 'ПРОДОЛЖАЮЩИЕ', icon: 'fa-fire' },
                        { id: 'game', label: 'ИГРОВАЯ', icon: 'fa-gamepad' },
                        { id: 'individual', label: 'ПЕРСОНАЛЬНО', icon: 'fa-user-astronaut' },
                    ].map((item, index) => (
                        <button 
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`
                                relative group overflow-hidden rounded-2xl p-4 md:p-8 text-center transition-all duration-500 ease-out
                                border cursor-pointer select-none flex flex-col items-center justify-center gap-3 md:gap-4
                                ${activeTab === item.id 
                                    ? 'border-emerald-500 bg-white text-emerald-700 shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] scale-[1.05] z-10' 
                                    : 'bg-white/80 backdrop-blur-sm border-white text-gray-400 hover:border-emerald-300 hover:text-brand-carbon hover:shadow-xl hover:-translate-y-2'
                                }
                            `}
                        >
                            {/* Icon Background Blob */}
                            <div className={`
                                w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg transition-all duration-500
                                ${activeTab === item.id ? 'bg-emerald-100 text-emerald-600 rotate-12 scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-emerald-50 group-hover:text-emerald-500'}
                            `}>
                                <i className={`fa-solid ${item.icon}`}></i>
                            </div>

                            <span className="relative z-10 text-[10px] md:text-sm font-black uppercase tracking-widest">{item.label}</span>
                            
                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 transition-opacity duration-500 ${activeTab !== item.id ? 'group-hover:opacity-100' : ''}`}></div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 2. DETAILED FORMAT BLOCKS (Z-Pattern) */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-16 md:py-20 space-y-20 md:space-y-32">
        
        {/* BLOCK 1: NOVICE */}
        <div id="novice" className="scroll-mt-32 opacity-0 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                <div className="w-full md:w-1/2 relative group px-4 md:px-0">
                    <div className="absolute top-4 left-4 z-10 bg-white text-emerald-700 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg border border-emerald-100/50 flex items-center gap-2">
                        <i className="fa-solid fa-gift text-emerald-500"></i> Инвентарь бесплатно
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <img src={encodeURI("/Группа START.png")} className="rounded-3xl w-full h-40 md:h-64 object-cover shadow-2xl transform translate-y-8" alt="Группа START" />
                        <img src={encodeURI("/Группа старт2.png")} className="rounded-3xl w-full h-40 md:h-64 object-cover shadow-2xl" alt="Группа START" onError={(e) => {
                            console.error('Image failed to load:', e.currentTarget.src);
                        }} />
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-4 md:px-0">
                    <h2 className="font-display font-black text-3xl md:text-5xl uppercase mb-2">ГРУППА START</h2>
                    <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mb-6">ДЛЯ НАЧИНАЮЩИХ</p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                        {['#постановка_техники', '#фитнес', '#первые_шаги'].map(tag => (
                            <span key={tag} className="text-gray-500 text-[10px] md:text-xs font-bold lowercase bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">{tag}</span>
                        ))}
                    </div>

                    <div className="bg-brand-ghost p-6 rounded-2xl mb-8 border border-gray-100">
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">СТРУКТУРА ТРЕНИРОВКИ</p>
                        <div className="flex items-center justify-between text-xs font-bold text-brand-carbon relative">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>
                            {['Разминка', 'Техника', 'Игра'].map((step, i) => (
                                <div key={i} className="relative z-10 bg-brand-ghost px-2 flex flex-col items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ring-4 ring-white ${i === 1 ? 'bg-brand-carbon' : 'bg-emerald-500'}`}></div>
                                    <span>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between sm:justify-start gap-8 w-full sm:w-auto">
                            <div>
                                <span className="block text-xl md:text-2xl font-display font-black text-brand-carbon">1200₽</span>
                                <span className="text-xs text-gray-500 font-bold">Разовое</span>
                            </div>
                            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                            <div>
                                <span className="block text-xl md:text-2xl font-display font-black text-brand-carbon">7300₽</span>
                                <span className="text-xs text-gray-500 font-bold">Абонемент (8)</span>
                            </div>
                        </div>
                        <a 
                           href={createTgLink("Здравствуйте! Меня интересует направление: Группа START. Хочу узнать подробности.")}
                           target="_blank" 
                           rel="noreferrer" 
                           className="w-full sm:w-auto sm:ml-auto"
                        >
                            <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/40 active:scale-95 transition-transform duration-200 flex items-center justify-center gap-2 hover:brightness-110">
                                ЗАПИСАТЬСЯ <i className="fa-brands fa-telegram text-lg"></i>
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* BLOCK 2: ADVANCED */}
        <div id="advanced" className="scroll-mt-32 opacity-0 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
                <div className="w-full md:w-1/2 relative px-4 md:px-0">
                    <img src="/ГРУППА ПРО.png" className="rounded-[40px] w-full h-[300px] md:h-[500px] object-cover shadow-2xl" alt="ГРУППА PRO" />
                    <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md text-brand-carbon p-6 rounded-2xl max-w-[200px] md:max-w-xs border border-white/20 shadow-xl">
                        <p className="font-display font-black text-lg md:text-xl mb-1">PRO LEVEL</p>
                        <p className="text-xs text-gray-500 font-bold">Сложная техника и тактика.</p>
                    </div>
                </div>

                <div className="w-full md:w-1/2 px-4 md:px-0">
                    <h2 className="font-display font-black text-3xl md:text-5xl uppercase mb-2">ГРУППА PRO</h2>
                    <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-6">ДЛЯ ПРОДОЛЖАЮЩИХ</p>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 font-medium">
                        Хочешь добавить мощи и хитрости? Здесь мы учим "читать" соперника, бить смэш в прыжке и играть "плоско".
                    </p>

                    <ul className="space-y-4 mb-10">
                        {['Сложные перемещения', 'Тактика парной игры', 'Высокий темп'].map((item, i) => (
                            <li key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs border border-blue-100">{i + 1}</div>
                                <span className="font-bold text-brand-carbon text-sm md:text-base">{item}</span>
                            </li>
                        ))}
                    </ul>

                    <a href={createTgLink("Здравствуйте! Меня интересует направление: Группа PRO. Хочу узнать подробности.")} target="_blank" rel="noreferrer">
                        <button className="w-full md:w-auto bg-brand-carbon text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-xl active:scale-95 flex items-center justify-center gap-2">
                            ПРИСОЕДИНИТЬСЯ К PRO
                        </button>
                    </a>
                </div>
            </div>
        </div>

        {/* BLOCK 3: GAME PLAY */}
        <div id="game" className="scroll-mt-32 opacity-0 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            <div className="bg-[#0B1120] rounded-[3rem] p-6 md:p-16 text-white relative overflow-hidden shadow-2xl border border-white/5 mx-4 md:mx-0">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-600/20 rounded-full blur-[100px]"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-12">
                    <div className="md:w-1/2">
                        <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest mb-6 inline-block shadow-lg shadow-emerald-900/20">FUN & SPORT</span>
                        <h2 className="font-display font-black text-3xl md:text-6xl uppercase mb-6 leading-none">ИГРОВАЯ<br/>ТРЕНИРОВКА</h2>
                        <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
                            Минимум упражнений, максимум игры. Тренер организует матчи и подбирает равных соперников.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 flex-1 text-center">
                                <span className="block font-display font-black text-2xl text-emerald-400">100%</span>
                                <span className="text-[10px] uppercase font-bold text-white/60">ИГРЫ</span>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5 flex-1 text-center">
                                <span className="block font-display font-black text-2xl text-white">0%</span>
                                <span className="text-[10px] uppercase font-bold text-white/60">СКУКИ</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2 relative">
                        <img src="/Игровая.png" className="rounded-3xl w-full h-64 md:h-80 object-cover border-4 border-white/10 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" alt="Игровая тренировка" />
                        <a href={createTgLink("Здравствуйте! Меня интересует направление: Игровая тренировка. Хочу поиграть.")} target="_blank" rel="noreferrer" className="absolute -bottom-6 -left-6">
                            <button className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-emerald-600 font-black text-xs uppercase flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform border-4 border-emerald-50">
                                ИГРАТЬ
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* BLOCK 4: INDIVIDUAL */}
        <div id="individual" className="scroll-mt-32 opacity-0 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
             <div className="flex flex-col md:flex-row gap-12 items-center">
                 <div className="w-full md:w-1/2 px-4 md:px-0">
                    <img src="/Персональная.png" className="rounded-3xl grayscale hover:grayscale-0 transition-all duration-700 w-full h-64 md:h-[400px] object-cover shadow-xl" alt="Персональная тренировка" />
                 </div>
                 <div className="w-full md:w-1/2 px-4 md:px-0">
                    <h2 className="font-display font-black text-3xl md:text-4xl uppercase mb-4">ПЕРСОНАЛЬНО</h2>
                    <p className="text-gray-600 mb-8 font-medium">
                        Разбор ошибок, постановка ударов и индивидуальный план. Самый быстрый прогресс.
                    </p>
                    <div className="flex items-center justify-between bg-white border border-gray-100 p-6 rounded-2xl shadow-lg shadow-gray-200/50 mb-8">
                        <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">ЦЕНА</p>
                            <p className="font-display font-black text-3xl text-brand-carbon">3000₽</p>
                        </div>
                        <a href={createTgLink("Здравствуйте! Меня интересует персональная тренировка. Подберите мне тренера.")} target="_blank" rel="noreferrer">
                            <button className="px-6 md:px-8 py-3 bg-gray-100 text-brand-carbon rounded-xl font-bold uppercase text-xs hover:bg-brand-carbon hover:text-white transition-colors active:scale-95">
                                ЗАПИСАТЬСЯ
                            </button>
                        </a>
                    </div>
                 </div>
             </div>
        </div>

      </div>

      {/* 3. WHAT TO PACK */}
      <section className="bg-brand-ghost py-16 md:py-20 px-6 md:px-12 border-y border-gray-200">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-black text-2xl md:text-4xl uppercase mb-12">ЧТО ВЗЯТЬ С СОБОЙ?</h2>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {[
                    { icon: "fa-shoe-prints", label: "КРОССОВКИ", sub: "Светлая подошва" },
                    { icon: "fa-shirt", label: "ФОРМА", sub: "Шорты и футболка" },
                    { icon: "fa-bottle-water", label: "ВОДА", sub: "Есть кулер" },
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center group w-28 md:w-auto">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300 border border-gray-100 text-emerald-600">
                            <i className={`fa-solid ${item.icon} text-2xl md:text-3xl`}></i>
                        </div>
                        <p className="font-black text-xs md:text-sm uppercase mb-1">{item.label}</p>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wide">{item.sub}</p>
                    </div>
                ))}
            </div>
            <div className="mt-12 inline-block bg-white px-6 md:px-8 py-4 rounded-full shadow-sm border border-emerald-500/20 max-w-xs md:max-w-none">
                <p className="text-emerald-700 font-bold text-xs md:text-sm uppercase tracking-widest leading-relaxed">
                    <i className="fa-solid fa-check-circle mr-2 text-emerald-500"></i>
                    РАКЕТКИ И ВОЛАНЫ ПРЕДОСТАВЛЯЕМ
                </p>
            </div>
         </div>
      </section>

      {/* 4. FOUNDERS SECTION */}
      <section className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
        <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-center mb-12">
          ОСНОВАТЕЛИ КЛУБА
        </h2>
        
        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-gray-100 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Photo */}
            <div className="rounded-3xl overflow-hidden">
              <img 
                src="/founders-misha-alina.jpg" 
                alt="Миша и Алина - основатели Smashers"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://picsum.photos/seed/founders/800/600';
                }}
              />
            </div>
            
            {/* Text */}
            <div>
              <h3 className="font-display font-black text-2xl md:text-4xl mb-6">
                МИША И АЛИНА
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Профессиональные тренеры с многолетним опытом. 
                Создали Smashers, чтобы сделать бадминтон доступным 
                и увлекательным для каждого.
              </p>
              <p className="text-gray-500 text-base leading-relaxed">
                Наша миссия — не только научить играть, но и создать 
                сильное комьюнити единомышленников, где каждый найдет 
                поддержку и мотивацию.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section className="py-20 px-4 md:px-12 max-w-3xl mx-auto border-t border-gray-100">
        <h2 className="font-display font-black text-2xl md:text-3xl uppercase mb-10 text-center">ЧАСТЫЕ ВОПРОСЫ</h2>
        <div className="space-y-4">
            {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden group hover:border-emerald-200 transition-colors">
                    <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-bold text-brand-carbon uppercase pr-4 text-xs md:text-base">{faq.q}</span>
                        <i className={`fa-solid fa-chevron-down transition-transform ${openFaq === i ? 'rotate-180 text-emerald-500' : 'text-gray-400'}`}></i>
                    </button>
                    <div className={`bg-gray-50 px-6 overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 py-6' : 'max-h-0'}`}>
                        <p className="text-sm text-gray-600 font-medium leading-relaxed">{faq.a}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 6. GOLDEN TICKET CTA (PREMIUM REPLACEMENT) */}
      <section className="px-4 md:px-12 pb-24 max-w-[1440px] mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 to-[#003366] p-8 md:p-24 isolate shadow-2xl">
          {/* Background Noise/Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          {/* The Green Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-600/20 rounded-full blur-[100px] md:blur-[120px] -z-10 animate-pulse"></div>

          {/* The "Physical Ticket" */}
          <div className="relative max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-14 overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-500">
             <div className="flex flex-col items-center text-center relative z-10">
               <span className="font-display font-bold text-emerald-400 tracking-[0.3em] text-[10px] md:text-xs uppercase mb-6 border border-emerald-500/30 px-4 py-1.5 rounded-full bg-emerald-500/10">ЭКСКЛЮЗИВНЫЙ ДОСТУП</span>
               
               <h2 className="font-display font-black text-3xl md:text-6xl text-white uppercase leading-none mb-6">
                 ПЕРВАЯ ТРЕНИРОВКА — <br/> ВСЕГО 700₽
               </h2>
               
               <p className="font-body text-gray-300 text-sm md:text-base max-w-md mb-12 font-medium leading-relaxed">
                 Ограниченное предложение для новых игроков. Почувствуй энергию Smashers.
               </p>

               <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 md:px-10 py-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transform md:scale-110 hover:scale-110 transition-transform cursor-default border border-white/20 mb-12">
                    <span className="block text-[9px] font-black uppercase tracking-widest opacity-90 mb-1">СПЕЦИАЛЬНАЯ ЦЕНА</span>
                    <span className="block font-display font-black text-3xl md:text-4xl">700₽</span>
               </div>

               <a href={createTgLink("Здравствуйте! Хочу записаться на первую тренировку.")} target="_blank" rel="noreferrer" className="w-full md:w-auto">
                 <button className="w-full md:w-auto bg-white text-slate-900 font-display font-black text-lg md:text-xl py-5 px-16 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] active:scale-95 transition-all uppercase tracking-widest group relative overflow-hidden">
                   <span className="relative z-10 font-black">ЗАПИСАТЬСЯ</span>
                   <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                 </button>
               </a>
             </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Training;


import React, { useState } from 'react';
import { createTgLink } from '../constants';

// --- DATA TYPES ---
interface FAQItem {
  id: number;
  category: string;
  q: string;
  a: string; // HTML supported
}

// --- MOCK DATA ---
const CATEGORIES = [
  { id: 'new', label: 'ДЛЯ НОВИЧКОВ', count: 12, icon: 'fa-child-reaching' },
  { id: 'training', label: 'О ТРЕНИРОВКАХ', count: 8, icon: 'fa-bolt' },
  { id: 'payment', label: 'ОБ ОПЛАТЕ', count: 5, icon: 'fa-credit-card' },
  { id: 'club', label: 'О КЛУБЕ', count: 4, icon: 'fa-building' },
];

const FAQ_DATA: FAQItem[] = [
  // CATEGORY: NEW
  {
    id: 1,
    category: 'new',
    q: "Я никогда не играл. Смогу ли я научиться?",
    a: `Да! <strong class="text-emerald-600">80% наших игроков</strong> пришли с нулевым опытом.<br><br>
        У нас есть группа <strong>START</strong>: медленный темп, постановка техники с нуля.
        <div class="mt-4 bg-emerald-50 border-l-4 border-emerald-500 p-4 text-sm font-medium text-gray-700">
           🎁 <strong>Первая тренировка — бесплатно!</strong> Мы выдадим ракетку и покажем основы.
        </div>`
  },
  {
    id: 2,
    category: 'new',
    q: "Нужна ли своя ракетка?",
    a: `Нет! На первое занятие мы выдаем профессиональную ракетку Yonex <strong class="text-brand-carbon">бесплатно</strong>. Далее можно брать в аренду (200₽) или купить свою в нашем магазине.`
  },
  {
    id: 3,
    category: 'new',
    q: "Какая нужна форма и обувь?",
    a: "Любая удобная спортивная форма. Главное — <strong>кроссовки на светлой подошве</strong> (non-marking), чтобы не оставлять следов на корте."
  },

  // CATEGORY: PAYMENT
  {
    id: 4,
    category: 'payment',
    q: "Сколько стоит первая тренировка?",
    a: `Первое занятие — <strong class="text-emerald-600 text-lg">0₽</strong>. Это полноценная тренировка с тренером, чтобы вы оценили атмосферу клуба.`
  },
  {
    id: 5,
    category: 'payment',
    q: "Какие способы оплаты?",
    a: "Карты, наличные, СБП. Есть оплата долями для абонементов."
  },
  {
    id: 6,
    category: 'payment',
    q: "Есть ли заморозка абонемента?",
    a: "Да, от 7 до 30 дней в зависимости от тарифа. Заморозка включается в один клик через наш Telegram-бот."
  },

  // CATEGORY: TRAINING
  {
    id: 7,
    category: 'training',
    q: "Длительность тренировки?",
    a: "1.5 - 2 часа. Это включает качественную разминку, упражнения и игровую практику."
  },
  {
    id: 8,
    category: 'training',
    q: "Сколько человек в группе?",
    a: "Максимум комфорта: до 4 человек на один корт. В группе обычно 8-12 человек."
  },

  // CATEGORY: CLUB
  {
    id: 9,
    category: 'club',
    q: "Где парковаться?",
    a: "Собственная парковка на 20 мест прямо у входа. Въезд под шлагбаум (скажите охране «в Smashers»)."
  },
  {
    id: 10,
    category: 'club',
    q: "Есть ли сауна?",
    a: "Да! В каждой раздевалке есть финская сауна. Включена в стоимость любой тренировки."
  }
];

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('new');
  const [searchTerm, setSearchTerm] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  // Filter Logic
  const filteredData = FAQ_DATA.filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchTerm.toLowerCase());
    return searchTerm ? matchesSearch : matchesCategory;
  });

  return (
    <div className="bg-brand-ghost min-h-screen font-body text-brand-carbon">
      
      {/* --- SECTION 1: KINETIC HERO --- */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
         {/* Background Elements */}
         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] md:w-[1000px] h-[600px] bg-emerald-400/5 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
         <div className="absolute bottom-0 right-0 w-[400px] md:w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none"></div>

         <div className="max-w-4xl mx-auto relative z-10 text-center">
            {/* Title with Gradient */}
            <h1 className="font-display font-black text-4xl md:text-8xl uppercase leading-[0.9] tracking-tighter mb-8 animate-[fadeInUp_0.8s_ease-out]">
               <span className="block text-brand-carbon">HELP</span>
               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600">CENTER</span>
            </h1>
            
            <p className="text-gray-500 text-sm md:text-lg font-bold uppercase tracking-widest mb-12 animate-[fadeInUp_1s_ease-out_0.2s_both]">
               База знаний Smashers Club
            </p>

            {/* Premium Search Bar */}
            <div className="relative max-w-2xl mx-auto group animate-[fadeInUp_1.2s_ease-out_0.4s_both]">
               {/* Glow Effect */}
               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-400 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
               
               <div className="relative flex items-center bg-white rounded-full shadow-2xl p-2 transition-transform duration-300 group-hover:scale-[1.01]">
                  {/* Icon Left */}
                  <div className="pl-6 pr-4 text-emerald-500 text-xl">
                     <i className="fa-solid fa-magnifying-glass"></i>
                  </div>
                  
                  {/* Input */}
                  <input 
                     type="text" 
                     value={searchTerm}
                     onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setOpenId(null);
                     }}
                     placeholder="Поиск по вопросам..."
                     className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-lg font-bold text-brand-carbon placeholder:text-gray-300 h-10 md:h-14"
                  />

                  {/* Action Button Right */}
                  {searchTerm && (
                     <button 
                        onClick={() => setSearchTerm('')}
                        className="mr-2 w-10 h-10 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center transition-colors"
                     >
                        <i className="fa-solid fa-xmark"></i>
                     </button>
                  )}
               </div>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-3 mt-8 animate-[fadeIn_1.5s_ease-out_0.6s_both]">
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest py-2">Popular:</span>
               {['Первый раз', 'Цены', 'Форма', 'Парковка'].map(tag => (
                  <button 
                     key={tag}
                     onClick={() => setSearchTerm(tag)}
                     className="px-4 py-1.5 rounded-full border border-gray-200 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider hover:border-emerald-500 hover:text-emerald-600 transition-all hover:-translate-y-0.5"
                  >
                     {tag}
                  </button>
               ))}
            </div>
         </div>
      </section>

      {/* --- SECTION 2: CATEGORY NAV --- */}
      {!searchTerm && (
         <div className="max-w-6xl mx-auto px-4 mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {CATEGORIES.map(cat => (
                  <button
                     key={cat.id}
                     onClick={() => { setActiveCategory(cat.id); setOpenId(null); }}
                     className={`group relative overflow-hidden rounded-2xl p-4 md:p-6 text-left transition-all duration-300 border ${
                        activeCategory === cat.id
                        ? 'bg-brand-carbon text-white border-brand-carbon shadow-xl ring-4 ring-emerald-500/20'
                        : 'bg-white text-gray-500 border-gray-100 hover:border-emerald-200 hover:shadow-lg'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-4">
                        <i className={`fa-solid ${cat.icon} text-xl md:text-2xl ${activeCategory === cat.id ? 'text-emerald-400' : 'text-gray-300 group-hover:text-emerald-500'} transition-colors`}></i>
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                           {cat.count}
                        </span>
                     </div>
                     <span className="font-display font-black text-xs md:text-sm uppercase tracking-wider block relative z-10">
                        {cat.label}
                     </span>
                     {/* Hover Effect */}
                     <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 transition-opacity duration-300 ${activeCategory !== cat.id ? 'group-hover:opacity-100' : ''}`}></div>
                  </button>
               ))}
            </div>
         </div>
      )}

      {/* --- SECTION 3: ACCORDION LIST --- */}
      <section className="max-w-3xl mx-auto px-4 pb-24 min-h-[400px]">
         {filteredData.length === 0 ? (
            <div className="text-center py-20 opacity-50 border-2 border-dashed border-gray-200 rounded-3xl">
               <i className="fa-solid fa-magnifying-glass text-4xl mb-4 text-gray-300"></i>
               <p className="font-bold text-gray-400 uppercase tracking-widest">Ничего не найдено</p>
            </div>
         ) : (
            <div className="space-y-4">
               {filteredData.map((item) => (
                  <div 
                     key={item.id} 
                     className={`group bg-white rounded-2xl transition-all duration-300 overflow-hidden ${
                        openId === item.id 
                        ? 'shadow-2xl ring-1 ring-emerald-500 translate-x-2' 
                        : 'shadow-sm hover:shadow-md border border-gray-100'
                     }`}
                  >
                     <button 
                        onClick={() => setOpenId(openId === item.id ? null : item.id)}
                        className="w-full p-6 md:p-8 flex items-start md:items-center justify-between text-left gap-6 relative"
                     >
                        {/* Side Accent */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${openId === item.id ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-gray-100'}`}></div>

                        <h3 className={`font-display font-bold text-sm md:text-lg uppercase leading-snug transition-colors pr-6 ${
                           openId === item.id ? 'text-brand-carbon' : 'text-gray-600 group-hover:text-emerald-700'
                        }`}>
                           {item.q}
                        </h3>
                        
                        {/* Animated Icon */}
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                           openId === item.id 
                           ? 'bg-brand-carbon text-white rotate-90 scale-110' 
                           : 'bg-gray-50 text-gray-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                        }`}>
                           <i className={`fa-solid ${openId === item.id ? 'fa-minus' : 'fa-plus'} text-xs md:text-sm`}></i>
                        </div>
                     </button>
                     
                     {/* Content */}
                     <div 
                        className={`transition-all duration-500 ease-in-out ${
                           openId === item.id ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                     >
                        <div className="px-6 md:px-8 pb-8 pl-10">
                           <div className="text-gray-500 leading-relaxed font-medium text-sm md:text-base border-l-2 border-gray-100 pl-4"
                              dangerouslySetInnerHTML={{ __html: item.a }} 
                           />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </section>

      {/* --- SECTION 4: DIRECT SUPPORT BLOCK --- */}
      <section className="px-4 md:px-12 max-w-[1440px] mx-auto mb-20">
         <div className="bg-[#0F172A] rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-premium group">
            
            {/* Background FX */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>

            {/* Left: Persona */}
            <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
               <div className="relative shrink-0">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-br from-emerald-500 to-teal-400 shadow-glow-lime">
                     <img 
                        src="https://picsum.photos/seed/alina/200/200" 
                        alt="Admin" 
                        className="w-full h-full object-cover rounded-full border-4 border-[#0F172A]"
                     />
                  </div>
                  <div className="absolute bottom-1 right-1 w-5 h-5 md:w-6 md:h-6 bg-emerald-500 border-4 border-[#0F172A] rounded-full flex items-center justify-center text-[10px] text-white animate-pulse">
                     <i className="fa-solid fa-check"></i>
                  </div>
               </div>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">ONLINE</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>
                  <h3 className="font-display font-black text-xl md:text-3xl text-white uppercase leading-none mb-2">НЕ НАШЛИ ОТВЕТ?</h3>
                  <p className="text-gray-400 text-xs md:text-sm font-medium max-w-xs">Алина ответит на любой вопрос в течение 15 минут.</p>
               </div>
            </div>

            {/* Right: CTA */}
            <div className="w-full md:w-auto relative z-10">
               <a href={createTgLink("Здравствуйте! У меня есть вопрос, на который я не нашел ответ в FAQ.")} target="_blank" rel="noreferrer">
                  <button className="w-full md:w-auto bg-white text-brand-carbon py-5 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3 group/btn">
                     НАПИСАТЬ В TELEGRAM
                     <i className="fa-brands fa-telegram text-xl text-[#229ED9] group-hover/btn:scale-110 transition-transform"></i>
                  </button>
               </a>
            </div>
         </div>
      </section>

    </div>
  );
};

export default FAQ;

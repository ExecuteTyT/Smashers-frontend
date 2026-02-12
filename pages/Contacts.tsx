
import React from 'react';
import { createTgLink } from '../constants';
import { useSeo } from '../hooks/useSeo';

const Contacts: React.FC = () => {
  useSeo({
    title: 'Контакты и залы в Казани',
    description: 'Контакты клуба Smashers в Казани: залы — Центр бадминтона, Ямашева, Максимус на Баруди. Запись на тренировки для взрослых и детей через Telegram.',
    image: '/Gemini_Generated_Image_l5hojql5hojql5ho.png',
  });

  return (
    <div className="bg-brand-ghost min-h-screen font-body text-brand-carbon">
      
      {/* --- SECTION 1: DIGITAL COMMAND CENTER (BENTO GRID) --- */}
      <section className="relative bg-white pt-32 md:pt-40 pb-20 md:pb-24 px-4 md:px-12 z-10">
         <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="font-display font-black text-3xl md:text-6xl text-black uppercase mb-8 md:mb-12 text-center md:text-left tracking-tighter animate-[fadeInUp_0.8s_ease-out]">
               ЦЕНТР СВЯЗИ
            </h1>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-[fadeInUp_1s_ease-out_0.2s_both]">
               
               {/* CARD 1: TELEGRAM PORTAL (Largest - Spans 2 columns on desktop) */}
               <a 
                  href={createTgLink("Здравствуйте! Хочу связаться с администратором.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:col-span-2 bg-black border border-black p-8 md:p-12 rounded-3xl group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden min-h-[300px] md:min-h-[400px] flex flex-col justify-between shadow-xl shadow-gray-200 hover:shadow-2xl hover:shadow-gray-300"
               >
                  <div className="relative z-10">
                     {/* Large Telegram Icon with Pulse Animation */}
                     <div className="mb-8">
                        <i className="fa-brands fa-telegram text-6xl md:text-7xl text-emerald-400 group-hover:text-emerald-300 transition-colors animate-pulse"></i>
                     </div>
                     
                     <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-4">ЧАТ С АДМИНИСТРАТОРОМ</p>
                     <h2 className="font-display font-black text-white text-2xl md:text-4xl uppercase leading-tight mb-4">
                        СВЯЗЬ ЗА 5 МИНУТ
                     </h2>
                     <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed max-w-md">
                        Запись, вопросы, отмена — отвечаем за 5 минут.
                     </p>
                  </div>
                  
                  {/* CTA Badge */}
                  <div className="relative z-10 mt-8 flex items-center gap-3">
                     <span className="bg-emerald-500 text-white px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest group-hover:bg-emerald-400 transition-colors shadow-lg">
                        ОТКРЫТЬ TELEGRAM
                     </span>
                     <i className="fa-solid fa-arrow-right text-emerald-400 group-hover:translate-x-2 transition-transform"></i>
                  </div>
               </a>

               {/* CARD 2: DIRECT LINE (Phone) */}
               <div className="bg-white border border-gray-200 p-8 md:p-10 rounded-3xl group hover:scale-[1.02] transition-all duration-300 hover:border-emerald-400 hover:shadow-lg min-h-[300px] md:min-h-[400px] flex flex-col justify-between">
                  <div>
                     <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 mb-8 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border border-gray-200">
                        <i className="fa-solid fa-phone text-2xl md:text-3xl"></i>
                     </div>
                     <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">ПРЯМАЯ ЛИНИЯ</p>
                     <a 
                        href="tel:+79196236888"
                        className="block group/phone"
                        onClick={(e) => e.stopPropagation()}
                     >
                        <p className="font-display font-black text-black text-2xl md:text-4xl leading-none mb-2 group-hover/phone:text-emerald-600 transition-colors tracking-tight whitespace-nowrap">
                           +7 919 623-68-88
                        </p>
                     </a>
                     <a 
                        href="mailto:smashers.bc@yandex.ru"
                        className="block group/email mt-4"
                        onClick={(e) => e.stopPropagation()}
                     >
                        <p className="font-body font-bold text-gray-700 text-lg group-hover/email:text-emerald-600 transition-colors break-all">
                           smashers.bc@yandex.ru
                        </p>
                     </a>
                  </div>
                  
                  <a 
                     href="tel:+79196236888"
                     className="w-full bg-black hover:bg-emerald-500 text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-colors text-center shadow-md hover:shadow-lg"
                  >
                     ПОЗВОНИТЬ
                  </a>
               </div>

               {/* CARD 3: THREE LOCATIONS */}
               <div className="md:col-span-3 bg-white border border-gray-200 p-8 md:p-12 rounded-3xl">
                  <h2 className="font-display font-black text-2xl md:text-3xl mb-8 text-center">
                     НАШИ ЛОКАЦИИ
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {/* Location 1 */}
                     <a
                        href="https://yandex.ru/maps/?text=Казань, Оренбургский тракт, 99"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-xl transition-all"
                     >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                           <i className="fa-solid fa-location-dot text-2xl"></i>
                        </div>
                        <h3 className="font-display font-black text-xl mb-3 text-brand-carbon">
                           ОРЕНБУРГСКИЙ ТРАКТ
                        </h3>
                        <p className="text-gray-600 text-sm font-bold mb-4">
                           Оренбургский тракт, 99
                        </p>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-wider">
                           <span>Построить маршрут</span>
                           <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </div>
                     </a>

                     {/* Location 2 */}
                     <a
                        href="https://yandex.ru/maps/?text=Казань, Галимджана Баруди, 8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-xl transition-all"
                     >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                           <i className="fa-solid fa-location-dot text-2xl"></i>
                        </div>
                        <h3 className="font-display font-black text-xl mb-3 text-brand-carbon">
                           ГАЛИМДЖАНА БАРУДИ
                        </h3>
                        <p className="text-gray-600 text-sm font-bold mb-4">
                           Галимджана Баруди, 8
                        </p>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-wider">
                           <span>Построить маршрут</span>
                           <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </div>
                     </a>

                     {/* Location 3 */}
                     <a
                        href="https://yandex.ru/maps/?text=Казань, Ямашева, 7/42"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-xl transition-all"
                     >
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                           <i className="fa-solid fa-location-dot text-2xl"></i>
                        </div>
                        <h3 className="font-display font-black text-xl mb-3 text-brand-carbon">
                           ЯМАШЕВА
                        </h3>
                        <p className="text-gray-600 text-sm font-bold mb-4">
                           Ямашева, 7/42
                        </p>
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-wider">
                           <span>Построить маршрут</span>
                           <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </div>
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ... MAP & NAV SECTIONS OMITTED FOR BREVITY, UNCHANGED ... */}

    </div>
  );
};

export default Contacts;

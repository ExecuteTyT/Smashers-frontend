
import React, { useState } from 'react';
import { createTgLink } from '../constants';

const Contacts: React.FC = () => {

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
                        <p className="font-display font-black text-black text-3xl md:text-4xl leading-none mb-2 group-hover/phone:text-emerald-600 transition-colors break-words tracking-tight">
                           +7 919<br/>623 6888
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

               {/* CARD 3: BASE CAMP (Location) - Full width on mobile, spans 3 columns on desktop */}
               <a
                  href="https://yandex.ru/maps/?text=Казань, ул. Спортивная, 25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="md:col-span-3 bg-gray-50 border border-gray-200 p-8 md:p-12 rounded-3xl group hover:scale-[1.01] transition-all duration-300 hover:border-emerald-400 hover:shadow-lg relative overflow-hidden min-h-[250px] md:min-h-[300px]"
               >
                  {/* Light Map Background */}
                  <div className="absolute inset-0 bg-white opacity-90"></div>
                  <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/49.12,55.81,14,0/800x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw')] bg-cover bg-center opacity-30"></div>
                  
                  {/* Emerald Pin in Center */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                     <div className="relative">
                        <i className="fa-solid fa-map-pin text-4xl md:text-5xl text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]"></i>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl"></div>
                     </div>
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between h-full">
                     <div>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-500 mb-6 border border-gray-200 shadow-sm">
                           <i className="fa-solid fa-map-location-dot text-2xl"></i>
                        </div>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-3">БАЗОВЫЙ ЛАГЕРЬ</p>
                        <p className="font-display font-black text-black text-xl md:text-3xl leading-tight">
                           г. Казань,<br/>
                           <span className="text-emerald-600">ул. Спортивная, 25</span>
                        </p>
                     </div>
                     
                     <div className="mt-6 md:mt-0">
                        <span className="bg-white hover:bg-emerald-50 text-black hover:text-emerald-700 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-colors border border-gray-200 hover:border-emerald-400 inline-flex items-center gap-2 shadow-sm">
                           ПОСТРОИТЬ МАРШРУТ
                           <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
                        </span>
                     </div>
                  </div>
               </a>
            </div>
         </div>
      </section>

      {/* ... MAP & NAV SECTIONS OMITTED FOR BREVITY, UNCHANGED ... */}

    </div>
  );
};

export default Contacts;

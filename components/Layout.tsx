
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MagneticButton from './MagneticButton';
import { createTgLink } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Главная', icon: 'fa-home' },
    { path: '/training', label: 'Тренировки', icon: 'fa-bolt' },
    { path: '/schedule', label: 'Расписание', icon: 'fa-calendar-alt' },
    { path: '/contacts', label: 'Контакты', icon: 'fa-map-marker-alt' },
    { path: '/faq', label: 'FAQ', icon: 'fa-question-circle' },
  ];

  const generalBookingLink = createTgLink("Здравствуйте! Хочу начать тренировки в Smashers. Сориентируйте меня по расписанию.");
  const freeTrainingLink = createTgLink("Здравствуйте! Хочу записаться на пробную бесплатную тренировку.");

  return (
    <div className="min-h-screen pb-24 md:pb-0 font-body flex flex-col">
      
      {/* 0. ANNOUNCEMENT BAR */}
      <div className="fixed top-0 w-full z-[101] bg-black text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] py-2 text-center border-b border-white/10 hidden md:block">
        <span className="opacity-80">ПЕРВАЯ ТРЕНИРОВКА — БЕСПЛАТНО.</span> 
        <a href={freeTrainingLink} target="_blank" rel="noreferrer" className="ml-4 text-emerald-400 hover:text-emerald-300 underline underline-offset-4 decoration-emerald-500/50">ЗАБРОНИРОВАТЬ СЛОТ</a>
      </div>

      {/* 1. HEADER (Sport Pro Style) */}
      <nav className="fixed top-0 md:top-8 w-full z-[100] border-t-4 border-emerald-500 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex justify-between items-center px-6 md:px-12 py-3 md:py-4 transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg relative overflow-hidden">
               <i className="fa-solid fa-shuttlecock text-white text-sm md:text-lg relative z-10"></i>
               {/* Shine effect on logo */}
               <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine"></div>
            </div>
            <span className="font-display font-black text-2xl md:text-3xl tracking-tighter text-black uppercase leading-none">SMASHERS.</span>
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-10 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative group font-body font-bold text-xs uppercase tracking-widest transition-colors ${
                location.pathname === item.path ? 'text-black' : 'text-gray-500 hover:text-black'
              }`}
            >
              {item.label}
              {/* Bouncing Green Dot */}
              <span className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 transition-all duration-300 ${location.pathname === item.path ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 group-hover:animate-bounce'}`}></span>
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a 
            href={generalBookingLink}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex btn-gradient text-white font-black text-[10px] md:text-[11px] py-3 px-6 md:px-8 rounded-full shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 transition-all uppercase tracking-widest items-center gap-2 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">ЗАПИСАТЬСЯ <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i></span>
            {/* Shine effect for CTA */}
            <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-shine"></div>
          </a>

          {/* Mobile Hamburger */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-gray-100 rounded-full hover:bg-emerald-100 transition-colors z-50"
          >
            <div className={`w-6 h-0.5 bg-black transition-transform origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-6 h-0.5 bg-black transition-transform origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
          </button>
        </div>
      </nav>

      {/* Mobile Full Screen Menu Overlay */}
      <div className={`fixed inset-0 z-[90] bg-white pt-32 px-6 transition-transform duration-500 ease-in-out lg:hidden flex flex-col ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
         <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display font-black text-4xl uppercase text-brand-carbon hover:text-emerald-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a 
                href={generalBookingLink} 
                target="_blank" 
                rel="noreferrer" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display font-black text-2xl uppercase text-emerald-500 mt-4"
            >
                ЗАПИСАТЬСЯ В TG →
            </a>
         </div>
      </div>

      <main className="pt-24 md:pt-32 flex-grow">
        {children}
      </main>

      {/* Mobile Bottom Dock Bar (Still kept for quick actions) */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] bg-brand-carbon/95 backdrop-blur-2xl rounded-[32px] py-4 px-8 flex justify-between items-center z-[80] shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10">
        {navItems.slice(0, 2).map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center p-2">
            <i className={`fa-solid ${item.icon} text-lg ${location.pathname === item.path ? 'text-emerald-400' : 'text-white/40'}`}></i>
          </Link>
        ))}
        {/* Central Plus Button - Navigates to Schedule */}
        <Link to="/schedule" className="w-14 h-14 btn-gradient rounded-full flex items-center justify-center -mt-10 border-[5px] border-brand-ghost shadow-[0_15px_30px_rgba(5,150,105,0.4)] transition-transform active:scale-90 relative z-10">
          <i className="fa-solid fa-plus text-white text-xl"></i>
        </Link>
        {navItems.slice(3).map((item) => (
          <Link key={item.path} to={item.path} className="flex flex-col items-center p-2">
            <i className={`fa-solid ${item.icon} text-lg ${location.pathname === item.path ? 'text-emerald-400' : 'text-white/40'}`}></i>
          </Link>
        ))}
      </div>

      {/* 3. FOOTER (Refactored) */}
      <footer className="relative bg-slate-900 overflow-hidden pt-16 pb-32 md:pb-10 w-full shrink-0 border-t border-white/5">
         
         {/* Background Text "SMASHERS" */}
         <div className="absolute bottom-0 left-0 w-full text-center z-0 pointer-events-none select-none overflow-hidden">
            <span className="text-[13.5vw] font-display font-black text-white opacity-[0.03] leading-none tracking-tighter block translate-y-[20%]">
               SMASHERS
            </span>
         </div>

         <div className="container mx-auto px-6 md:px-12 relative z-10">
            {/* Main Grid: 3 Cols */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
               
               {/* Left: Brand */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <i className="fa-solid fa-shuttlecock text-slate-900"></i>
                     </div>
                     <h2 className="font-display font-black text-2xl text-white">SMASHERS.</h2>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
                    Элитный бадминтонный клуб нового поколения. Технологии, комфорт и мощное комьюнити.
                  </p>
               </div>

               {/* Center: Nav + Contacts */}
               <div className="flex flex-col sm:flex-row gap-10 md:gap-16">
                  <div>
                     <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6">МЕНЮ</h3>
                     <ul className="space-y-3">
                        {['Тренировки', 'Цены', 'О клубе', 'Правила'].map(item => (
                           <li key={item}>
                              <Link to="/training" className="text-gray-300 hover:text-white text-sm font-bold transition-colors">
                                 {item}
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div>
                     <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6">КОНТАКТЫ</h3>
                     <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-3">
                           <i className="fa-solid fa-phone text-emerald-500 mt-1"></i>
                           <span className="font-bold text-gray-300">+7 (843) 123-45-67</span>
                        </li>
                        <li className="flex items-start gap-3">
                           <i className="fa-solid fa-location-dot text-emerald-500 mt-1"></i>
                           <span className="font-bold text-gray-300">Казань, ул. Спортивная, 25</span>
                        </li>
                        <li className="flex items-start gap-3">
                           <i className="fa-solid fa-envelope text-emerald-500 mt-1"></i>
                           <span className="font-bold text-gray-300">info@smashers.ru</span>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Right: Socials */}
               <div className="flex flex-col items-start md:items-end">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-6 md:text-right w-full">МЫ В СОЦСЕТЯХ</h3>
                  <div className="flex gap-3">
                     <a href={createTgLink("Здравствуйте!")} target="_blank" rel="noreferrer">
                       <MagneticButton className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all !px-0 !py-0">
                           <i className="fa-brands fa-telegram text-lg"></i>
                       </MagneticButton>
                     </a>
                     <MagneticButton className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all !px-0 !py-0">
                        <i className="fa-brands fa-whatsapp text-lg"></i>
                     </MagneticButton>
                     <MagneticButton className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all !px-0 !py-0">
                        <i className="fa-brands fa-vk text-lg"></i>
                     </MagneticButton>
                  </div>
               </div>
            </div>

            {/* Bottom Bar: Copyright & Credits */}
            <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
               
               <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs text-gray-500 font-medium text-center md:text-left">
                  <span>© 2026 SMASHERS CLUB. ВСЕ ПРАВА ЗАЩИЩЕНЫ.</span>
                  <a href="#" className="hover:text-white transition-colors underline decoration-transparent hover:decoration-white/30 underline-offset-4">
                    Политика конфиденциальности
                  </a>
               </div>

               <div>
                  <a href="#" className="text-xs font-bold tracking-widest text-gray-700 hover:text-emerald-500 transition-all duration-300 uppercase">
                    Site by <span className="text-gray-500 hover:text-white transition-colors">BRAID GROUP</span>
                  </a>
               </div>

            </div>
         </div>
      </footer>
    </div>
  );
};

export default Layout;

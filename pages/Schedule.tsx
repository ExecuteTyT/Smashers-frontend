
import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { apiClient, Session, Location } from '../config/api';
import MembershipCalculator from '../components/MembershipCalculator';

const FAQS = [
  { q: "Как заморозить абонемент?", a: "Абонемент можно заморозить один раз на срок до 14 дней. Просто напишите администратору в Telegram." },
  { q: "Можно ли вернуть деньги?", a: "Возврат средств за неиспользованные занятия осуществляется по заявлению в течение 3 рабочих дней." },
  { q: "Какие способы оплаты?", a: "Мы принимаем карты, наличные и переводы. Также доступна оплата долями." },
  { q: "Что если я опаздываю?", a: "Разминка — критически важная часть. Если вы опоздали более чем на 15 минут, тренер может не допустить к интенсивной части." },
];

const MOCK_LOCATIONS: Location[] = [
    { id: 1, name: "Зал №1", description: "Основной зал" },
    { id: 2, name: "Зал №2", description: "Малый зал" }
];

const MOCK_SESSIONS: Session[] = [
  { 
    id: 101, 
    datetime: new Date(new Date().setHours(18,0,0,0)).toISOString(), 
    location: { id: 1, name: "Зал №1" }, 
    category: { id: 1, name: "Novice" }, 
    trainers: "Михаил", 
    name: "ГРУППА ДЛЯ НОВИЧКОВ", 
    maxSpots: 12, 
    availableSpots: 8, 
    status: "active" 
  },
  { 
    id: 102, 
    datetime: new Date(new Date().setHours(19,30,0,0)).toISOString(), 
    location: { id: 1, name: "Зал №1" }, 
    category: { id: 2, name: "Pro" }, 
    trainers: "Алина", 
    name: "PRO LEAGUE", 
    maxSpots: 8, 
    availableSpots: 2, 
    status: "active" 
  },
  { 
    id: 103, 
    datetime: new Date(new Date().setHours(21,0,0,0)).toISOString(), 
    location: { id: 2, name: "Зал №2" }, 
    category: { id: 3, name: "Game" }, 
    trainers: "Олег", 
    name: "ИГРОВАЯ ТРЕНИРОВКА", 
    maxSpots: 16, 
    availableSpots: 12, 
    status: "active" 
  }
];

const Schedule: React.FC = () => {
  const { openBooking } = useBooking();
  const [activeMainTab, setActiveMainTab] = useState<'schedule' | 'pricing'>('schedule');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- API DATA ---
  const [sessions, setSessions] = useState<Session[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // --- DATE STRIP LOGIC ---
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
        date: d.getDate()
      });
    }
    return dates;
  };
  const dateStrip = generateDates();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Sessions, Locations
        const [sessionsRes, locationsRes] = await Promise.all([
           apiClient.get<{ data: Session[] }>('/sessions', { date: selectedDate }).catch(() => null),
           apiClient.get<{ data: Location[] }>('/locations').catch(() => null),
        ]);
        
        // 1. Sessions
        if (sessionsRes && sessionsRes.data) {
           setSessions(sessionsRes.data);
        } else {
           const today = new Date().toISOString().split('T')[0];
           if (selectedDate === today) {
               setSessions(MOCK_SESSIONS);
           } else {
               setSessions([]);
           }
        }

        // 2. Locations
        if (locationsRes && locationsRes.data) {
            setLocations(locationsRes.data);
        } else {
            setLocations(MOCK_LOCATIONS);
        }

      } catch (err) {
        console.error("Failed to fetch schedule data, using fallback", err);
        setSessions(MOCK_SESSIONS);
        setLocations(MOCK_LOCATIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDate]);

  // --- HELPERS ---

  const formatTime = (iso: string) => {
      try {
          return new Date(iso).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      } catch {
          return "18:00";
      }
  };

  const getStatusInfo = (session: Session) => {
     if (session.availableSpots <= 0) return { text: 'МЕСТ НЕТ', color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-500' };
     if (session.availableSpots <= 3) return { text: `ОСТАЛОСЬ ${session.availableSpots}`, color: 'text-orange-500', bg: 'bg-orange-50', dot: 'bg-orange-500' };
     return { text: `${session.availableSpots} СВОБОДНО`, color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
  };

  const getLocationStyle = (locId: number) => {
     const styles = [
         'bg-blue-50 text-blue-700 border-blue-100',
         'bg-emerald-50 text-emerald-700 border-emerald-100',
         'bg-orange-50 text-orange-700 border-orange-100'
     ];
     return styles[locId % styles.length] || styles[0];
  };

  return (
    <div className="bg-brand-ghost min-h-screen font-body text-brand-carbon pb-24">
      
      {/* --- SECTION 1: HERO & CONTROLS --- */}
      <div className="pt-32 pb-6 px-4 md:px-12 bg-white/80 backdrop-blur-xl border-b border-gray-200 relative z-40 transition-all duration-300 shadow-sm">
         <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-6 md:gap-8">
            <h1 className="font-display font-black text-3xl md:text-6xl uppercase tracking-tighter text-center xl:text-left text-brand-carbon leading-none">
              РАСПИСАНИЕ
            </h1>
            
            {/* MAIN TOGGLE SWITCH */}
            <div className="bg-gray-100 p-1.5 rounded-full flex items-center relative w-full xl:w-auto shadow-inner">
               <div 
                 className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] md:w-[200px] bg-white rounded-full shadow-md transition-all duration-300 ease-out border border-gray-100`}
                 style={{ 
                   left: activeMainTab === 'schedule' ? '6px' : 'calc(100% - 6px)',
                   transform: activeMainTab === 'schedule' ? 'translateX(0)' : 'translateX(-100%)'
                 }}
               ></div>
               
               <button 
                 onClick={() => setActiveMainTab('schedule')}
                 className={`relative z-10 flex-1 md:w-[200px] py-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors duration-300 rounded-full flex items-center justify-center gap-2 ${activeMainTab === 'schedule' ? 'text-brand-carbon' : 'text-gray-400'}`}
               >
                 <i className="fa-regular fa-calendar"></i> ТРЕНИРОВКИ
               </button>
               <button 
                 onClick={() => setActiveMainTab('pricing')}
                 className={`relative z-10 flex-1 md:w-[200px] py-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors duration-300 rounded-full flex items-center justify-center gap-2 ${activeMainTab === 'pricing' ? 'text-brand-carbon' : 'text-gray-400'}`}
               >
                 <i className="fa-solid fa-gem"></i> АБОНЕМЕНТЫ
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8 md:mt-12">
        
        {/* --- SECTION 2: THE SCHEDULE ENGINE --- */}
        {activeMainTab === 'schedule' && (
          <div className="animate-fade-in-up">

            {/* 2.2 DATE STRIP */}
            <div className="flex gap-3 overflow-x-auto pb-8 mb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x">
               {dateStrip.map((d) => (
                 <button
                   key={d.fullDate}
                   onClick={() => setSelectedDate(d.fullDate)}
                   className={`snap-center min-w-[75px] md:min-w-[85px] flex-col items-center justify-center py-4 md:py-5 rounded-2xl transition-all duration-300 border flex relative overflow-hidden ${
                     selectedDate === d.fullDate
                     ? 'bg-[#0F172A] border-[#0F172A] shadow-xl scale-105'
                     : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                   }`}
                 >
                   <span className={`text-[9px] md:text-[10px] font-black uppercase mb-1 tracking-widest text-gray-400`}>{d.day}</span>
                   <span className={`text-xl md:text-2xl font-display font-bold ${selectedDate === d.fullDate ? 'text-white' : 'text-gray-800'}`}>{d.date}</span>
                   {selectedDate === d.fullDate && (
                     <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-green-500"></div>
                   )}
                 </button>
               ))}
            </div>

            {/* 2.3 THE PRO SCHEDULE LIST */}
            <div className="space-y-4">
               {loading ? (
                   <div className="py-20 text-center text-gray-400 animate-pulse">
                       Загрузка расписания...
                   </div>
               ) : sessions.length === 0 ? (
                   <div className="text-center py-20 opacity-50 border-2 border-dashed border-gray-200 rounded-3xl mt-8">
                      <i className="fa-regular fa-calendar-xmark text-4xl mb-4 text-gray-400"></i>
                      <p className="font-bold text-gray-400 uppercase tracking-widest">В ЭТОТ ДЕНЬ ТРЕНИРОВОК НЕТ</p>
                   </div>
               ) : (
                   sessions.map((slot) => {
                     const status = getStatusInfo(slot);
                     const locName = locations.find(l => l.id === slot.location.id)?.name || slot.location.name;
                     
                     return (
                         <div 
                            key={slot.id} 
                            className="relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 group overflow-hidden"
                         >
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                            <div className="flex flex-row md:flex-col items-baseline md:items-center justify-between md:justify-center min-w-[110px] md:border-r border-gray-100 md:pr-6">
                                <span className="text-3xl md:text-5xl font-display font-black text-brand-carbon leading-none tracking-tighter">{formatTime(slot.datetime)}</span>
                            </div>
                            <div className="md:w-44 flex-shrink-0">
                                <span className={`inline-block px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wide border ${getLocationStyle(slot.location.id)}`}>
                                   <i className="fa-solid fa-location-dot mr-1.5"></i>
                                   {locName}
                                </span>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-display font-black text-lg md:text-2xl text-brand-carbon uppercase mb-2 group-hover:text-emerald-600 transition-colors">
                                    {slot.name}
                                </h3>
                                <div className="flex items-center gap-3">
                                     <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(slot.trainers)}&background=random`} alt="Trainer" className="w-full h-full object-cover" />
                                     </div>
                                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                        Тренер: <span className="text-brand-carbon">{slot.trainers}</span>
                                     </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:flex-col md:items-end md:gap-3 border-t md:border-t-0 border-gray-50 pt-4 md:pt-0 mt-2 md:mt-0">
                                <div className="flex items-center gap-2">
                                     <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.dot === 'bg-orange-500' ? 'animate-pulse' : ''}`}></span>
                                     <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                                        {status.text}
                                     </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button 
                                      onClick={() => openBooking('session', slot.id, `${slot.name} ${formatTime(slot.datetime)}`)}
                                      disabled={slot.availableSpots <= 0}
                                      className={`px-4 py-3 md:px-6 md:py-3 rounded-lg font-black text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all active:scale-95 ${
                                          slot.availableSpots <= 0
                                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                          : 'bg-brand-carbon text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/30'
                                      }`}
                                    >
                                      {slot.availableSpots <= 0 ? 'В ЛИСТ ОЖИДАНИЯ' : 'ЗАПИСАТЬСЯ'}
                                    </button>
                                </div>
                            </div>
                         </div>
                     );
                   })
               )}
            </div>
          </div>
        )}

        {/* --- SECTION 3: PRICING (REAL DATA INTEGRATION) --- */}
        {activeMainTab === 'pricing' && (
           <div className="animate-fade-in-up px-0 md:px-0">
               <MembershipCalculator />
           </div>
        )}
      </div>

      {/* --- SECTION 4: INFO & FAQ --- */}
      <section className="max-w-3xl mx-auto px-4 md:px-12 mt-16 md:mt-24 mb-16 md:mb-20">
         <h2 className="font-display font-black text-2xl uppercase mb-8 text-center text-brand-carbon">ВАЖНАЯ ИНФОРМАЦИЯ</h2>
         <div className="space-y-3">
            {FAQS.map((faq, idx) => (
               <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <button 
                     onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                     className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                     <span className="font-bold text-sm text-brand-carbon uppercase pr-4">{faq.q}</span>
                     <i className={`fa-solid fa-chevron-down text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}></i>
                  </button>
                  <div className={`transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed font-medium border-t border-gray-50 pt-4">
                        {faq.a}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* --- SECTION 5: FOOTER CTA --- */}
      <section className="px-4 md:px-12 max-w-[1440px] mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-20 shadow-2xl group hover:-translate-y-2 transition-transform duration-500">
           {/* Background Pattern */}
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="text-center md:text-left text-white">
                 <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-white/20">НОВЫМ ИГРОКАМ</span>
                 <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-none mb-4">ГОТОВЫ НАЧАТЬ?</h2>
                 <p className="font-medium text-emerald-50 text-sm md:text-base max-w-md">
                    Запишитесь на пробную тренировку.
                 </p>
              </div>

              <div className="flex flex-col items-center">
                 <button 
                    onClick={() => openBooking('general', undefined, 'Пробная тренировка')}
                    className="bg-white text-emerald-700 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-lime hover:text-brand-carbon transition-colors shadow-xl active:scale-95"
                 >
                    ПОЛУЧИТЬ БИЛЕТ
                 </button>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Schedule;

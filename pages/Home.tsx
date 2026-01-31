
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../components/MagneticButton';
import { useBooking } from '../context/BookingContext';
import { apiClient, Session, Membership } from '../config/api';

// --- COMPONENTS ---

const FormatCard: React.FC<{ 
  title: string; 
  desc: string; 
  img: string; 
  price: string; 
  schedule: string;
  membershipId?: number; // Optional ID to trigger booking
  isComingSoon?: boolean;
  gridSpan?: string;
  isHit?: boolean;
}> = ({ title, desc, img, price, schedule, membershipId, isComingSoon, gridSpan = "md:col-span-3", isHit }) => {
  const { openBooking } = useBooking();

  const handleBook = (e: React.MouseEvent) => {
    if (isComingSoon) return;
    if (membershipId) {
       e.preventDefault();
       openBooking('membership', membershipId, title);
    } else {
        // Fallback to general if no specific ID
       e.preventDefault();
       openBooking('general', undefined, title);
    }
  };

  return (
    <div className={`relative flex flex-col flex-shrink-0 ${gridSpan} bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 snap-center w-[85vw] md:w-auto ${isComingSoon ? 'grayscale opacity-75' : 'group'}`}>
      
      {/* Hit Badge */}
      {isHit && (
        <div className="absolute top-4 left-4 z-20 bg-brand-lime text-brand-carbon px-3 py-1 rounded-md font-display font-black text-[10px] uppercase tracking-widest shadow-glow-lime animate-pulse">
          ХИТ 🔥
        </div>
      )}

      {/* Price Badge */}
      <div className={`absolute top-4 right-4 z-20 px-4 py-2 rounded-xl font-black shadow-xl backdrop-blur-md border border-white/20 text-sm md:text-base ${isComingSoon ? 'bg-gray-400/90 text-white' : 'bg-brand-carbon/90 text-white'}`}>
        {price}
      </div>

      {/* Image Section */}
      <div className="relative h-48 md:h-56 w-full overflow-hidden">
        <img 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-6 pt-2">
        <h3 className="font-display font-black text-xl md:text-2xl text-brand-carbon uppercase leading-none mb-3 tracking-tight group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-xs md:text-sm font-medium mb-6 leading-relaxed border-l-2 border-gray-200 pl-3">
          {desc}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-brand-ghost text-brand-carbon/70 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 w-full">
               <i className="fa-regular fa-clock text-emerald-600"></i>
               {schedule}
            </div>
          </div>

          <button 
            onClick={handleBook}
            disabled={isComingSoon}
            className={`w-full py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
              isComingSoon 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-carbon text-white shadow-lg hover:bg-brand-blue active:scale-95'
            }`}
          >
            {isComingSoon ? 'СКОРО' : 'ЗАПИСАТЬСЯ'} 
            {!isComingSoon && <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform text-brand-lime"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CONSTANTS ---

// REAL GOOGLE/YANDEX REVIEWS (SHORT & PUNCHY)
const REVIEWS = [
  {
    name: "Василий Соколов",
    text: "День без бадминтона прожит зря. Отличный клуб, внимательные тренеры, все просто огонь. Всем рекомендую!",
    stars: 5
  },
  {
    name: "Анастасия Абрамова",
    text: "Лучший клуб в Казани! Алина с Мишей заряжают энергией. Прекрасные корты и очень уютная атмосфера.",
    stars: 5
  },
  {
    name: "Валерия Миличенко",
    text: "Олега рекомендую новичкам! Очень добрый, всегда поддержит. Весело сжигаю по 600 калорий за тренировку 🔥",
    stars: 5
  },
  {
    name: "Мария Малыгина",
    text: "Самые душевные тренировки! Алина и Миша лучшие ❤️ Присоединяйтесь, у нас всегда весело!",
    stars: 5
  },
  {
    name: "Дарья Карпухина",
    text: "Разнообразные тренировки, комфортный зал, дружелюбная атмосфера. Лучшее место в городе.",
    stars: 5
  },
  {
    name: "Вадим Кривилев",
    text: "Кайфую от тренеров! Топовый зал.",
    stars: 5
  },
  {
    name: "Айгуль Нуриева",
    text: "Рада, что нашла этот спорт. Это и физическая, и умственная активность. Тренеры — супер 🫶",
    stars: 5
  }
];

const WHY_US_CARDS = [
  {
    title: "ПРОФЕССИОНАЛЬНЫЕ КОРТЫ",
    shortTitle: "КОРТЫ",
    desc: "4 сертифицированных корта с амортизирующим покрытием. Твои колени скажут спасибо.",
    img: "https://images.unsplash.com/photo-1613912111729-560bb507ef44?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "ОБОРУДОВАНИЕ YONEX",
    shortTitle: "YONEX",
    desc: "Играйте профессиональными воланами и ракетками. Мы предоставляем топовый инвентарь бесплатно на каждую тренировку.",
    img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop"
  },
  {
    title: "МОЩНОЕ КОМЬЮНИТИ",
    shortTitle: "ЛЮДИ",
    desc: "Больше чем спорт. Турниры, вечеринки и новые друзья каждую неделю.",
    img: "./community.jpg"
  }
];

const MARQUEE_CONTENT = [
  "ТРЕНИРУЙСЯ С ЛУЧШИМИ", "●", 
  "ИГРАЙ КРАСИВО", "●", 
  "ПОЧУВСТВУЙ ДРАЙВ", "●",
  "СМЭШ БЕЗ ГРАНИЦ", "●"
];

// --- MOCK DATA (FALLBACK) ---
const MOCK_SESSIONS: Session[] = [
  { 
    id: 101, 
    datetime: new Date(new Date().setHours(18,0,0,0)).toISOString(), 
    location: { id: 1, name: "Корт 1" }, 
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
    location: { id: 1, name: "Корт 2" }, 
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
    location: { id: 1, name: "Корт 1" }, 
    category: { id: 3, name: "Game" }, 
    trainers: "Олег", 
    name: "ИГРОВАЯ ТРЕНИРОВКА", 
    maxSpots: 16, 
    availableSpots: 12, 
    status: "active" 
  }
];

const MOCK_MEMBERSHIPS: Membership[] = [
    { id: 1, name: "Месячный абонемент", type: "Subscription", price: 4800, sessionCount: 8, isVisible: true },
    { id: 2, name: "Разовое посещение", type: "Single", price: 1200, sessionCount: 1, isVisible: false }
];

// --- MAIN PAGE ---

const Home: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const { openBooking } = useBooking();

  // API Data States
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [singleVisitPrice, setSingleVisitPrice] = useState<number>(1200);

  useEffect(() => {
    let cancelled = false; // Защита от дублирования запросов (React StrictMode)
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // FETCH DATA
    const fetchData = async () => {
      try {
        // 1. Sessions
        const sessionsRes = await apiClient.get<{ data: Session[] }>('/sessions', { 
            limit: 3, 
            available_only: true,
            date_from: new Date().toISOString().split('T')[0] // From today
        }).catch(() => null);

        if (cancelled) return;

        if (sessionsRes && sessionsRes.data) {
           setUpcomingSessions(sessionsRes.data);
        } else {
           // Fallback
           setUpcomingSessions(MOCK_SESSIONS);
        }

        // 2. Memberships (for pricing blocks)
        const memsRes = await apiClient.get<{ data: Membership[] }>('/memberships').catch(() => null);
        if (cancelled) return;
        
        if (memsRes && memsRes.data) {
           setMemberships(memsRes.data);
        } else {
           setMemberships(MOCK_MEMBERSHIPS);
        }

        // 3. Single Visit Price (ID 2)
        const singleVisit = await apiClient.get<{ data: Membership }>('/memberships/2').catch(() => null);
        if (cancelled) return;
        
        if (singleVisit && singleVisit.data) {
           setSingleVisitPrice(singleVisit.data.price);
        } else {
           setSingleVisitPrice(1200);
        }

      } catch (err) {
        if (!cancelled) {
          // Silent catch for smooth fallback
          setUpcomingSessions(MOCK_SESSIONS);
          setMemberships(MOCK_MEMBERSHIPS);
          setSingleVisitPrice(1200);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', handleScroll);
    } () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "18:00"; // fallback
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return "18:00";
    }
  };

  const getStatusColor = (spots: number) => {
     if (spots <= 2) return 'yellow';
     return 'green';
  };

  return (
    <div className="w-full bg-brand-ghost overflow-x-hidden">
      
      {/* 1. HERO BLOCK (RUSSIAN RICH VISUAL) */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center -mt-20 pt-20">
        
        {/* Background Image Layer */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
                // High-quality shuttlecock image with dark/moody vibe
                backgroundImage: "url('https://images.unsplash.com/photo-1626224583764-847890e0e99b?q=80&w=2070&auto=format&fit=crop')",
                transform: `translateY(${scrollY * 0.2}px)`, // Subtle parallax
                willChange: 'transform'
            }}
        >
             {/* Heavy Dark Gradient Overlay (Left-Aligned Focus) */}
             <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
             
             {/* Extra texture for grit */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-center h-full">
            
            {/* Top Badge */}
             <div className="inline-flex items-center gap-3 mb-8 md:mb-12 animate-[fadeInUp_0.8s_ease-out]">
                <span className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
                    КАЗАНЬ • EST. 2026
                </span>
            </div>

            {/* Typography Stack */}
            <div className="relative mb-8 md:mb-12">
                {/* Background "Ghost" Text - Reduced size for mobile to prevent layout blowout */}
                <span 
                    className="absolute -top-[3rem] -left-[1rem] md:-top-[6rem] md:-left-[4rem] text-[15vw] md:text-[25rem] font-display font-black text-transparent leading-none opacity-[0.05] select-none pointer-events-none whitespace-nowrap" 
                    style={{ WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}
                >
                    SMASHERS
                </span>
                
                {/* Foreground Russian Headline - Adjusted for mobile legibility */}
                <h1 className="relative z-10 font-display font-black text-4xl sm:text-6xl md:text-8xl text-white leading-[0.95] md:leading-[0.9] tracking-tighter drop-shadow-2xl uppercase">
                    <span className="block animate-[slideInRight_0.8s_ease-out_0.2s_both]">БАДМИНТОН.</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-brand-lime animate-[slideInRight_1s_ease-out_0.4s_both] filter drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                        ТРЕНИРОВКИ.
                    </span>
                    <span className="block animate-[slideInRight_1.2s_ease-out_0.6s_both]">SMASHERS.</span>
                </h1>

                {/* Neon Glow behind text */}
                <div className="absolute top-1/2 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-600/20 rounded-full blur-[80px] md:blur-[120px] -z-10 -translate-y-1/2 translate-x-[-20%] pointer-events-none"></div>
            </div>

            {/* Subtitle */}
            <div className="border-l-4 border-emerald-500 pl-4 md:pl-8 mb-10 md:mb-14 animate-[fadeInUp_1.5s_ease-out_0.8s_both]">
                <p className="text-gray-300 text-base md:text-xl font-medium max-w-lg font-body leading-relaxed">
                    Премиальный клуб бадминтона в Казани. <br/>
                    Твоя игра на новом уровне.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 md:gap-6 animate-[fadeInUp_1.5s_ease-out_1s_both]">
                <MagneticButton 
                    onClick={() => openBooking('general', undefined, 'Запись на тренировку')}
                    className="w-full sm:w-auto btn-gradient text-white py-5 px-10 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_15px_40px_rgba(16,185,129,0.6)] border-0 hover:scale-105 transition-transform flex justify-center"
                >
                    ЗАПИСАТЬСЯ НА ТРЕНИРОВКУ
                </MagneticButton>
                
                <Link to="/training">
                    <button className="w-full sm:w-auto py-5 px-10 rounded-xl border border-white/30 text-white font-black text-xs md:text-sm uppercase tracking-widest hover:bg-white hover:text-brand-carbon transition-all hover:scale-105 active:scale-95">
                        УЗНАТЬ ПОДРОБНЕЕ
                    </button>
                </Link>
            </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-0 right-0 mx-auto w-full flex flex-col items-center justify-center gap-2 animate-bounce z-20 opacity-50 mix-blend-screen pointer-events-none">
            <span className="text-white/60 text-[10px] uppercase font-black tracking-[0.2em]">ЛИСТАЙ ВНИЗ</span>
            <i className="fa-solid fa-chevron-down text-white"></i>
        </div>
        
        {/* Hero Footer Status */}
        <div className="absolute bottom-0 right-0 p-8 hidden md:block animate-[fadeIn_2s_ease-out_1.2s_both]">
             <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                        <img key={i} src={`https://picsum.photos/seed/p${i}/50/50`} className="w-8 h-8 rounded-full border-2 border-[#0F172A]" alt="User" />
                    ))}
                 </div>
                 <div>
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">LIVE</p>
                     <p className="text-xs font-bold text-white">24 игрока на корте</p>
                 </div>
             </div>
        </div>

        <style>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* 2. FORMATS BLOCK */}
      <section className="py-20 md:py-32 px-6 md:px-12 max-w-[1440px] mx-auto bg-brand-ghost overflow-hidden">
        <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8 md:pb-10">
          <div>
            <span className="font-marker text-emerald-600 text-xl md:text-2xl mb-3 block transform -rotate-1">Выбери свой режим</span>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-8xl text-brand-carbon uppercase tracking-tighter leading-none break-words">
              ФОРМАТЫ
            </h2>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs md:text-sm max-w-xs text-right hidden md:block leading-relaxed">
            От первых шагов до турнирного золота. <br/>Найди свой ритм игры.
          </p>
          <div className="md:hidden flex justify-end">
            <span className="bg-white text-brand-carbon px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm animate-pulse">
              Свайпай влево →
            </span>
          </div>
        </div>
        
        {/* Horizontal Scroll Container */}
        <div className="flex flex-row overflow-x-auto md:grid md:grid-cols-12 gap-5 md:gap-6 pb-12 md:pb-0 scrollbar-hide snap-x snap-mandatory scroll-smooth w-[calc(100%+3rem)] -ml-6 px-6 md:w-auto md:ml-0 md:px-0">
          <FormatCard 
            title="Для начинающих"
            desc="Фундамент техники. Хват, перемещения и первый точный удар."
            img="https://images.unsplash.com/photo-1626224580193-3d7065999827?auto=format&fit=crop&q=80&w=800"
            price="800₽"
            schedule="ВТ, ЧТ 19:00"
            gridSpan="md:col-span-3"
          />
          <FormatCard 
            title="Для продолжающих"
            desc="Тактика, выносливость и мощные смэши. Уровень PRO."
            img="https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80&w=800"
            price="900₽"
            schedule="ПН, СР, ПТ 19:00"
            gridSpan="md:col-span-3"
            isHit={true}
          />
          <FormatCard 
            title="Игровая тренировка"
            desc="Спарринги, эмоции и реальная игровая практика без пауз."
            img="https://images.unsplash.com/photo-1613912111729-560bb507ef44?auto=format&fit=crop&q=80&w=800"
            price="600₽"
            schedule="Каждый день"
            gridSpan="md:col-span-3"
          />
          <FormatCard 
            title="Американка"
            desc="Турнирный формат 'на вылет'. Чистый адреналин."
            img="https://images.unsplash.com/photo-1627845348821-2e97910903cb?auto=format&fit=crop&q=80&w=800"
            price="1000₽"
            schedule="СБ 14:00"
            gridSpan="md:col-span-3"
          />
          <FormatCard 
            title="Персональная"
            desc="1 на 1 с тренером. Максимальный фокус на твоих ошибках."
            img="https://images.unsplash.com/photo-1554068865-2484cd381755?auto=format&fit=crop&q=80&w=800"
            price="2000₽"
            schedule="По записи"
            gridSpan="md:col-span-3"
          />
          <FormatCard 
            title="Детская Академия"
            desc="Спорт, дисциплина и веселье для будущих чемпионов (6-14 лет)."
            img="https://images.unsplash.com/photo-1551855630-c322b7244926?auto=format&fit=crop&q=80&w=800"
            price="600₽"
            schedule="ПН, СР, ПТ 16:00"
            gridSpan="md:col-span-3"
          />
          <FormatCard 
            title="Сплит-тренировка"
            desc="Тренировка для двоих. Эффективно и выгодно."
            img="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800"
            price="1400₽"
            schedule="По записи"
            gridSpan="md:col-span-3"
          />
        </div>
      </section>

      {/* NEW BLOCK 1: UPCOMING SESSIONS (FLIGHT BOARD) */}
      <section className="py-12 px-4 md:px-12 max-w-[1440px] mx-auto -mt-10 relative z-20 mb-20">
        <div className="bg-brand-carbon rounded-[2rem] p-6 md:p-12 text-white shadow-2xl relative overflow-hidden group">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[80px] group-hover:bg-emerald-600/20 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-brand-blue/10 rounded-full blur-[60px]"></div>
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="animate-pulse w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">LIVE SCHEDULE</span>
                    </div>
                    <h2 className="font-display font-black text-2xl md:text-4xl uppercase tracking-tight">БЛИЖАЙШИЕ ТРЕНИРОВКИ</h2>
                </div>
                <Link to="/schedule" className="hidden md:block text-[10px] font-bold uppercase tracking-widest text-emerald-400 hover:text-white transition-colors border-b border-transparent hover:border-white pb-1">
                    ПОСМОТРЕТЬ ВСЁ РАСПИСАНИЕ →
                </Link>
            </div>

            {/* List */}
            <div className="space-y-4 relative z-10">
                {upcomingSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Загрузка расписания...</p>
                    </div>
                ) : (
                    upcomingSessions.map((session, i) => (
                        <div key={i} className="flex flex-col md:flex-row items-center justify-between bg-white/5 rounded-2xl p-5 md:p-6 border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-white/10 group/row backdrop-blur-sm">
                            <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto mb-4 md:mb-0">
                                <span className="font-display font-black text-3xl md:text-4xl text-white w-24 tracking-tighter">
                                    {formatTime(session.datetime)}
                                </span>
                                <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                                <div className="flex items-center gap-3 md:gap-4 flex-grow">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.trainers)}&background=random`} alt="Trainer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/10 grayscale group-hover/row:grayscale-0 transition-all object-cover" />
                                    <div>
                                        <p className="font-bold text-sm md:text-base uppercase text-white tracking-wide leading-tight">{session.name}</p>
                                        <div className="flex items-center gap-2 md:hidden mt-1">
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(session.availableSpots) === 'green' ? 'bg-brand-lime' : 'bg-yellow-400'}`}></span>
                                            <span className="text-[9px] text-white/50 uppercase tracking-widest">
                                                {session.availableSpots > 0 ? `${session.availableSpots} СВОБОДНО` : 'МЕСТ НЕТ'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                <div className="hidden md:flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${getStatusColor(session.availableSpots) === 'green' ? 'bg-brand-lime' : 'bg-yellow-400'} shadow-[0_0_10px_currentColor]`}></span>
                                    <span className="text-[10px] text-white/50 uppercase tracking-widest">
                                        {session.availableSpots > 0 ? `${session.availableSpots} СВОБОДНО` : 'МЕСТ НЕТ'}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => openBooking('session', session.id, `${session.name} ${formatTime(session.datetime)}`)}
                                    className="w-full md:w-auto px-6 py-3 rounded-full bg-white/10 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-brand-lime hover:text-brand-carbon hover:border-brand-lime transition-all active:scale-95 text-white"
                                >
                                    ЗАПИСАТЬСЯ
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* Mobile Footer Link */}
            <div className="mt-8 text-center md:hidden">
                <Link to="/schedule" className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    ПОСМОТРЕТЬ ВСЁ РАСПИСАНИЕ →
                </Link>
            </div>
        </div>
      </section>

      {/* 3. WHY US (KINETIC GALLERY) */}
      <section className="bg-brand-carbon py-20 md:py-32 overflow-hidden relative">
        <div className="px-6 md:px-12 max-w-[1440px] mx-auto mb-10 md:mb-12">
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-7xl text-white uppercase tracking-tighter leading-none">
              ПОЧЕМУ <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-600">МЫ</span>
            </h2>
        </div>

        {/* MOBILE: STORIES SWIPE */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full h-[60vh] gap-4 px-4 scrollbar-hide pb-8">
            {WHY_US_CARDS.map((card, i) => (
                <div key={i} className="flex-shrink-0 w-[85vw] h-full relative rounded-2xl overflow-hidden snap-center shadow-2xl">
                    <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover z-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="font-display font-black text-2xl text-white uppercase mb-3 leading-none">{card.title}</h3>
                        <p className="font-body text-white/90 text-sm">{card.desc}</p>
                    </div>
                </div>
            ))}
        </div>

        {/* DESKTOP: KINETIC ACCORDION */}
        <div className="hidden md:flex h-[600px] w-full max-w-[1440px] mx-auto gap-4 px-12">
            {WHY_US_CARDS.map((card, i) => (
                <div key={i} className="flex-[1] hover:flex-[3] relative rounded-[32px] overflow-hidden transition-all duration-700 ease-in-out cursor-pointer group shadow-2xl">
                    <img src={card.img} alt={card.title} className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-900/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                        <h3 className="font-display font-black text-4xl text-white uppercase tracking-widest -rotate-90 whitespace-nowrap">{card.shortTitle}</h3>
                    </div>
                    <div className="absolute bottom-0 left-0 p-12 w-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-10 group-hover:translate-y-0 delay-200">
                        <h3 className="font-display font-black text-5xl text-white uppercase mb-6 leading-none">{card.title}</h3>
                        <p className="font-body text-white/90 text-xl leading-relaxed max-w-lg">{card.desc}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* NEW BLOCK 2: PRICING HITS */}
      <section className="bg-brand-ghost py-20 px-6 md:px-12 max-w-[1440px] mx-auto">
         <div className="text-center mb-12 md:mb-16">
            <span className="font-marker text-emerald-600 text-xl md:text-2xl mb-3 block">Best Sellers</span>
            <h2 className="font-display font-black text-3xl md:text-6xl text-brand-carbon uppercase tracking-tighter">ВЫБЕРИ СВОЙ ПЛАН</h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Basic (Dynamic Single Visit) */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-2">
               <h3 className="font-display font-black text-2xl text-brand-carbon uppercase mb-2">РАЗОВЫЕ</h3>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-6">ДЛЯ СТАРТА</p>
               <div className="text-3xl md:text-4xl font-display font-black text-brand-carbon mb-8">
                   {singleVisitPrice}₽<span className="text-sm text-gray-400 font-body font-medium">/ занятие</span>
               </div>
               <ul className="space-y-4 mb-8 flex-grow">
                  {['Аренда ракетки', 'Доступ в сауну', 'Любое время'].map(item => (
                     <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <i className="fa-solid fa-check text-emerald-500"></i> {item}
                     </li>
                  ))}
               </ul>
               <button 
                  onClick={() => openBooking('membership', 2, 'Разовое посещение')}
                  className="w-full py-4 rounded-xl border-2 border-gray-100 font-black text-xs uppercase tracking-widest hover:bg-brand-carbon hover:text-white transition-all group-hover:border-brand-carbon"
               >
                  ВЫБРАТЬ
               </button>
            </div>

            {/* Card 2: Membership (Featured - First found membership) */}
            <div className="relative bg-gradient-to-br from-[#0f172a] to-[#059669] rounded-[2rem] p-8 text-white shadow-2xl md:-translate-y-6 md:scale-105 overflow-hidden group flex flex-col">
               <div className="absolute top-4 right-4 bg-brand-lime text-brand-carbon text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse shadow-glow-lime">ХИТ ПРОДАЖ</div>
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
               {/* Gloss effect */}
               <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none"></div>

               <h3 className="relative z-10 font-display font-black text-2xl md:text-3xl uppercase mb-2 tracking-wide">MEMBERSHIP</h3>
               <p className="relative z-10 text-sm text-emerald-200 font-bold uppercase tracking-widest mb-8">АБОНЕМЕНТЫ</p>
               
               <div className="relative z-10 mb-8">
                  <span className="text-sm text-white/50 line-through font-bold block mb-1">ОТ 6000₽</span>
                  {/* Assuming first real membership is monthly or similar */}
                  <div className="text-4xl md:text-5xl font-display font-black text-white">от {memberships[0]?.price || 4800}₽</div>
               </div>
               
               <ul className="relative z-10 space-y-4 mb-10 flex-grow">
                  {['Выгода до 30%', 'Заморозка 14 дней', 'Гостевой визит', 'Приоритетная запись'].map(item => (
                     <li key={item} className="flex items-center gap-3 text-sm font-bold text-white/90">
                        <div className="w-5 h-5 rounded-full bg-brand-lime/20 flex items-center justify-center text-brand-lime text-xs shrink-0"><i className="fa-solid fa-check"></i></div> 
                        {item}
                     </li>
                  ))}
               </ul>
               <button 
                   onClick={() => openBooking('membership', memberships[0]?.id || 1, 'Абонемент')}
                   className="w-full py-5 rounded-xl bg-brand-lime text-brand-carbon font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-glow-lime relative z-10 mt-auto"
                >
                   ОФОРМИТЬ
               </button>
            </div>

            {/* Card 3: Personal */}
            <div className="bg-brand-carbon rounded-[2rem] p-8 shadow-xl flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 min-h-[450px]">
               <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600" alt="Personal" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
               </div>
               
               <div className="relative z-10">
                  <h3 className="font-display font-black text-2xl text-white uppercase mb-2">ПЕРСОНАЛЬНЫЕ</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">С ТРЕНЕРОМ</p>
                  <div className="text-3xl md:text-4xl font-display font-black text-white mb-8">2000₽<span className="text-sm text-gray-400 font-body font-medium">/ час</span></div>
                  <ul className="space-y-4 mb-8">
                     {['Разбор техники', 'План тренировок', 'Спарринг'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                           <i className="fa-solid fa-check text-emerald-500"></i> {item}
                        </li>
                     ))}
                  </ul>
               </div>
               <button 
                  onClick={() => openBooking('session', undefined, 'Персональная тренировка', 'Хочу персональную тренировку')}
                  className="w-full py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all mt-auto relative z-10"
               >
                  ЗАПИСАТЬСЯ
               </button>
            </div>
         </div>
      </section>

      {/* NEW BLOCK 3: SEAMLESS INFINITE MARQUEE REVIEWS (SLOW & INTERACTIVE) */}
      <section className="bg-slate-900 py-20 overflow-hidden relative border-t border-white/5">
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end relative z-10">
             <div>
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-2 block">Больше, чем просто спорт</span>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white uppercase tracking-tight">ОТЗЫВЫ ИГРОКОВ</h2>
             </div>
             <div className="flex gap-4 mt-6 md:mt-0">
                <button 
                   onClick={() => openBooking('general', undefined, 'Отзыв', 'Хочу оставить отзыв')}
                   className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
                >
                   <i className="fa-regular fa-message text-xl text-[#229ED9]"></i> ОСТАВИТЬ ОТЗЫВ
                </button>
             </div>
          </div>

          <div className="group relative flex overflow-hidden w-full select-none">
             {/* Left Fade */}
             <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-slate-900 to-transparent z-20 pointer-events-none"></div>
             {/* Right Fade */}
             <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-slate-900 to-transparent z-20 pointer-events-none"></div>

             {/* Track 1 */}
             <div className="animate-infinite-scroll flex gap-6 shrink-0 items-stretch px-3 group-hover:[animation-play-state:paused]">
                {REVIEWS.map((review, i) => (
                   <div key={`orig-${i}`} className="w-[300px] md:w-[400px] bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative flex flex-col transition-all hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl">
                       {/* Decoration */}
                       <i className="fa-solid fa-quote-right absolute top-6 right-6 text-5xl text-white opacity-5"></i>
                       
                       {/* Stars */}
                       <div className="flex gap-1 text-[#FFD700] text-xs mb-4">
                            {[...Array(review.stars)].map((_, starI) => (
                                <i key={starI} className="fa-solid fa-star shadow-glow-gold"></i>
                            ))}
                       </div>
                       
                       <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6 flex-grow relative z-10 font-medium italic line-clamp-4">
                         "{review.text}"
                       </p>
                       
                       <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-4">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=059669&color=fff&size=100`} 
                            alt={review.name} 
                            className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white/10" 
                          />
                          <div>
                             <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wide">{review.name}</h4>
                             <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Игрок клуба</span>
                          </div>
                       </div>
                   </div>
                ))}
             </div>
             {/* Track 2 (Duplicate for Seamless Loop) */}
             <div aria-hidden="true" className="animate-infinite-scroll flex gap-6 shrink-0 items-stretch px-3 group-hover:[animation-play-state:paused]">
                {REVIEWS.map((review, i) => (
                   <div key={`dup-${i}`} className="w-[300px] md:w-[400px] bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative flex flex-col transition-all hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl">
                       <i className="fa-solid fa-quote-right absolute top-6 right-6 text-5xl text-white opacity-5"></i>
                       
                       <div className="flex gap-1 text-[#FFD700] text-xs mb-4">
                            {[...Array(review.stars)].map((_, starI) => (
                                <i key={starI} className="fa-solid fa-star shadow-glow-gold"></i>
                            ))}
                       </div>
                       
                       <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-6 flex-grow relative z-10 font-medium italic line-clamp-4">
                         "{review.text}"
                       </p>
                       
                       <div className="flex items-center gap-4 mt-auto border-t border-white/5 pt-4">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=059669&color=fff&size=100`} 
                            alt={review.name} 
                            className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white/10" 
                          />
                          <div>
                             <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wide">{review.name}</h4>
                             <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Игрок клуба</span>
                          </div>
                       </div>
                   </div>
                ))}
             </div>
          </div>
      </section>

      {/* 4. CTA SECTION: EXCLUSIVE PASS */}
      <section className="px-4 md:px-12 py-20 max-w-[1440px] mx-auto">
        {/* The Atmosphere Container */}
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 to-[#003366] p-6 md:p-24 isolate shadow-2xl">
          {/* Background Noise/Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          {/* The Green Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-600/20 rounded-full blur-[100px] md:blur-[120px] -z-10 animate-pulse"></div>

          {/* The "Physical Ticket" */}
          <div className="relative max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-14 overflow-hidden shadow-2xl group hover:-translate-y-2 transition-transform duration-500">
            {/* Decorative Shine */}
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-[60px] group-hover:bg-white/10 transition-colors"></div>

             {/* Content */}
             <div className="flex flex-col items-center text-center relative z-10">
               <span className="font-display font-bold text-emerald-400 tracking-[0.3em] text-[10px] md:text-xs uppercase mb-6 border border-emerald-500/30 px-4 py-1.5 rounded-full bg-emerald-500/10">ЭКСКЛЮЗИВНЫЙ ДОСТУП</span>
               
               <h2 className="font-display font-black text-3xl md:text-6xl text-white uppercase leading-none mb-6">
                 ПЕРВАЯ ТРЕНИРОВКА — <br/> БЕСПЛАТНО
               </h2>
               
               <p className="font-body text-gray-300 text-sm md:text-base max-w-md mb-12 font-medium leading-relaxed">
                 Ограниченное предложение для новых игроков. Почувствуй энергию Smashers.
               </p>

               {/* Price Badge */}
               <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-12">
                 <div className="flex flex-col items-center md:items-end">
                    <span className="text-sm text-white/60 font-bold uppercase tracking-widest line-through">СТАНДАРТ 1200₽</span>
                    <span className="font-display font-black text-white/40 text-lg decoration-white/30 line-through">ОБЫЧНАЯ</span>
                 </div>
                 
                 {/* Divider */}
                 <div className="hidden md:block w-px h-12 bg-white/10"></div>
                 
                 {/* New Price Badge */}
                 <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white px-8 md:px-10 py-4 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transform md:scale-110 hover:scale-110 transition-transform cursor-default border border-white/20">
                    <span className="block text-[9px] font-black uppercase tracking-widest opacity-90 mb-1">ТВОЯ ЦЕНА</span>
                    <span className="block font-display font-black text-3xl md:text-4xl">0₽</span>
                 </div>
               </div>

               {/* Button */}
               <button 
                  onClick={() => openBooking('general', undefined, 'Бесплатный билет', 'Хочу бесплатную первую тренировку')}
                  className="w-full md:w-auto bg-white text-slate-900 font-display font-black text-lg md:text-xl py-5 px-16 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all uppercase tracking-widest group relative overflow-hidden"
               >
                 <span className="relative z-10 font-black">ЗАБРАТЬ БИЛЕТ</span>
                 <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
               </button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. MARQUEE STRIP (The Energy Line) */}
      <div className="bg-black py-12 md:py-20 overflow-hidden whitespace-nowrap border-y border-white/10 relative z-20 flex">
         {/* Container for the loop - we render two sets of content */}
         <div className="flex animate-marquee min-w-full shrink-0 items-center">
            {MARQUEE_CONTENT.map((text, i) => (
               <div key={i} className="flex items-center mx-6 md:mx-12">
                  {text === "●" ? (
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                  ) : (
                    <span 
                        className={`font-display font-black text-4xl sm:text-5xl md:text-8xl uppercase tracking-tighter italic ${
                        i % 4 === 2 ? "text-transparent" : "text-white"
                        }`}
                        style={i % 4 === 2 ? { WebkitTextStroke: '1px white' } : {}}
                    >
                        {text}
                    </span>
                  )}
               </div>
            ))}
         </div>
         {/* Duplicate set for seamless loop */}
         <div className="flex animate-marquee min-w-full shrink-0 items-center">
            {MARQUEE_CONTENT.map((text, i) => (
               <div key={`dup-${i}`} className="flex items-center mx-6 md:mx-12">
                  {text === "●" ? (
                    <div className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                  ) : (
                    <span 
                        className={`font-display font-black text-4xl sm:text-5xl md:text-8xl uppercase tracking-tighter italic ${
                        i % 4 === 2 ? "text-transparent" : "text-white"
                        }`}
                        style={i % 4 === 2 ? { WebkitTextStroke: '1px white' } : {}}
                    >
                        {text}
                    </span>
                  )}
               </div>
            ))}
         </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 80s linear infinite;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Home;

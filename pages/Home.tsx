
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../components/MagneticButton';
import { useBooking } from '../context/BookingContext';
import { apiClient, Session, Membership } from '../config/api';
import { createTgLink } from '../constants';
import { useSeo } from '../hooks/useSeo';
import eventsCardImg from '../esKZ7dckWq69ui4i1ONHxWDm8AcWGLRTKKsx9FoH4-CUyFVkboUas7XHtf-UZHNDm_YBPZ8QkSmSs1VIaDplcTc7.jpg';

// --- COMPONENTS ---

const FormatCard: React.FC<{ 
  title: string; 
  desc: string; 
  img: string; 
  price: string; 
  schedule: string;
  membershipId?: number; // Optional ID (not used anymore, kept for compatibility)
  isComingSoon?: boolean;
  gridSpan?: string;
  isHit?: boolean;
  fetchPriority?: 'high' | 'low' | 'auto';
}> = ({ title, desc, img, price, schedule, membershipId, isComingSoon, gridSpan = "md:col-span-3", isHit, fetchPriority }) => {

  return (
    <div className={`relative flex flex-col flex-shrink-0 ${gridSpan} bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 snap-center w-[85vw] md:w-auto md:min-w-[280px] h-auto ${isComingSoon ? 'grayscale opacity-75' : 'group'}`}>
      
      {/* Hit Badge */}
      {isHit && (
        <div className="absolute top-4 left-4 z-20 bg-emerald-500 text-white px-3 py-1 rounded-md font-display font-black text-[10px] uppercase tracking-widest shadow-lg">
          ХИТ 🔥
        </div>
      )}

      {/* Image Section - 50-55% of card height with gradient overlay */}
      <div className="relative h-48 md:h-56 w-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300">
        <img 
          src={img.startsWith('http') ? img : encodeURI(img)} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          loading="lazy"
          decoding="async"
          fetchPriority={fetchPriority}
          onError={(e) => {
            console.error('Image failed to load:', img, 'Encoded:', encodeURI(img));
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            // Show placeholder gradient
            const parent = target.parentElement;
            if (parent) {
              parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
          }}
        />
        {/* Dark gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Title overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
          <h3 className="font-display font-black text-lg md:text-xl text-white uppercase leading-tight tracking-tight drop-shadow-lg">
            {title}
          </h3>
        </div>
      </div>

      {/* Content Section - Compact, no excessive whitespace */}
      <div className="flex flex-col justify-between flex-1 p-6 min-h-0">
        <p className="text-gray-500 text-xs md:text-sm font-medium mb-4 leading-relaxed border-l-2 border-gray-200 pl-3">
          {desc}
        </p>
        
        <div className="flex flex-col gap-4">
          {/* Time Slot - Neutral Gray */}
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 w-fit">
               <i className="fa-regular fa-clock text-gray-400"></i>
               {schedule}
            </div>
          </div>

          {/* Action Button - Black to Emerald, Links to Schedule */}
          {isComingSoon ? (
            <button 
              disabled
              className="w-full py-3 md:py-4 rounded-xl bg-gray-100 text-gray-400 font-black text-xs md:text-sm uppercase tracking-[0.2em] cursor-not-allowed flex items-center justify-center gap-2"
            >
              СКОРО
            </button>
          ) : (
            <a 
              href={createTgLink(`Здравствуйте! Хочу записаться на тренировку: ${title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-3 md:py-4 bg-black text-white text-xs md:text-sm font-black uppercase tracking-[0.2em] rounded-xl transition-colors duration-300 hover:bg-emerald-500 hover:text-white flex items-center justify-center gap-2"
            >
              ЗАПИСАТЬСЯ
              <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </a>
          )}
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
    title: "КОМАНДА",
    shortTitle: "КОМАНДА",
    desc: "Профессиональные тренеры, действующие спортсмены сборной, мастера спорта познакомят вас с бадминтоном и влюбят в этот спорт.",
    img: "/team-why-us.jpg",
    imgPosition: "object-top" // кадр выше, чтобы были видны лица
  },
  {
    title: "МОЩНОЕ КОМЬЮНИТИ",
    shortTitle: "ЛЮДИ",
    desc: "Больше чем спорт. Турниры, вечеринки и новые друзья каждую неделю.",
    img: "/IMG_9758(2).jpg"
  },
  {
    title: "ТУРНИРЫ И ВЫЕЗДЫ",
    shortTitle: "СОБЫТИЯ",
    desc: "Мы регулярно выезжаем в разные уголки Татарстана, проводим веселые сборы и любительские соревнования. Скучно не будет!",
    img: eventsCardImg
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
    price: 1200,
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
    price: 1500,
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
    price: 1200,
    status: "active" 
  }
];

const MOCK_MEMBERSHIPS: Membership[] = [
    { id: 1, name: "Месячный абонемент", type: "Subscription", price: 4800, sessionCount: 8, isVisible: true },
    { id: 2, name: "Разовое посещение", type: "Single", price: 1200, sessionCount: 1, isVisible: false }
];

// --- MAIN PAGE ---

const Home: React.FC = () => {
  useSeo({
    title: 'Бадминтон в Казани — клуб Smashers | Играй и тренируйся',
    description: 'Бадминтонный клуб Smashers в Казани — тренировки для любителей и профессионалов, аренда кортов, секции для детей и взрослых. Приходите играть!',
  });
  const [scrollY, setScrollY] = useState(0);
  const { openBooking } = useBooking();

  // API Data States
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [upcomingSessionsLoaded, setUpcomingSessionsLoaded] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [singleVisitPrice, setSingleVisitPrice] = useState<number>(1200);
  // Счётчик "игроков на корте" — рандом, обновляется редко (не при скролле)
  const [livePlayersCount, setLivePlayersCount] = useState<number>(0);

  useEffect(() => {
    let cancelled = false; // Защита от дублирования запросов (React StrictMode)
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // FETCH DATA
    const fetchData = async () => {
      try {
        // 1. Sessions - запрашиваем больше сессий, берём первые 3 будущие
        const sessionsRes = await apiClient.get<{ data: Session[] }>('/sessions', { 
            limit: 30, 
            date_from: new Date().toISOString().split('T')[0],
        }).catch(() => null);

        if (cancelled) return;

        if (sessionsRes && sessionsRes.data) {
           const now = new Date();
           const futureSessions = sessionsRes.data
             .filter(session => new Date(session.datetime) > now)
             .slice(0, 3);
           setUpcomingSessions(futureSessions);
           const nearFuture = new Date(now.getTime() + 3 * 60 * 60 * 1000);
           const hasNearby = futureSessions.some(s => new Date(s.datetime) >= now && new Date(s.datetime) <= nearFuture);
           if (hasNearby && !cancelled) setLivePlayersCount(Math.floor(Math.random() * 13) + 8);
        } else {
           const now = new Date();
           const futureMockSessions = MOCK_SESSIONS
             .filter(session => new Date(session.datetime) > now)
             .slice(0, 3);
           setUpcomingSessions(futureMockSessions);
           const nearFuture = new Date(now.getTime() + 3 * 60 * 60 * 1000);
           const hasNearby = futureMockSessions.some(s => new Date(s.datetime) >= now && new Date(s.datetime) <= nearFuture);
           if (hasNearby && !cancelled) setLivePlayersCount(Math.floor(Math.random() * 13) + 8);
        }
        setUpcomingSessionsLoaded(true);

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
          setUpcomingSessionsLoaded(true);
          setUpcomingSessions(MOCK_SESSIONS);
          setMemberships(MOCK_MEMBERSHIPS);
          setSingleVisitPrice(1200);
          setLivePlayersCount(Math.floor(Math.random() * 13) + 8);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Обновлять "игроков на корте" редко (раз в 5 минут), не при скролле
  useEffect(() => {
    if (livePlayersCount <= 0) return;
    const interval = setInterval(() => {
      setLivePlayersCount(Math.floor(Math.random() * 13) + 8);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [livePlayersCount]);

  // Remove emojis from text, replace with space so "Американка💥В группа" → "Американка В группа"
  const removeEmojis = (text: string): string => {
    if (!text) return '';
    return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ').replace(/\s+/g, ' ').trim();
  };

  // Время сессии в Москве (API отдаёт UTC, в админке вводят по Москве)
  const formatTime = (isoString: string) => {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return "18:00";
        return new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', hour: '2-digit', minute: '2-digit' }).format(date);
    } catch {
        return "18:00";
    }
  };

  // Дата сессии в Москве для сравнения и отображения
  const getDateInMoscow = (d: Date) => new Intl.DateTimeFormat('ru-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d).replace(/-/g, '');

  // Smart date label: СЕГОДНЯ, ЗАВТРА, or date (всё по Москве)
  const getSmartDateLabel = (isoString: string): string => {
    try {
        const sessionDate = new Date(isoString);
        const now = new Date();
        const sessionDay = getDateInMoscow(sessionDate);
        const todayDay = getDateInMoscow(now);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowDay = getDateInMoscow(tomorrow);

        if (sessionDay === todayDay) return "СЕГОДНЯ";
        if (sessionDay === tomorrowDay) return "ЗАВТРА";
        return new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Moscow', day: 'numeric', month: 'short' }).format(sessionDate).toUpperCase().replace('.', '');
    } catch {
        return "";
    }
  };

  const getStatusColor = (spots: number) => {
     if (spots <= 2) return 'yellow';
     return 'green';
  };

  return (
    <div className="w-full bg-brand-ghost overflow-x-hidden">
      
      {/* 1. HERO BLOCK (RUSSIAN RICH VISUAL) */}
      <section id="hero" className="relative min-h-screen w-full overflow-hidden flex items-center -mt-20 pt-20">
        
        {/* Background Image Layer */}
        <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
                // Тёмный фон — fallback, когда картинка блокируется (ad-block и т.д.)
                background: "linear-gradient(to right, #0f0f0f 0%, #1a1a1a 50%, #2d2d2d 100%), url('https://images.unsplash.com/photo-1626224583764-847890e0e99b?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transform: `translateY(${scrollY * 0.2}px)`,
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
                    КАЗАНЬ • EST 2023
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
                    onClick={() => window.open(createTgLink("Здравствуйте! Хочу записаться на тренировку в Smashers."), '_blank', 'noreferrer')}
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
        
        {/* Hero Footer Status - Premium Glass Badge */}
        {livePlayersCount > 0 && (
          <div className="absolute bottom-8 right-8 z-20 hidden md:block animate-[fadeIn_2s_ease-out_1.2s_both]">
               <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full shadow-lg">
                   
                   {/* Pulse Indicator */}
                   <div className="relative flex items-center justify-center w-2.5 h-2.5">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                   </div>

                   {/* Label & Count */}
                   <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">LIVE</span>
                       <span className="w-[1px] h-3 bg-white/20"></span>
                       <span className="text-xs text-white font-medium tracking-wide">{livePlayersCount} ИГРОКОВ НА КОРТЕ</span>
                   </div>

               </div>
          </div>
        )}

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
            Твой спорт. Твои люди. Твой драйв. <br/>Просто приходи и играй.
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
            desc="База и фундамент. Хват, правила, перемещения и основы техники."
            img="/Для начинающих.png"
            price="800₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="high"
          />
          <FormatCard 
            title="Для продолжающих"
            desc="Более глубокое погружение в технику и тактику, совершенствование взаимодействий и видения игры."
            img="/Для продолжающих.png"
            price="900₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="high"
          />
          <FormatCard 
            title="Игровая тренировка"
            desc="Спарринги, эмоции и реальная игровая практика без пауз."
            img="/Игровая.png"
            price="600₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="low"
          />
          <FormatCard 
            title="Американка"
            desc="Каждая игра с новым партнером и новым соперником. Один из самых весёлых и азартных форматов игры."
            img="/Американка2.png"
            price="1000₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="low"
          />
          <FormatCard 
            title="Персональная"
            desc="1 на 1 с тренером. Максимальный фокус на твоих ошибках."
            img="/Персональная.png"
            price="2000₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="low"
          />
          <FormatCard 
            title="Сплит-тренировка"
            desc="Тренировка для двоих. Эффективно и выгодно."
            img="/Сплит-тренировка.png"
            price="1400₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="low"
          />
          <FormatCard 
            title="Мини-группы"
            desc="Малая группа до 4 человек. Индивидуальный подход по цене групповой тренировки."
            img="/Gemini_Generated_Image_2l2s5r2l2s5r2l2s.png"
            price="1200₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="low"
          />
          <FormatCard 
            title="Детские тренировки"
            desc="Спорт, дисциплина и веселье для будущих чемпионов (6-14 лет)."
            img="/Детская академия.png"
            price="600₽"
            schedule="1.5 часа"
            gridSpan="md:col-span-3"
            fetchPriority="low"
          />
        </div>
      </section>

      {/* NEW BLOCK 1: UPCOMING SESSIONS (FLIGHT BOARD) */}
      <section className="py-12 px-4 md:px-12 max-w-[1440px] mx-auto -mt-10 relative z-20 mb-20">
        <div className="bg-brand-carbon rounded-[2rem] p-6 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[80px] transition-colors"></div>
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
            <div className="flex flex-col gap-4 relative z-10">
                {!upcomingSessionsLoaded ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Загрузка расписания...</p>
                    </div>
                ) : upcomingSessions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Нет предстоящих тренировок на ближайшие дни.</p>
                    </div>
                ) : (
                    upcomingSessions.map((session, i) => {
                        const cleanName = removeEmojis(session.name);
                        const cleanLocation = session.location?.name ? removeEmojis(session.location.name) : '';
                        const smartDateLabel = getSmartDateLabel(session.datetime);
                        const time = formatTime(session.datetime);
                        const spotsText = session.availableSpots > 0 ? `${session.availableSpots} мест` : 'Мест нет';
                        
                        return (
                            <div
                                key={i}
                                className="group relative bg-[#18181b] border border-white/5 rounded-3xl p-5 flex flex-col gap-4 overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/30"
                            >
                                {/* Header Row: Time & Smart Date Badge */}
                                <div className="flex justify-between items-start">
                                    <span className="text-4xl md:text-5xl font-display font-black text-white leading-none tracking-tight">
                                        {time}
                                    </span>
                                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {smartDateLabel}
                                    </span>
                                </div>

                                {/* Info Block: Title & Location */}
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-white font-bold uppercase text-lg truncate">
                                        {cleanName}
                                    </h3>
                                    
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <i className="fa-solid fa-location-dot w-4 h-4 text-gray-500"></i>
                                        <span className="text-sm text-gray-400 font-medium truncate">
                                            {cleanLocation}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-gray-600 mx-1"></span>
                                        <span className={`text-xs font-bold ${
                                            session.availableSpots > 0 
                                                ? 'text-emerald-500' 
                                                : 'text-red-500'
                                        }`}>
                                            {spotsText}
                                        </span>
                                    </div>
                                </div>

                                {/* Footer: Wide Button — запись или лист ожидания */}
                                <a
                                    href={createTgLink(session.availableSpots <= 0
                                        ? `Здравствуйте! Хочу в лист ожидания на тренировку: ${cleanName}, ${smartDateLabel} в ${time}.`
                                        : `Здравствуйте! Хочу записаться на тренировку: ${cleanName} ${smartDateLabel} в ${time}.`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`w-full mt-2 py-3.5 rounded-xl font-bold uppercase text-sm tracking-wider transition-colors duration-300 flex items-center justify-center text-center ${
                                        session.availableSpots <= 0
                                            ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                            : 'bg-white/5 text-white group-hover:bg-emerald-500'
                                    }`}
                                >
                                    {session.availableSpots <= 0 ? 'В ЛИСТ ОЖИДАНИЯ' : 'ЗАПИСАТЬСЯ'}
                                </a>
                            </div>
                        );
                    })
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
                    <img src={card.img} alt={card.title} className={`absolute inset-0 w-full h-full object-cover z-0 ${(card as { imgPosition?: string }).imgPosition || ''}`} loading="lazy" decoding="async" />
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
                    <img src={card.img} alt={card.title} className={`absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-1000 group-hover:scale-110 ${(card as { imgPosition?: string }).imgPosition || ''}`} loading="lazy" decoding="async" />
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
                   {singleVisitPrice}₽
               </div>
               <ul className="space-y-4 mb-8 flex-grow">
                  {['Топовый инвентарь бесплатно', 'Любое время'].map(item => (
                     <li key={item} className="flex items-center gap-3 text-sm font-bold text-gray-600">
                        <i className="fa-solid fa-check text-emerald-500"></i> {item}
                     </li>
                  ))}
               </ul>
               <button 
                  onClick={() => openBooking('membership', 2, 'Разовое посещение')}
                  className="w-full py-4 rounded-xl border-2 border-gray-100 font-black text-xs uppercase tracking-widest hover:bg-brand-carbon hover:text-white transition-all group-hover:border-brand-carbon"
               >
                  ЗАПИСАТЬСЯ
               </button>
            </div>

            {/* Card 2: Membership (Featured - First found membership) */}
            <div className="relative bg-gradient-to-br from-[#0f172a] to-[#059669] rounded-[2rem] p-8 text-white shadow-2xl md:-translate-y-6 md:scale-105 overflow-hidden group flex flex-col">
               <div className="absolute top-4 right-4 bg-brand-lime text-brand-carbon text-[10px] font-black uppercase px-3 py-1 rounded-full animate-pulse shadow-glow-lime">ХИТ ПРОДАЖ</div>
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
               {/* Gloss effect */}
               <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 pointer-events-none"></div>

               <h3 className="relative z-10 font-display font-black text-2xl md:text-3xl uppercase mb-2 tracking-wide">АБОНЕМЕНТЫ</h3>
               <p className="relative z-10 text-sm text-emerald-200 font-bold uppercase tracking-widest mb-8">4 • 8 • 16 ТРЕНИРОВОК</p>
               
               <div className="relative z-10 mb-8">
                  <div className="text-4xl md:text-5xl font-display font-black text-white mb-2">ВЫГОДА ДО 20%</div>
                  <div className="text-sm text-white/70 font-medium">от {memberships[0]?.price || 4400}₽</div>
               </div>
               
               <ul className="relative z-10 space-y-4 mb-10 flex-grow">
                  {['Инвентарь включен'].map(item => (
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
                   ЗАПИСАТЬСЯ
               </button>
            </div>

            {/* Card 3: Personal */}
            <div className="bg-[#18181b] rounded-[2rem] p-8 shadow-xl flex flex-col relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 min-h-[450px]">
               <div className="relative z-10">
                  <h3 className="font-display font-black text-2xl text-white uppercase mb-2">ПЕРСОНАЛЬНЫЕ</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">С ТРЕНЕРОМ</p>
                  <div className="text-3xl md:text-4xl font-display font-black text-white mb-8">от 3000 руб</div>
                  <ul className="space-y-4 mb-8">
                     {['Разбор техники', 'План тренировок', 'Спарринг'].map(item => (
                        <li key={item} className="flex items-center gap-3 text-sm font-bold text-white">
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
          
          <div className="container mx-auto px-6 mb-12 relative z-10">
             <div>
                <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-2 block">Больше, чем просто спорт</span>
                <h2 className="font-display font-black text-3xl md:text-5xl text-white uppercase tracking-tight">ОТЗЫВЫ ИГРОКОВ</h2>
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
                 ПЕРВАЯ ТРЕНИРОВКА — <br/> ВСЕГО 700₽
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
                    <span className="block text-[9px] font-black uppercase tracking-widest opacity-90 mb-1">СПЕЦИАЛЬНАЯ ЦЕНА</span>
                    <span className="block font-display font-black text-3xl md:text-4xl">700₽</span>
                 </div>
               </div>

               {/* Button */}
               <a 
                  href={createTgLink("Здравствуйте! Хочу записаться на первую тренировку.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto min-w-0 bg-white text-slate-900 font-display font-black text-base md:text-xl py-5 px-6 md:px-16 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all uppercase tracking-widest group relative overflow-hidden flex items-center justify-center text-center"
               >
                 <span className="relative z-10 font-black whitespace-nowrap">ЗАПИСАТЬСЯ</span>
                 <div className="absolute inset-0 bg-gray-100 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
               </a>
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

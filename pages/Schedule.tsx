
import React, { useState, useEffect, useMemo } from 'react';
import { useBooking } from '../context/BookingContext';
import { apiClient, Session, Location } from '../config/api';
import MembershipCalculator from '../components/MembershipCalculator';
import { createTgLink } from '../constants';
import { useSeo } from '../hooks/useSeo';

const FAQS = [
  { q: "Можно ли вернуть деньги?", a: "Возврат не делаем." },
  { q: "Какие способы оплаты?", a: "Мы принимаем карты, наличные и переводы." },
  { q: "Что если я опаздываю?", a: "Если опаздываете, обязательно предупредите тренера. Разминка — критически важная часть тренировки." },
];

const MOCK_LOCATIONS: Location[] = [
    { id: 1, name: "Зал №1", description: "Основной зал", showLocation: true, showOnBookingScreen: true, sortOrder: 1 },
    { id: 2, name: "Зал №2", description: "Малый зал", showLocation: true, showOnBookingScreen: true, sortOrder: 2 }
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
    price: 1200,
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
    price: 1500,
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
    price: 1200,
    status: "active" 
  }
];

// --- UTILITY FUNCTIONS ---

// Remove emojis from text, replace with space so "Американка💥В группа" → "Американка В группа"
const removeEmojis = (text: string): string => {
  if (!text) return '';
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, ' ').replace(/\s+/g, ' ').trim();
};

// Valid locations allowlist
const VALID_LOCATIONS = [
  { id: 1, name: "Центр Бадминтона" },
  { id: 2, name: "Зал на Ямашева" },
  { id: 3, name: "Максимус на Баруди" }
];

// Location name mapping (variations -> canonical)
const LOCATION_MAP: Record<string, string> = {
  "центр бадминтона": "Центр Бадминтона",
  "центр": "Центр Бадминтона",
  "цб": "Центр Бадминтона",
  "ямашева": "Зал на Ямашева",
  "зал на ямашева": "Зал на Ямашева",
  "максимус": "Максимус на Баруди",
  "максимус на баруди": "Максимус на Баруди",
  "баруди": "Максимус на Баруди"
};

// Normalize session data: fix children's training, remove emojis, map locations
const normalizeSession = (session: Session): Session => {
  if (!session) return session;
  
  // Create a deep copy to avoid mutating original
  const normalized: Session = { ...session };
  
  // Clean emojis from session name
  if (normalized.name) {
    normalized.name = removeEmojis(normalized.name);
  }
  
  // Fix location and category
  if (normalized.location) {
    const locName = normalized.location.name || '';
    const cleanLocName = removeEmojis(locName).toLowerCase();
    
    // Check if this is children's training (in location or category name)
    const isChildren = 
      cleanLocName.includes('детск') || 
      (normalized.category?.name && normalized.category.name.toLowerCase().includes('детск'));
    
    if (isChildren) {
      // Force children's training to correct location and category
      normalized.location = {
        id: 3, // Максимус на Баруди
        name: "Максимус на Баруди"
      };
      normalized.category = {
        id: 999, // Consistent ID for children's category
        name: "Детские тренировки"
      };
    } else {
      // Map location name to canonical form
      const mappedName = LOCATION_MAP[cleanLocName] || null;
      if (mappedName) {
        const validLoc = VALID_LOCATIONS.find(l => l.name === mappedName);
        if (validLoc) {
          normalized.location = {
            id: validLoc.id,
            name: validLoc.name
          };
        } else {
          // Clean emojis from location name
          normalized.location = {
            ...normalized.location,
            name: removeEmojis(normalized.location.name)
          };
        }
      } else {
        // Clean emojis but keep original if not in map
        normalized.location = {
          ...normalized.location,
          name: removeEmojis(normalized.location.name)
        };
      }
    }
  }
  
  // Clean category name emojis
  if (normalized.category) {
    normalized.category = {
      ...normalized.category,
      name: removeEmojis(normalized.category.name)
    };
  }
  
  return normalized;
};

const Schedule: React.FC = () => {
  useSeo({
    title: 'Расписание тренировок по бадминтону в Казани',
    description: 'Расписание тренировок по бадминтону в Казани: групповые и детские занятия, абонементы, цены. Онлайн-запись на занятия в клубе Smashers.',
    image: '/Gemini_Generated_Image_l5hojql5hojql5ho.png',
  });
  const { openBooking } = useBooking();
  const [activeMainTab, setActiveMainTab] = useState<'schedule' | 'pricing'>('schedule');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- CACHED DATA (30 days range) ---
  const [allSessionsCache, setAllSessionsCache] = useState<Session[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [cacheDateRange, setCacheDateRange] = useState<{ from: string; to: string } | null>(null);
  
  // --- UI STATE ---
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dateWindowStart, setDateWindowStart] = useState<number>(0); // Days offset from today
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // --- INITIAL DATA FETCH (30 days range) ---
  useEffect(() => {
    let cancelled = false;
    
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const dateFrom = today.toISOString().split('T')[0];
        const dateTo = new Date(today);
        dateTo.setDate(today.getDate() + 30);
        const dateToStr = dateTo.toISOString().split('T')[0];
        
        console.log('[Schedule] Fetching sessions range:', dateFrom, 'to', dateToStr);
        
        const [sessionsRes, locationsRes] = await Promise.all([
          apiClient.get<{ success: boolean; data: Session[] }>('/sessions', {
            date_from: dateFrom,
            date_to: dateToStr,
          }).catch((err) => {
            console.error('[Schedule] Error fetching sessions:', err);
            return null;
          }),
          apiClient.get<{ success: boolean; data: Location[] }>('/locations').catch((err) => {
            console.error('[Schedule] Error fetching locations:', err);
            return null;
          }),
        ]);
        
        if (cancelled) return;
        
        if (sessionsRes && sessionsRes.success && sessionsRes.data && Array.isArray(sessionsRes.data)) {
          console.log('[Schedule] Received', sessionsRes.data.length, 'sessions from API');
          
          // Normalize all sessions before caching
          const normalizedSessions = sessionsRes.data
            .map(normalizeSession)
            .filter(session => {
              // Filter out sessions with invalid locations (only keep the 3 valid ones)
              if (!session.location) return false;
              const locName = session.location.name?.toLowerCase() || '';
              return VALID_LOCATIONS.some(vl => 
                vl.name.toLowerCase() === locName || 
                LOCATION_MAP[locName] === vl.name
              ) || locName.includes('максимус') || locName.includes('баруди');
            });
          
          console.log('[Schedule] Cached', normalizedSessions.length, 'normalized sessions');
          setAllSessionsCache(normalizedSessions);
          setCacheDateRange({ from: dateFrom, to: dateToStr });
        } else {
          console.log('[Schedule] Using fallback sessions');
          const normalizedMock = MOCK_SESSIONS.map(normalizeSession);
          setAllSessionsCache(normalizedMock);
        }
        
        if (locationsRes && locationsRes.success && locationsRes.data && Array.isArray(locationsRes.data)) {
          setAllLocations(locationsRes.data);
        } else {
          setAllLocations(MOCK_LOCATIONS);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[Schedule] Failed to fetch initial data", err);
          setAllSessionsCache(MOCK_SESSIONS);
          setAllLocations(MOCK_LOCATIONS);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchInitialData();
    
    return () => {
      cancelled = true;
    };
  }, []); // Only on mount

  // --- DATE STRIP GENERATION (with pagination) ---
  const MOSCOW_TZ = 'Europe/Moscow';
  // Дата «сегодня» в Москве (YYYY-MM-DD), для сравнения с сессиями и полоской
  const getTodayMoscowDateStr = () =>
    new Intl.DateTimeFormat('ru-CA', { timeZone: MOSCOW_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

  const getMoscowDateStr = (date: Date) =>
    new Intl.DateTimeFormat('ru-CA', { timeZone: MOSCOW_TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);

  const generateDates = (startOffset: number = 0) => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + startOffset + i);
      dates.push({
        fullDate: d.toISOString().split('T')[0],
        moscowDateStr: getMoscowDateStr(d),
        day: d.toLocaleDateString('ru-RU', { weekday: 'short' }).toUpperCase(),
        date: d.getDate()
      });
    }
    return dates;
  };

  const dateStrip = generateDates(dateWindowStart);

  const handleNextWeek = () => {
    setDateWindowStart(prev => prev + 7);
  };
  
  const handlePrevWeek = () => {
    setDateWindowStart(prev => Math.max(0, prev - 7));
  };

  // --- CLIENT-SIDE FILTERING ---
  
  // Get all unique categories from cache (for filter display)
  const allCategories = useMemo(() => {
    const categoryMap = new Map<number, { id: number; name: string }>();
    
    // Add all categories from cached sessions (including "Детские тренировки")
    allSessionsCache.forEach(session => {
      if (session.category && !categoryMap.has(session.category.id)) {
        categoryMap.set(session.category.id, session.category);
      }
    });
    
    return Array.from(categoryMap.values());
  }, [allSessionsCache]);
  
  // Get all unique locations from cache (for filter display) - only valid locations
  const allLocationsList = useMemo(() => {
    const locationMap = new Map<number, { id: number; name: string }>();
    
    // Only include valid locations from cache
    allSessionsCache.forEach(session => {
      if (session.location) {
        const locName = session.location.name || '';
        // Check if it's one of the valid locations
        const isValid = VALID_LOCATIONS.some(vl => vl.name === locName);
        if (isValid && !locationMap.has(session.location.id)) {
          locationMap.set(session.location.id, session.location);
        }
      }
    });
    
    // Ensure all 3 valid locations are present (even if no sessions yet)
    VALID_LOCATIONS.forEach(vl => {
      if (!locationMap.has(vl.id)) {
        locationMap.set(vl.id, vl);
      }
    });
    
    return Array.from(locationMap.values()).sort((a, b) => a.id - b.id);
  }, [allSessionsCache]);
  
  // Filter sessions by date and filters (client-side)
  const filteredSessions = useMemo(() => {
    const now = new Date();
    
    return allSessionsCache.filter(session => {
      // Date filter
      if (!session.datetime) return false;
      const sessionDate = session.datetime.split('T')[0];
      if (sessionDate !== selectedDate) return false;
      
      // Time filter - only show future sessions
      const sessionDateTime = new Date(session.datetime);
      if (sessionDateTime < now) return false;
      
      // Location filter
      if (selectedLocationId && session.location?.id !== selectedLocationId) return false;
      
      // Category filter
      if (selectedCategoryId && session.category?.id !== selectedCategoryId) return false;
      
      return true;
    }).sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
  }, [allSessionsCache, selectedDate, selectedLocationId, selectedCategoryId]);
  
  // Smart dots: only dates that have at least one future session (and match filters)
  const getDateHasMatchingSessions = (dateStr: string): boolean => {
    const now = new Date();
    return allSessionsCache.some(session => {
      if (!session.datetime) return false;
      const sessionDate = session.datetime.split('T')[0];
      if (sessionDate !== dateStr) return false;
      if (new Date(session.datetime) <= now) return false;
      if (selectedLocationId && session.location?.id !== selectedLocationId) return false;
      if (selectedCategoryId && session.category?.id !== selectedCategoryId) return false;
      return true;
    });
  };

  // Не показывать «сегодня» в полоске, если по Москве на сегодня уже нет предстоящих тренировок
  const todayMoscowStr = getTodayMoscowDateStr();
  const dateStripFiltered = dateStrip.filter((d) => {
    const dMoscow = (d as { moscowDateStr?: string }).moscowDateStr ?? d.fullDate;
    if (dMoscow !== todayMoscowStr) return true;
    return getDateHasMatchingSessions(todayMoscowStr);
  });

  // Если выбранная дата скрыта (сегодня без тренировок), переключить на первый видимый день
  useEffect(() => {
    const strip = generateDates(dateWindowStart);
    const filtered = strip.filter((d) => {
      const dMoscow = (d as { moscowDateStr?: string }).moscowDateStr ?? d.fullDate;
      if (dMoscow !== todayMoscowStr) return true;
      return getDateHasMatchingSessions(todayMoscowStr);
    });
    const visible = filtered.some((d) => d.fullDate === selectedDate);
    if (!visible && filtered.length > 0) {
      setSelectedDate(filtered[0].fullDate);
    }
  }, [todayMoscowStr, dateWindowStart, selectedDate, allSessionsCache, selectedLocationId, selectedCategoryId]);

  // --- HELPERS ---

  // Время сессии в Москве (API отдаёт UTC, в админке вводят по Москве)
  const formatTime = (iso: string) => {
      try {
          const date = new Date(iso);
          return new Intl.DateTimeFormat('ru-RU', { timeZone: MOSCOW_TZ, hour: '2-digit', minute: '2-digit' }).format(date);
      } catch {
          return "18:00";
      }
  };

  const formatDateShort = (iso: string) => {
      try {
          const date = new Date(iso);
          return new Intl.DateTimeFormat('ru-RU', { timeZone: MOSCOW_TZ, day: '2-digit', month: '2-digit' }).format(date);
      } catch {
          return "";
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
            
            {/* MAIN TOGGLE SWITCH - Segmented Control */}
            <div className="flex p-1 bg-gray-100 rounded-full w-full md:w-[400px] h-14 mx-auto relative shadow-inner">
               <button 
                 onClick={() => setActiveMainTab('schedule')}
                 className={`flex-1 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                   activeMainTab === 'schedule' 
                     ? 'bg-emerald-500 text-white shadow-lg' 
                     : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                 }`}
               >
                 <i className="fa-regular fa-calendar"></i> ТРЕНИРОВКИ
               </button>
               <button 
                 onClick={() => setActiveMainTab('pricing')}
                 className={`flex-1 rounded-full text-sm font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${
                   activeMainTab === 'pricing' 
                     ? 'bg-emerald-500 text-white shadow-lg' 
                     : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
                 }`}
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

            {/* 2.2 DATE STRIP WITH PAGINATION */}
            <div className="flex items-center gap-3 mb-8">
              {dateWindowStart > 0 && (
                <button
                  onClick={handlePrevWeek}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                >
                  <i className="fa-solid fa-chevron-left text-gray-600"></i>
                </button>
              )}
              
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1 snap-x">
                {dateStripFiltered.map((d) => {
                  const hasMatchingSessions = getDateHasMatchingSessions(d.fullDate);
                  return (
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
                      {hasMatchingSessions && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      )}
                      {selectedDate === d.fullDate && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-green-500"></div>
                      )}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={handleNextWeek}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
              >
                <i className="fa-solid fa-chevron-right text-gray-600"></i>
              </button>
            </div>

            {/* 2.2.5 PREMIUM FILTER BAR (Chips Style) */}
            {(allCategories.length > 0 || allLocationsList.length > 0) && (
              <div className="mb-8 space-y-4">
                {/* Category Filter Row */}
                {allCategories.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">КАТЕГОРИЯ</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                      <button
                        onClick={() => setSelectedCategoryId(null)}
                        className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                          selectedCategoryId === null
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        ВСЕ
                      </button>
                      {allCategories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategoryId(cat.id)}
                          className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                            selectedCategoryId === cat.id
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Location Filter Row */}
                {allLocationsList.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500">ЛОКАЦИЯ</label>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                      <button
                        onClick={() => setSelectedLocationId(null)}
                        className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                          selectedLocationId === null
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <i className="fa-solid fa-map-pin"></i> ВСЕ
                      </button>
                      {allLocationsList.map((loc) => (
                        <button
                          key={loc.id}
                          onClick={() => setSelectedLocationId(loc.id)}
                          className={`px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                            selectedLocationId === loc.id
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <i className="fa-solid fa-location-dot"></i> {removeEmojis(loc.name)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2.3 THE PRO SCHEDULE LIST */}
            <div className="space-y-4">
               {loading ? (
                   <div className="py-20 text-center text-gray-400 animate-pulse">
                       Загрузка расписания...
                   </div>
               ) : filteredSessions.length === 0 ? (
                   <div className="text-center py-20 opacity-50 border-2 border-dashed border-gray-200 rounded-3xl mt-8">
                      <i className="fa-regular fa-calendar-xmark text-4xl mb-4 text-gray-400"></i>
                      <p className="font-bold text-gray-400 uppercase tracking-widest">
                        {allSessionsCache.length === 0 ? 'ЗАГРУЗКА РАСПИСАНИЯ...' : 'НЕТ ТРЕНИРОВОК ПО ВЫБРАННЫМ ФИЛЬТРАМ'}
                      </p>
                   </div>
               ) : (
                   filteredSessions.map((slot) => {
                     const status = getStatusInfo(slot);
                     const locName = removeEmojis(allLocations.find(l => l.id === slot.location.id)?.name || slot.location.name);
                     
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
                                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                     {slot.category && (
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                           {slot.category.name}
                                        </span>
                                     )}
                                     {slot.price !== null && slot.price !== undefined && (
                                        <div className="flex items-center gap-1.5">
                                           <i className="fa-solid fa-ruble-sign text-emerald-600 text-xs"></i>
                                           <span className="text-sm font-black text-emerald-600">
                                              {slot.price.toLocaleString('ru-RU')} ₽
                                           </span>
                                        </div>
                                     )}
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
                                    <a
                                      href={createTgLink(slot.availableSpots <= 0
                                        ? `Здравствуйте! Хочу в лист ожидания на тренировку: ${slot.name}, ${formatDateShort(slot.datetime)} ${formatTime(slot.datetime)}.`
                                        : `Здравствуйте! Хочу записаться на тренировку: ${slot.name}, ${formatDateShort(slot.datetime)} ${formatTime(slot.datetime)}.`)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-block px-4 py-3 md:px-6 md:py-3 rounded-lg font-black text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all active:scale-95 ${
                                          slot.availableSpots <= 0
                                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                          : 'bg-brand-carbon text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/30'
                                      }`}
                                    >
                                      {slot.availableSpots <= 0 ? 'В ЛИСТ ОЖИДАНИЯ' : 'ЗАПИСАТЬСЯ'}
                                    </a>
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
                 <a 
                    href={createTgLink("Здравствуйте! Хочу записаться на пробную тренировку.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-emerald-700 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-lime hover:text-brand-carbon transition-colors shadow-xl active:scale-95 inline-block text-center"
                 >
                    ЗАПИСАТЬСЯ
                 </a>
              </div>
           </div>
        </div>
      </section>

    </div>
  );
};

export default Schedule;

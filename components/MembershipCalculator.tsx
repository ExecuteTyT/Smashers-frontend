
import React, { useState, useEffect, useMemo } from 'react';
import { apiClient, Membership } from '../config/api';
import { useBooking } from '../context/BookingContext';

// Types for internal logic
type CategoryKey = 'adults' | 'kids' | 'personal';

interface OrganizedData {
  [category: string]: {
    [location: string]: Membership[];
  };
}

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  adults: 'ВЗРОСЛЫЕ',
  kids: 'ДЕТИ',
  personal: 'ПЕРСОНАЛЬНО',
};

const MembershipCalculator: React.FC = () => {
  const { openBooking } = useBooking();
  const [loading, setLoading] = useState(true);
  const [rawMemberships, setRawMemberships] = useState<Membership[]>([]);
  const [basePrice, setBasePrice] = useState<number>(1200);

  // Selection State
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('adults');
  const [activeLocation, setActiveLocation] = useState<string>('');
  const [activeSessionCount, setActiveSessionCount] = useState<number>(0);

  // 1. Fetch Data
  useEffect(() => {
    let cancelled = false; // Защита от дублирования запросов (React StrictMode)
    
    const init = async () => {
      setLoading(true);
      try {
        const [allRes, singleRes] = await Promise.all([
          apiClient.get<{ data: Membership[] }>('/memberships').catch(() => ({ data: [] })),
          apiClient.get<{ data: Membership }>('/memberships/2').catch(() => ({ 
            data: { id: 2, name: 'Разовая тренировка', price: 1200, sessionCount: 1, type: 'Single', isVisible: false } as Membership 
          }))
        ]);

        // Проверка на отмену (защита от дублирования)
        if (cancelled) return;

        let items = allRes.data || [];
        const singleItem = singleRes.data;

        // НЕ фильтруем подарочные сертификаты здесь - фильтрация будет при организации данных
        // по категориям (исключаем только для adults/kids, но оставляем для personal)

        // Ensure single item is in the list if not present (it acts as base for 1 session)
        if (singleItem && singleItem.id && !items.find(m => m.id === singleItem.id)) {
            items.push(singleItem);
        }

        if (!cancelled) {
          setRawMemberships(items);
          if (singleItem && singleItem.price) setBasePrice(singleItem.price);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Calculator data fetch error", e);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    init();
    
    // Cleanup функция для отмены запроса при размонтировании
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Transform Data
  const organizedData = useMemo(() => {
    const data: OrganizedData = {
      adults: {},
      kids: {},
      personal: {}
    };

    rawMemberships.forEach(item => {
      // Safety check to prevent crashing if data is malformed
      if (!item || !item.name) return;

      const name = item.name.toLowerCase();
      const type = item.type?.toLowerCase() || '';
      const isGiftCertificate = type.includes('подарочн') || type.includes('серт');
      
      let cat: CategoryKey = 'adults';
      let loc = 'Центр (ЦБ)';

      // Categorize
      if (name.includes('дети')) {
        cat = 'kids';
        loc = 'Максимус';
        // Для категории "kids" исключаем подарочные сертификаты
        if (isGiftCertificate) return;
      } else if (name.includes('персональн') || name.includes('личная')) {
        cat = 'personal';
        loc = 'Любой зал';
        // Для категории "personal" ОСТАВЛЯЕМ подарочные сертификаты (все персональные - это подарочные)
      } else {
        cat = 'adults';
        if (name.includes('ямашева')) loc = 'Ямашева';
        else loc = 'Центр (ЦБ)';
        // Для категории "adults" исключаем подарочные сертификаты
        if (isGiftCertificate) return;
      }

      if (!data[cat][loc]) data[cat][loc] = [];
      data[cat][loc].push(item);
    });

    // Sort by price or session count
    Object.keys(data).forEach(c => {
        Object.keys(data[c]).forEach(l => {
            data[c][l].sort((a, b) => a.sessionCount - b.sessionCount);
        });
    });

    return data;
  }, [rawMemberships]);

  // 3. Auto-Select Logic
  // Effect to set default location when category changes
  useEffect(() => {
    const locations = Object.keys(organizedData[activeCategory] || {});
    if (locations.length > 0) {
      // If current location exists in new category, keep it? No, logic varies. Just pick first.
      if (!locations.includes(activeLocation)) {
          setActiveLocation(locations[0]);
      }
    } else {
        setActiveLocation('');
    }
  }, [activeCategory, organizedData]);

  // Effect to set default session count when location changes
  useEffect(() => {
    if (!activeLocation) return;
    const items = organizedData[activeCategory]?.[activeLocation] || [];
    if (items.length > 0) {
        // If currently selected count exists, keep it. Else pick closest/first.
        const exists = items.find(i => i.sessionCount === activeSessionCount);
        if (!exists) {
            // Default to 8 if available, else first
            const has8 = items.find(i => i.sessionCount === 8);
            setActiveSessionCount(has8 ? 8 : items[0].sessionCount);
        }
    } else {
        setActiveSessionCount(0);
    }
  }, [activeLocation, organizedData, activeCategory]);

  // 4. Get Current Item
  const currentItem = useMemo(() => {
      const items = organizedData[activeCategory]?.[activeLocation] || [];
      return items.find(i => i.sessionCount === activeSessionCount);
  }, [organizedData, activeCategory, activeLocation, activeSessionCount]);

  // 5. Calculate Savings
  const savings = useMemo(() => {
      if (!currentItem) return 0;
      
      let base = basePrice;
      
      // Heuristic: If category is personal, find the 1-session personal pack price
      if (activeCategory === 'personal') {
          const personalOne = organizedData.personal?.['Любой зал']?.find(i => i.sessionCount === 1);
          if (personalOne) base = personalOne.price;
      }

      const theoryPrice = base * currentItem.sessionCount;
      return theoryPrice - currentItem.price;
  }, [currentItem, basePrice, activeCategory, organizedData]);

  if (loading) return <div className="text-white text-center py-20 animate-pulse bg-slate-900 rounded-[2.5rem] p-12">Загрузка калькулятора...</div>;

  const availableLocations = Object.keys(organizedData[activeCategory] || {});
  const availableItems = organizedData[activeCategory]?.[activeLocation] || [];

  return (
    <div className="w-full bg-slate-900 rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/5 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <h2 className="font-display font-black text-3xl md:text-5xl text-white uppercase mb-10 relative z-10 text-center md:text-left">
            КАЛЬКУЛЯТОР <span className="text-emerald-500">ВЫГОДЫ</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {/* LEFT COLUMN: CONTROLS */}
            <div className="space-y-10">
                
                {/* 1. Categories */}
                <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">КТО БУДЕТ ЗАНИМАТЬСЯ?</label>
                    <div className="flex flex-wrap gap-2">
                        {(['adults', 'kids', 'personal'] as CategoryKey[]).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                                    activeCategory === cat 
                                    ? 'bg-white text-slate-900 shadow-lg scale-105' 
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {CATEGORY_LABELS[cat]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. Locations */}
                {availableLocations.length > 0 && (
                    <div className="animate-fade-in-up">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">ГДЕ УДОБНЕЕ?</label>
                        <div className="flex flex-wrap gap-2">
                            {availableLocations.map(loc => (
                                <button
                                    key={loc}
                                    onClick={() => setActiveLocation(loc)}
                                    className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border ${
                                        activeLocation === loc 
                                        ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                        : 'border-white/10 text-gray-400 hover:border-white/30'
                                    }`}
                                >
                                    <i className="fa-solid fa-location-dot mr-2"></i>
                                    {loc}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. Intensity */}
                <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">СКОЛЬКО ТРЕНИРОВОК?</label>
                    <div className="flex flex-wrap gap-3">
                        {availableItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSessionCount(item.sessionCount)}
                                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-display font-black text-lg md:text-xl transition-all ${
                                    activeSessionCount === item.sessionCount
                                    ? 'bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/40 scale-110'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {item.sessionCount}
                            </button>
                        ))}
                    </div>
                    {availableItems.length === 0 && (
                       <p className="text-gray-500 text-sm">Нет доступных абонементов для выбранных параметров.</p>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: GOLDEN TICKET */}
            <div className="lg:pl-10">
                {currentItem ? (
                    <div className="sticky top-24 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group transition-all duration-500">
                         {/* Shine Effect */}
                         <div className="absolute top-0 -left-[100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine pointer-events-none"></div>

                         <div className="relative z-10">
                             <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 gap-4">
                                 <div className="flex-1">
                                     <span className="inline-block px-3 py-1 rounded bg-white/10 text-gray-300 text-[10px] font-black uppercase tracking-widest mb-2 border border-white/5">
                                         {activeLocation}
                                     </span>
                                     <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase leading-tight">
                                         {currentItem.name}
                                     </h3>
                                 </div>
                                 {savings > 0 && (
                                     <div className="flex flex-col items-start md:items-end animate-pulse bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3 md:px-3 md:py-2">
                                         <span className="text-emerald-400 font-black text-[10px] md:text-xs uppercase tracking-widest">ВЫГОДА</span>
                                         <span className="text-emerald-400 font-display font-bold text-xl md:text-lg">+{savings.toLocaleString('ru-RU')}₽</span>
                                     </div>
                                 )}
                             </div>

                             <div className="py-8 border-y border-white/10 mb-8">
                                 <div className="flex items-baseline gap-2">
                                     <span className="font-display font-black text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-white">
                                         {currentItem.price.toLocaleString('ru-RU')}
                                     </span>
                                     <span className="text-xl text-gray-400 font-bold">₽</span>
                                 </div>
                                 {currentItem.sessionCount > 1 && (
                                    <p className="text-emerald-400/80 font-bold text-sm mt-2">
                                        ~{Math.round(currentItem.price / currentItem.sessionCount)} ₽ / занятие
                                    </p>
                                 )}
                             </div>

                             <button 
                                onClick={() => openBooking('membership', currentItem.id, currentItem.name)}
                                className="w-full bg-white text-slate-900 py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] active:scale-95"
                             >
                                 ОФОРМИТЬ
                             </button>
                             
                             <p className="text-center text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-4">
                                 Действует 30 дней с момента активации
                             </p>
                         </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-10 text-gray-600 font-bold uppercase tracking-widest text-center">
                        Выберите параметры <br/>для расчета
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MembershipCalculator;

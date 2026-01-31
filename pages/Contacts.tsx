
import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { apiClient } from '../config/api';

const Contacts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metro' | 'car' | 'bus' | 'walk'>('car');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { openBooking } = useBooking();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    topic: 'Запись на тренировку',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    
    try {
        await apiClient.post('/booking', {
            name: formData.name,
            phone: formData.phone,
            message: `Тема: ${formData.topic}. ${formData.message}`,
            source: 'contact_form'
        });
        setStatus('success');
        setFormData({ name: '', phone: '', topic: 'Запись на тренировку', message: '' });
    } catch (error) {
        // Silent catch
        setStatus('error');
    } finally {
        setLoading(false);
    }
  };

  // --- DATA MOCKS ---
  const GUIDE_CONTENT = {
    metro: {
      icon: "fa-train-subway",
      title: "НА МЕТРО",
      text: "Станция «Козья Слобода». Выход в сторону энергоуниверситета. 10 минут пешком через парк по прямой аллее. Ориентир — белый купол стадиона.",
      meta: "10-12 мин пешком"
    },
    car: {
      icon: "fa-car",
      title: "НА АВТОМОБИЛЕ",
      text: "Вбейте в навигатор: ул. Спортивная, 25. У нас есть собственная парковка на 20 мест прямо у входа (белый шлагбаум, скажите охране «в Смэшерс»).",
      meta: "Координаты: 55.81, 49.12"
    },
    bus: {
      icon: "fa-bus",
      title: "НА АВТОБУСЕ",
      text: "Автобусы №45, №12, №33. Остановка «Спортивный Комплекс». Перейдите дорогу по надземному переходу и двигайтесь к главному входу.",
      meta: "Ост. Спортивная"
    },
    walk: {
      icon: "fa-person-walking",
      title: "ПЕШКОМ",
      text: "Вход со двора здания. Ищите большие черные ворота с логотипом SMASHERS. Поднимайтесь на 2 этаж, дверь слева.",
      meta: "Вход со двора"
    }
  };

  const FAQS = [
    { q: "Где можно припарковаться?", a: "У нас есть собственная бесплатная парковка на 20 мест. Въезд под шлагбаум с улицы Спортивная. Если мест нет, рядом есть городская парковка." },
    { q: "Есть ли душевые и раздевалки?", a: "Конечно. Просторные раздевалки с индивидуальными шкафчиками, душевые с гелем и шампунем, фен и даже сауна." },
    { q: "Можно ли просто прийти посмотреть?", a: "Да, вы можете зайти в гостевую зону, выпить кофе и посмотреть за игрой. Администратор проведет вам экскурсию." },
  ];

  return (
    <div className="bg-brand-ghost min-h-screen font-body text-brand-carbon">
      
      {/* --- SECTION 1: HERO & BENTO GRID (CONNECTION HUB) --- */}
      <section className="relative bg-[#0F172A] pt-32 md:pt-40 pb-20 md:pb-24 px-4 md:px-12 rounded-b-[40px] md:rounded-b-[80px] overflow-hidden shadow-2xl z-10">
         {/* Background FX */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto relative z-10">
            <h1 className="font-display font-black text-3xl md:text-6xl text-white uppercase mb-8 md:mb-12 text-center md:text-left tracking-tighter animate-[fadeInUp_0.8s_ease-out]">
               МЫ ВСЕГДА НА СВЯЗИ
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 animate-[fadeInUp_1s_ease-out_0.2s_both]">
               
               {/* 1. ADDRESS CARD (Span 2) */}
               <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:bg-white/10 transition-colors min-h-[250px]">
                  <div className="mb-6">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 mb-6 border border-white/5">
                        <i className="fa-solid fa-map-location-dot text-xl md:text-2xl"></i>
                     </div>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">НАШ АДРЕС</p>
                     <p className="font-display font-bold text-white text-xl md:text-2xl leading-snug">
                        ул. Спортивная, д. 25 <br/>
                        <span className="text-white/60 text-base md:text-lg font-body font-medium">(вход со двора, 2 этаж)</span>
                     </p>
                  </div>
                  <a href="https://yandex.ru/maps" target="_blank" rel="noreferrer" className="inline-block w-full md:w-auto self-start">
                    <button className="w-full md:w-auto px-8 py-4 border border-white/30 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-[#0F172A] transition-all">
                        ПОСТРОИТЬ МАРШРУТ
                    </button>
                  </a>
               </div>

               {/* 2. TELEGRAM CARD (Span 1) */}
               <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-lg shadow-emerald-900/20 group hover:scale-[1.02] transition-transform relative overflow-hidden min-h-[250px]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <div className="relative z-10">
                     <i className="fa-brands fa-telegram text-white text-4xl mb-6"></i>
                     <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-4">MESSENGERS</p>
                     <div className="space-y-1 mb-6">
                        <p className="font-bold text-white text-lg">@mikhail_smashers</p>
                        <p className="font-bold text-white/70 text-lg">@alina_smashers</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => openBooking('general', undefined, 'Чат в Telegram')}
                    className="relative z-10 w-full bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-lg"
                  >
                     НАПИСАТЬ В TG
                  </button>
               </div>

               {/* 3. PHONE CARD (Span 1) */}
               <div className="bg-white p-6 md:p-8 rounded-3xl flex flex-col justify-between group hover:shadow-xl transition-all border border-gray-100 min-h-[250px]">
                  <div>
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center text-brand-carbon mb-6 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                        <i className="fa-solid fa-phone text-xl md:text-2xl"></i>
                     </div>
                     <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">ТЕЛЕФОН</p>
                     <p className="font-display font-black text-brand-carbon text-xl md:text-2xl break-words leading-none">
                        +7 (843) <br/> 123-45-67
                     </p>
                  </div>
                  <a href="tel:+78431234567" className="mt-8">
                     <button className="w-full bg-brand-carbon text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors">
                        ПОЗВОНИТЬ
                     </button>
                  </a>
               </div>
            </div>
         </div>
      </section>

      {/* ... MAP & NAV SECTIONS OMITTED FOR BREVITY, UNCHANGED ... */}
      
      {/* --- SECTION 3: CONTACT FORM (CONVERSION) --- */}
      <section className="bg-white py-20 md:py-24 px-4 md:px-12 border-y border-gray-100">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            
            {/* 3.1 Form Info (Left) */}
            <div>
               <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-widest mb-6">
                  ОБРАТНАЯ СВЯЗЬ
               </span>
               <h2 className="font-display font-black text-3xl md:text-5xl uppercase mb-6 leading-tight text-brand-carbon">
                  ОСТАЛИСЬ ВОПРОСЫ?
               </h2>
               <p className="text-gray-500 text-base md:text-lg mb-8 leading-relaxed">
                  Заполните форму, и наш администратор свяжется с вами, чтобы обсудить детали тренировки или ответить на вопросы.
               </p>
               
               <div className="flex items-center gap-4 text-sm font-bold text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  Отвечаем в течение 30 минут
               </div>
            </div>

            {/* 3.2 Form Inputs (Right) */}
            <form onSubmit={handleSubmit} className="bg-brand-ghost p-6 md:p-10 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">ИМЯ</label>
                     <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 font-bold text-brand-carbon focus:outline-none focus:border-emerald-500 transition-colors" 
                        placeholder="Иван" 
                        required 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">ТЕЛЕФОН</label>
                     <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 font-bold text-brand-carbon focus:outline-none focus:border-emerald-500 transition-colors" 
                        placeholder="+7 (999) 000-00-00" 
                        required 
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">ТЕМА</label>
                  <select 
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 font-bold text-brand-carbon focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  >
                     <option>Запись на тренировку</option>
                     <option>Аренда корта</option>
                     <option>Вопрос по ценам</option>
                     <option>Корпоративное предложение</option>
                     <option>Другое</option>
                  </select>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">СООБЩЕНИЕ</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3} 
                    className="w-full bg-white border border-gray-200 rounded-xl px-5 py-4 font-bold text-brand-carbon focus:outline-none focus:border-emerald-500 transition-colors resize-none" 
                    placeholder="Ваш вопрос..."
                  ></textarea>
               </div>

               <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy" className="mt-1 w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500" required />
                  <label htmlFor="privacy" className="text-xs text-gray-500 font-medium leading-snug cursor-pointer">
                     Я согласен с политикой конфиденциальности и обработкой персональных данных
                  </label>
               </div>

               <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-5 rounded-xl font-black text-sm uppercase tracking-[0.15em] hover:shadow-lg hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                  {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'ОТПРАВИТЬ ЗАЯВКУ'}
               </button>
               {status === 'success' && <p className="text-emerald-600 text-center font-bold text-sm">Заявка успешно отправлена!</p>}
               {status === 'error' && <p className="text-red-500 text-center font-bold text-sm">Ошибка при отправке. Попробуйте позже.</p>}
            </form>
         </div>
      </section>

      {/* ... FAQ SECTION OMITTED ... */}

    </div>
  );
};

export default Contacts;

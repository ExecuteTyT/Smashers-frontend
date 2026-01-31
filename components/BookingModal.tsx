
import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import { apiClient, BookingRequest, ApiError } from '../config/api';

const BookingModal: React.FC = () => {
  const { bookingState, closeBooking } = useBooking();
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bookingState.isOpen) {
      setFormData({ name: '', phone: '', message: '' });
      setSuccess(false);
      setError(null);
      setFieldErrors({});
    }
  }, [bookingState.isOpen]);

  if (!bookingState.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const payload: BookingRequest = {
        name: formData.name,
        phone: formData.phone,
        message: formData.message || undefined,
        source: bookingState.type === 'session' ? 'session_booking' 
              : bookingState.type === 'membership' ? 'membership_purchase' 
              : 'contact_form'
      };

      if (bookingState.type === 'session' && bookingState.targetId) {
        payload.sessionId = bookingState.targetId;
      }
      if (bookingState.type === 'membership' && bookingState.targetId) {
        payload.membershipId = bookingState.targetId;
      }

      await apiClient.post('/booking', payload);
      setSuccess(true);
      setTimeout(() => {
        closeBooking();
      }, 3000);
    } catch (err: any) {
      if (err.code === 'VALIDATION_ERROR' && err.details) {
        const errors: Record<string, string> = {};
        err.details.forEach((d: any) => {
          errors[d.field] = d.message;
        });
        setFieldErrors(errors);
      } else if (err.code === 'TOO_MANY_REQUESTS') {
        setError('Слишком много попыток. Пожалуйста, подождите минуту.');
      } else {
        setError(err.message || 'Произошла ошибка при отправке заявки.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeBooking}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
        
        {/* Header */}
        <div className="bg-brand-carbon p-6 flex justify-between items-center">
          <div>
            <h3 className="text-white font-display font-black text-xl uppercase">
              {success ? 'УСПЕШНО!' : 'ОСТАВИТЬ ЗАЯВКУ'}
            </h3>
            {!success && (
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                {bookingState.targetName || 'Мы свяжемся с вами'}
              </p>
            )}
          </div>
          <button onClick={closeBooking} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-bounce">
                <i className="fa-solid fa-check"></i>
              </div>
              <h4 className="font-display font-black text-2xl text-brand-carbon uppercase mb-2">ЗАЯВКА ОТПРАВЛЕНА</h4>
              <p className="text-gray-500 font-medium">Наш администратор свяжется с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">ВАШЕ ИМЯ</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className={`w-full bg-gray-50 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 font-bold text-brand-carbon focus:outline-none focus:border-emerald-500 focus:bg-white transition-all`}
                  placeholder="Иван"
                />
                {fieldErrors.name && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{fieldErrors.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">ТЕЛЕФОН</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className={`w-full bg-gray-50 border ${fieldErrors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl px-4 py-3 font-bold text-brand-carbon focus:outline-none focus:border-emerald-500 focus:bg-white transition-all`}
                  placeholder="+7 (999) 000-00-00"
                />
                {fieldErrors.phone && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{fieldErrors.phone}</p>}
              </div>

              <div>
                 <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">КОММЕНТАРИЙ (НЕОБЯЗАТЕЛЬНО)</label>
                 <textarea 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-brand-carbon focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none"
                    rows={3}
                    placeholder="Хочу узнать подробнее..."
                 />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-carbon text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'ОТПРАВИТЬ'}
              </button>

              <p className="text-center text-[10px] text-gray-400 font-medium">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

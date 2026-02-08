import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="bg-brand-ghost min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-carbon/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center relative z-10 max-w-2xl">
        <h1 className="font-display font-black text-9xl md:text-[12rem] text-brand-carbon leading-none opacity-10 select-none">
          404
        </h1>
        
        <div className="-mt-12 md:-mt-20">
            <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-black text-xs md:text-sm uppercase tracking-[0.2em] mb-6 shadow-lg rotate-[-2deg]">
                АУТ!
            </div>
            
            <h2 className="font-display font-black text-3xl md:text-5xl text-brand-carbon uppercase mb-6 leading-tight">
                Такой страницы <br/> не существует
            </h2>
            
            <p className="text-gray-500 text-sm md:text-lg font-medium mb-10 max-w-md mx-auto">
                Кажется, волан улетел за пределы поля. Вернитесь на корт и продолжите игру.
            </p>

            <Link to="/">
                <button className="bg-brand-carbon text-white px-10 py-4 rounded-xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-emerald-600 transition-colors shadow-xl active:scale-95 group">
                    <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
                    ВЕРНУТЬСЯ НА ГЛАВНУЮ
                </button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

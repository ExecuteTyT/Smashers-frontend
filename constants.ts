
import { TrainingLevel, ScheduleSlot } from './types';

export const TG_USERNAME = 'smashers_bc';

export const createTgLink = (text: string) => {
  return `https://t.me/${TG_USERNAME}?text=${encodeURIComponent(text)}`;
};

export const TRAINING_LEVELS: TrainingLevel[] = [
  {
    id: '01',
    title: 'ДЛЯ НАЧИНАЮЩИХ',
    price: '0₽',
    time: '19:00 - 21:00',
    days: ['ПН', 'СР', 'ПТ'],
    tags: ['БАЗА', 'ГРУППА', 'ПРОБНАЯ'],
    trainer: {
      name: 'Алексей Смирнов',
      image: 'https://picsum.photos/seed/t1/600/800'
    },
    checklist: ['СВЕТЛАЯ ПОДОШВА', 'УДОБНЫЕ ШОРТЫ', 'ВОДА']
  },
  {
    id: '02',
    title: 'СРЕДНИЙ УРОВЕНЬ',
    price: '1200₽',
    time: '20:00 - 22:00',
    days: ['ВТ', 'ЧТ'],
    tags: ['ТАКТИКА', 'ИНТЕНСИВ'],
    trainer: {
      name: 'Мария Иванова',
      image: 'https://picsum.photos/seed/t2/600/800'
    },
    checklist: ['РАКЕТКА (СВОЯ)', 'НАПУЛЬСНИКИ', 'СМЕННАЯ ФУТБОЛКА']
  }
];

export const SCHEDULE_SLOTS: ScheduleSlot[] = [
  {
    id: 's1',
    time: '08:00',
    title: 'УТРЕННЯЯ ГРУППА',
    hall: 'ЗАЛ А',
    trainer: 'Алексей С.',
    trainerImg: 'https://picsum.photos/seed/a1/100/100',
    status: 'many'
  },
  {
    id: 's2',
    time: '10:30',
    title: 'LADY BADMINTON',
    hall: 'ЗАЛ Б',
    trainer: 'Мария И.',
    trainerImg: 'https://picsum.photos/seed/a2/100/100',
    status: 'few',
    remaining: 2
  },
  {
    id: 's3',
    time: '18:00',
    title: 'PRO LEAGUE',
    hall: 'ЗАЛ А',
    trainer: 'Дмитрий В.',
    trainerImg: 'https://picsum.photos/seed/a3/100/100',
    status: 'full'
  }
];

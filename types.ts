
export interface TrainingLevel {
  id: string;
  title: string;
  price: string;
  days: string[];
  time: string;
  tags: string[];
  trainer: {
    name: string;
    image: string;
  };
  checklist: string[];
}

export interface ScheduleSlot {
  id: string;
  time: string;
  title: string;
  hall: string;
  trainer: string;
  trainerImg: string;
  status: 'full' | 'few' | 'many';
  remaining?: number;
}

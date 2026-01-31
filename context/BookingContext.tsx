
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BookingState {
  isOpen: boolean;
  type: 'session' | 'membership' | 'general';
  targetId?: number; // sessionId or membershipId
  targetName?: string; // For display purposes (e.g., "Yoga Class" or "Monthly Pass")
  extraInfo?: string;
}

interface BookingContextType {
  bookingState: BookingState;
  openBooking: (type: BookingState['type'], targetId?: number, targetName?: string, extraInfo?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookingState, setBookingState] = useState<BookingState>({
    isOpen: false,
    type: 'general'
  });

  const openBooking = (type: BookingState['type'], targetId?: number, targetName?: string, extraInfo?: string) => {
    setBookingState({
      isOpen: true,
      type,
      targetId,
      targetName,
      extraInfo
    });
  };

  const closeBooking = () => {
    setBookingState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <BookingContext.Provider value={{ bookingState, openBooking, closeBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

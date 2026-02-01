
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, Membership } from '../config/api';

interface MembershipContextType {
  memberships: Membership[];
  basePrice: number;
  loading: boolean;
  error: Error | null;
  refreshMemberships: () => Promise<void>;
}

const MembershipContext = createContext<MembershipContextType | undefined>(undefined);

export const MembershipProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [basePrice, setBasePrice] = useState<number>(1200);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      setError(null);

      const [allRes, singleRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: Membership[] }>('/memberships').catch(() => ({ 
          success: true, 
          data: [] 
        })),
        apiClient.get<{ success: boolean; data: Membership }>('/memberships/2').catch(() => ({ 
          success: true,
          data: { 
            id: 2, 
            name: 'Разовая тренировка', 
            price: 1200, 
            sessionCount: 1, 
            type: 'Single', 
            isVisible: false 
          } as Membership 
        }))
      ]);

      let items: Membership[] = [];
      let singlePrice = 1200;

      // Process all memberships
      if (allRes && allRes.success && allRes.data && Array.isArray(allRes.data)) {
        items = allRes.data;
      }

      // Process single visit price
      if (singleRes && singleRes.success && singleRes.data) {
        const singleItem = singleRes.data;
        singlePrice = singleItem.price || 1200;
        
        // Ensure single item is in the list if not present
        if (singleItem.id && !items.find(m => m.id === singleItem.id)) {
          items.push(singleItem);
        }
      }

      setMemberships(items);
      setBasePrice(singlePrice);
    } catch (err) {
      console.error('[MembershipContext] Error fetching memberships:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch memberships'));
      // Set fallback data
      setMemberships([]);
      setBasePrice(1200);
    } finally {
      setLoading(false);
    }
  };

  // Prefetch on mount
  useEffect(() => {
    fetchMemberships();
  }, []);

  const refreshMemberships = async () => {
    await fetchMemberships();
  };

  return (
    <MembershipContext.Provider 
      value={{ 
        memberships, 
        basePrice, 
        loading, 
        error, 
        refreshMemberships 
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};

export const useMemberships = () => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMemberships must be used within a MembershipProvider');
  }
  return context;
};

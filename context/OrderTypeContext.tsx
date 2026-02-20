import React, { createContext, useContext, useState, ReactNode } from 'react';

type OrderType = 'dine-in' | 'takeout' | null;

interface OrderTypeContextType {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
}

const OrderTypeContext = createContext<OrderTypeContextType | undefined>(undefined);

export function OrderTypeProvider({ children }: { children: ReactNode }) {
  const [orderType, setOrderType] = useState<OrderType>(null);

  return (
    <OrderTypeContext.Provider value={{ orderType, setOrderType }}>
      {children}
    </OrderTypeContext.Provider>
  );
}

export function useOrderType() {
  const context = useContext(OrderTypeContext);
  if (context === undefined) {
    throw new Error('useOrderType must be used within an OrderTypeProvider');
  }
  return context;
}

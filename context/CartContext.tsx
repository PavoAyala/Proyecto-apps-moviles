import React, { createContext, ReactNode, useContext, useState, useMemo } from 'react';

export interface CartItem {
    cartItemId: string; // Unique ID for this entry (product_id + normalized_note)
    id: number; // Product ID
    name: string;
    price: number;
    image_url: string | null;
    quantity: number;
    note?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: any, quantity?: number, note?: string) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: any, quantity: number = 1, note?: string) => {
        setItems((currentItems) => {
            // Normalize note: treat empty or whitespace-only as undefined
            const normalizedNote = note?.trim() || undefined;
            const cartItemId = `${product.id}-${normalizedNote || ''}`;

            // Find item by cartItemId to avoid duplicates with same preferences
            const existingItem = currentItems.find((item) => item.cartItemId === cartItemId);
            
            if (existingItem) {
                return currentItems.map((item) =>
                    (item.cartItemId === cartItemId)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            
            return [...currentItems, {
                cartItemId,
                id: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: quantity,
                note: normalizedNote
            }];
        });
    };

    const removeItem = (cartItemId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.cartItemId !== cartItemId));
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(cartItemId);
            return;
        }
        setItems((currentItems) =>
            currentItems.map((item) =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalAmount = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const value = useMemo(() => ({
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
    }), [items]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

import { CartItem } from '../context/CartContext';
import { supabase } from './supabase';

export async function createOrder(items: CartItem[], totalAmount: number, orderType: 'dine-in' | 'takeout') {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        // 1. Create the Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                total_amount: totalAmount,
                order_type: orderType,
                status: 'pending' // Default status
            })
            .select()
            .single();

        if (orderError) {
            console.error('Error creating order:', orderError);
            throw new Error('Failed to create order');
        }

        if (!order) {
            throw new Error('Order creation failed returning no data');
        }

        // 2. Create Order Items
        const orderItemsData = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsData);

        if (itemsError) {
            console.error('Error creating order items:', itemsError);
            // In a real app, we might want to delete the order here or use a stored procedure for atomicity
            throw new Error('Failed to create order items');
        }

        return order;

    } catch (error) {
        console.error('createOrder logic failed:', error);
        throw error;
    }
}

import { CartItem } from '../context/CartContext';
import { supabase } from './supabase';

export async function createOrder(
    items: CartItem[], 
    totalAmount: number, 
    orderType: 'dine-in' | 'takeout',
    paymentMethod: 'efectivo' | 'tarjeta' = 'efectivo'
) {
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
            throw new Error('Failed to create order items');
        }

        // 3. Create Payment Record
        const { error: paymentError } = await supabase
            .from('payments')
            .insert({
                order_id: order.id,
                amount: totalAmount,
                payment_method: paymentMethod,
                status: 'pending' // Default status for cash/card payments until confirmed by staff
            });

        if (paymentError) {
            console.error('Error creating payment record:', paymentError);
        }

        return order;

    } catch (error) {
        console.error('createOrder logic failed:', error);
        throw error;
    }
}

export async function getUserOrders(limit: number = 10) {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    *,
                    products (*)
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching user orders:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('getUserOrders logic failed:', error);
        throw error;
    }
}

export async function getUserStats() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { count, error: countError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (countError) {
            console.error('Error fetching user order count:', countError);
            throw countError;
        }

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('name, role, created_at')
            .eq('id', user.id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching user profile:', profileError);
        }

        return {
            email: user.email,
            name: profile?.name || user?.user_metadata?.full_name || 'Usuario',
            createdAt: profile?.created_at || user.created_at,
            orderCount: count || 0,
        };
    } catch (error) {
        console.error('getUserStats logic failed:', error);
        throw error;
    }
}

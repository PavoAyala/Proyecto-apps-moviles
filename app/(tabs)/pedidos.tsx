import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { getUserOrders } from '@/lib/orders';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function PedidosScreen() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = async () => {
        try {
            const data = await getUserOrders();
            
            // Sort: pending first, then by date descending (newest first)
            const sortedData = (data || []).sort((a, b) => {
                const statusOrder = { 'pending': 0, 'completed': 1 };
                const aStatus = (a.status as 'pending' | 'completed') || 'completed';
                const bStatus = (b.status as 'pending' | 'completed') || 'completed';
                
                if (statusOrder[aStatus] !== statusOrder[bStatus]) {
                    return statusOrder[aStatus] - statusOrder[bStatus];
                }
                
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });

            setOrders(sortedData);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar pedidos');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadOrders();
        }, [])
    );

    const renderOrderItem = ({ item }: { item: any }) => {
        return (
            <View style={[styles.orderCard, { backgroundColor: themeColors.card }]}>
                <View style={styles.orderHeader}>
                    <Text style={[styles.orderDate, { color: themeColors.text, opacity: 0.7 }]}>
                        {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <View style={[styles.statusBadge, item.status === 'pending' ? styles.statusPending : styles.statusCompleted]}>
                        <Text style={styles.statusText}>
                            {item.status === 'pending' ? 'Pendiente' : 'Completado'}
                        </Text>
                    </View>
                </View>

                <View style={[styles.orderTypeContainer, { borderBottomColor: themeColors.border }]}>
                    <IconSymbol name={item.order_type === 'dine-in' ? 'fork.knife' : 'takeoutbag.and.cup.and.straw'} size={18} color={themeColors.icon} />
                    <Text style={[styles.orderTypeText, { color: themeColors.text, opacity: 0.8 }]}>
                        {item.order_type === 'dine-in' ? 'Comer aquí' : 'Para llevar'}
                    </Text>
                </View>

                <View style={styles.itemsList}>
                    {item.order_items?.map((orderItem: any, index: number) => (
                        <View key={`${item.id}-item-${index}`} style={styles.productRow}>
                            <Text style={[styles.productQuantity, { color: themeColors.text }]}>{orderItem.quantity}x</Text>
                            <Text style={[styles.productName, { color: themeColors.text, opacity: 0.9 }]}>{orderItem.products?.name || 'Producto'}</Text>
                            <Text style={[styles.productSubtotal, { color: themeColors.text }]}>${(orderItem.subtotal).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.orderFooter, { borderTopColor: themeColors.border }]}>
                    <Text style={[styles.totalLabel, { color: themeColors.text }]}>Total</Text>
                    <Text style={styles.totalAmount}>${(item.total_amount).toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.centerContainer, { backgroundColor: themeColors.background }]}>
                <Text style={{ color: themeColors.text }}>Cargando pedidos...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <MaterialIcons name="error-outline" size={48} color="#ff4444" />
                <Text style={styles.errorText}>{error}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <IconSymbol name="list.bullet.rectangle.fill" size={64} color={themeColors.icon} />
                    <Text style={[styles.emptyText, { color: themeColors.text, opacity: 0.6 }]}>No tienes pedidos recientes</Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#D92323']} />
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#ff4444',
    },
    listContent: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderDate: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusPending: {
        backgroundColor: '#fff3cd',
    },
    statusCompleted: {
        backgroundColor: '#d1e7dd',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    orderTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderTypeText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#555',
    },
    itemsList: {
        marginBottom: 12,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    productQuantity: {
        width: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    productName: {
        flex: 1,
        color: '#444',
    },
    productSubtotal: {
        fontWeight: '500',
        color: '#333',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D92323',
    },
});

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { getUserOrders } from '@/lib/orders';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';

export default function PedidosScreen() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = async () => {
        try {
            const data = await getUserOrders();
            setOrders(data || []);
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
            <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderDate}>
                        {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <View style={[styles.statusBadge, item.status === 'pending' ? styles.statusPending : styles.statusCompleted]}>
                        <Text style={styles.statusText}>
                            {item.status === 'pending' ? 'Pendiente' : 'Completado'}
                        </Text>
                    </View>
                </View>

                <View style={styles.orderTypeContainer}>
                    <IconSymbol name={item.order_type === 'dine-in' ? 'fork.knife' : 'takeoutbag.and.cup.and.straw'} size={18} color="#666" />
                    <Text style={styles.orderTypeText}>
                        {item.order_type === 'dine-in' ? 'Comer aquí' : 'Para llevar'}
                    </Text>
                </View>

                <View style={styles.itemsList}>
                    {item.order_items?.map((orderItem: any, index: number) => (
                        <View key={index} style={styles.productRow}>
                            <Text style={styles.productQuantity}>{orderItem.quantity}x</Text>
                            <Text style={styles.productName}>{orderItem.products?.name || 'Producto'}</Text>
                            <Text style={styles.productSubtotal}>${(orderItem.subtotal).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalAmount}>${(item.total_amount).toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <Text>Cargando pedidos...</Text>
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
        <SafeAreaView style={styles.container}>
            {orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <IconSymbol name="list.bullet.rectangle.fill" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No tienes pedidos recientes</Text>
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

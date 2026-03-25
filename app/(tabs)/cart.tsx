import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useOrderType } from '@/context/OrderTypeContext';
import { createOrder } from '@/lib/orders';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { CardPaymentModal } from '@/components/CardPaymentModal';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CartScreen() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];

    const { items, removeItem, updateQuantity, totalAmount, clearCart, totalItems } = useCart();
    const { orderType, setOrderType } = useOrderType();

    // Derived UI values for the interactive order type selector
    const getIconColor = (type: 'dine-in' | 'takeout') => {
        const isActive = orderType === type;
        if (isActive) return theme === 'dark' ? '#fff' : themeColors.tint;
        return theme === 'dark' ? '#888' : '#bbb';
    };

    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'tarjeta'>('efectivo');
    const [statusModal, setStatusModal] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const handleCheckout = () => {
        if (!orderType) {
            // Trigger the OrderTypeModal to show up
            setOrderType(null);
            return;
        }
        setShowConfirmModal(true);
    };

    const processPayment = async () => {
        setIsProcessing(true);
        try {
            await createOrder(items, totalAmount, orderType as 'dine-in' | 'takeout', paymentMethod);
            clearCart();
            setShowConfirmModal(false);
            setShowCardModal(false);
            setStatusModal({
                visible: true,
                type: 'success',
                message: '¡Tu orden ha sido realizada correctamente!'
            });
        } catch (error) {
            console.error(error);
            setShowConfirmModal(false);
            setStatusModal({
                visible: true,
                type: 'error',
                message: 'Hubo un problema al crear tu orden. Por favor intenta de nuevo.'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && !statusModal.visible) {
        return (
            <View style={[styles.emptyContainer, { backgroundColor: themeColors.background }]}>
                <IconSymbol name="cart" size={64} color={themeColors.icon} />
                <Text style={[styles.emptyText, { color: themeColors.text, opacity: 0.6 }]}>Tu carrito está vacío</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
                <Text style={[styles.headerTitle, { color: themeColors.text }]}>Mi Carrito</Text>
                <View style={[styles.badgeContainer, { backgroundColor: themeColors.tint }]}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
            </View>
            <FlatList
                data={items}
                keyExtractor={(item) => item.cartItemId}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={[styles.itemContainer, { backgroundColor: themeColors.card }]}>
                        <Image
                            source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={[styles.itemName, { color: themeColors.text }]}>{item.name}</Text>
                            {item.note ? (
                                <Text style={[styles.itemNote, { color: themeColors.text, opacity: 0.6 }]} numberOfLines={1}>
                                    Nota: {item.note}
                                </Text>
                            ) : null}
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                    style={styles.quantityButton}
                                >
                                    <IconSymbol name="minus.circle.fill" size={24} color={themeColors.tint} />
                                </TouchableOpacity>
                                <Text style={[styles.quantityText, { color: themeColors.text }]}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                    style={styles.quantityButton}
                                >
                                    <IconSymbol name="plus.circle.fill" size={24} color={themeColors.tint} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(item.cartItemId)} style={styles.removeButton}>
                            <IconSymbol name="trash.fill" size={20} color="#ff4444" />
                        </TouchableOpacity>
                    </View>
                )}
            />
            
            <View style={[styles.footer, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
                <View style={styles.totalContainer}>
                    <Text style={[styles.totalLabel, { color: themeColors.text }]}>Total:</Text>
                    <Text style={styles.totalAmount}>${totalAmount.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.checkoutButton, (isProcessing || items.length === 0) && styles.checkoutButtonDisabled]}
                    onPress={handleCheckout}
                    disabled={isProcessing || items.length === 0}
                >
                    <Text style={styles.checkoutButtonText}>
                        {isProcessing ? 'Procesando...' : 'Pagar'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Custom Confirm Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showConfirmModal}
                onRequestClose={() => !isProcessing && setShowConfirmModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalView, { backgroundColor: themeColors.card }]}>
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>Confirmar Pago</Text>
                        <Text style={[styles.modalText, { color: themeColors.text, opacity: 0.8 }]}>Total a pagar: <Text style={[styles.boldText, { color: themeColors.text }]}>${totalAmount.toFixed(2)}</Text></Text>
                        
                        <View style={styles.divider} />
                        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>¿Cómo deseas tu orden?</Text>
                        
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' },
                                    orderType === 'dine-in' && styles.optionButtonActive
                                ]}
                                onPress={() => setOrderType('dine-in')}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                                    <MaterialIcons 
                                        name="restaurant" 
                                        size={24} 
                                        color={getIconColor('dine-in')} 
                                    />
                                </View>
                                <Text style={[
                                    styles.optionText,
                                    { color: themeColors.text, opacity: 0.7 },
                                    orderType === 'dine-in' && styles.optionTextActive
                                ]}>Comer aquí</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' },
                                    orderType === 'takeout' && styles.optionButtonActive
                                ]}
                                onPress={() => setOrderType('takeout')}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                                    <MaterialIcons 
                                        name="delivery-dining" 
                                        size={24} 
                                        color={getIconColor('takeout')} 
                                    />
                                </View>
                                <Text style={[
                                    styles.optionText,
                                    { color: themeColors.text, opacity: 0.7 },
                                    orderType === 'takeout' && styles.optionTextActive
                                ]}>Para llevar</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.sectionTitle, { color: themeColors.text, marginTop: 15 }]}>¿Cómo deseas pagar?</Text>
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' },
                                    paymentMethod === 'efectivo' && styles.optionButtonActive
                                ]}
                                onPress={() => setPaymentMethod('efectivo')}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                                    <MaterialIcons 
                                        name="payments" 
                                        size={24} 
                                        color={paymentMethod === 'efectivo' ? themeColors.tint : '#888'} 
                                    />
                                </View>
                                <Text style={[
                                    styles.optionText,
                                    { color: themeColors.text, opacity: 0.7 },
                                    paymentMethod === 'efectivo' && styles.optionTextActive
                                ]}>Efectivo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionButton,
                                    { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' },
                                    paymentMethod === 'tarjeta' && styles.optionButtonActive
                                ]}
                                onPress={() => setPaymentMethod('tarjeta')}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                                    <MaterialIcons 
                                        name="credit-card" 
                                        size={24} 
                                        color={paymentMethod === 'tarjeta' ? themeColors.tint : '#888'} 
                                    />
                                </View>
                                <Text style={[
                                    styles.optionText,
                                    { color: themeColors.text, opacity: 0.7 },
                                    paymentMethod === 'tarjeta' && styles.optionTextActive
                                ]}>Tarjeta</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonCancel, { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5', borderColor: themeColors.border }]}
                                onPress={() => setShowConfirmModal(false)}
                                disabled={isProcessing}
                            >
                                <Text style={[styles.buttonCancelText, { color: themeColors.text, opacity: 0.7 }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonConfirm, isProcessing && styles.checkoutButtonDisabled]}
                                onPress={() => {
                                    if (paymentMethod === 'tarjeta') {
                                        setShowConfirmModal(false);
                                        setShowCardModal(true);
                                    } else {
                                        processPayment();
                                    }
                                }}
                                disabled={isProcessing}
                            >
                                <Text style={styles.buttonConfirmText}>{isProcessing ? 'Procesando...' : 'Pagar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Card Payment Modal */}
            <CardPaymentModal
                visible={showCardModal}
                onClose={() => setShowCardModal(false)}
                onConfirm={processPayment}
                amount={totalAmount}
            />

            {/* Success / Error Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={statusModal.visible}
                onRequestClose={() => setStatusModal({ ...statusModal, visible: false })}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalView, { backgroundColor: themeColors.card }]}>
                        <MaterialIcons
                            name={statusModal.type === 'success' ? 'check-circle' : 'error'}
                            size={60}
                            color={statusModal.type === 'success' ? '#4CAF50' : '#F44336'}
                            style={{ marginBottom: 15 }}
                        />
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>{statusModal.type === 'success' ? 'Éxito' : 'Error'}</Text>
                        <Text style={[styles.modalMessage, { color: themeColors.text, opacity: 0.7 }]}>{statusModal.message}</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.buttonConfirm, { width: '100%', marginTop: 20 }]}
                            onPress={() => setStatusModal({ ...statusModal, visible: false })}
                        >
                            <Text style={styles.buttonConfirmText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    badgeContainer: {
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        color: '#666',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        padding: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    itemNote: {
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D92323',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: 4,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    removeButton: {
        padding: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#D92323',
    },
    checkoutButton: {
        backgroundColor: '#D92323',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutButtonDisabled: {
        backgroundColor: '#ffaaaa',
        opacity: 0.7,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '85%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
        width: '100%',
    },
    boldText: {
        fontWeight: 'bold',
        color: '#000',
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        width: '100%',
        gap: 15,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonConfirm: {
        backgroundColor: '#D92323',
    },
    buttonCancelText: {
        color: '#555',
        fontWeight: '600',
        fontSize: 16,
    },
    buttonConfirmText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
        marginBottom: 10,
    },
    optionButton: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionButtonActive: {
        backgroundColor: '#D92323',
        borderColor: '#D92323',
    },
    iconContainer: {
        marginBottom: 6,
        padding: 6,
        borderRadius: 20,
    },
    optionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
        textAlign: 'center',
    },
    optionTextActive: {
        color: '#fff',
    },
});

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useOrderType } from '@/context/OrderTypeContext';
import { createOrder } from '@/lib/orders';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
    const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();
    const { orderType, setOrderType } = useOrderType();

    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
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
            await createOrder(items, totalAmount, orderType as 'dine-in' | 'takeout');
            clearCart();
            setShowConfirmModal(false);
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
            <View style={styles.emptyContainer}>
                <IconSymbol name="cart" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Tu carrito está vacío</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image
                            source={{ uri: item.image_url || 'https://via.placeholder.com/100' }}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                    style={styles.quantityButton}
                                >
                                    <IconSymbol name="minus.circle.fill" size={24} color={Colors.light.tint} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                    style={styles.quantityButton}
                                >
                                    <IconSymbol name="plus.circle.fill" size={24} color={Colors.light.tint} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeButton}>
                            <IconSymbol name="trash.fill" size={20} color="#ff4444" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
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
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Confirmar Pago</Text>
                        <Text style={styles.modalText}>Total a pagar: <Text style={styles.boldText}>${totalAmount.toFixed(2)}</Text></Text>
                        <Text style={styles.modalText}>Orden: <Text style={styles.boldText}>{orderType === 'dine-in' ? 'Comer aquí' : 'Para llevar'}</Text></Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonCancel]}
                                onPress={() => setShowConfirmModal(false)}
                                disabled={isProcessing}
                            >
                                <Text style={styles.buttonCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonConfirm, isProcessing && styles.checkoutButtonDisabled]}
                                onPress={processPayment}
                                disabled={isProcessing}
                            >
                                <Text style={styles.buttonConfirmText}>{isProcessing ? 'Procesando...' : 'Pagar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Success / Error Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={statusModal.visible}
                onRequestClose={() => setStatusModal({ ...statusModal, visible: false })}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <MaterialIcons
                            name={statusModal.type === 'success' ? 'check-circle' : 'error'}
                            size={60}
                            color={statusModal.type === 'success' ? '#4CAF50' : '#F44336'}
                            style={{ marginBottom: 15 }}
                        />
                        <Text style={styles.modalTitle}>{statusModal.type === 'success' ? 'Éxito' : 'Error'}</Text>
                        <Text style={styles.modalMessage}>{statusModal.message}</Text>
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
});

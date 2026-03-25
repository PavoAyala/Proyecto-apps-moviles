import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors } from '../../constants/theme';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
}

const { width } = Dimensions.get('window');

export default function ProductDetails() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];

    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState({ visible: false, message: '' });

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    async function fetchProduct() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setProduct(data);
        } catch (error) {
            if (error instanceof Error) {
                setShowErrorModal({ visible: true, message: error.message });
            }
        } finally {
            setLoading(false);
        }
    }

    const addToOrder = () => {
        if (!product) return;
        addItem(product, quantity, note);
        setShowSuccessModal(true);
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        router.back();
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: themeColors.background }]}>
                <ActivityIndicator size="large" color="#D92323" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={[styles.center, { backgroundColor: themeColors.background }]}>
                <Text style={{ color: themeColors.text }}>Producto no encontrado</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image_url || 'https://via.placeholder.com/400x300?text=No+Image' }}
                        style={styles.image}
                    />
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back-circle" size={40} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={[styles.name, { color: themeColors.text }]}>{product.name}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <Text style={[styles.description, { color: themeColors.text, opacity: 0.8 }]}>{product.description}</Text>

                    <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Preferencias</Text>
                    <Text style={[styles.note, { color: themeColors.text, opacity: 0.6 }]}>Nota para la cocina (opcional)</Text>
                    <TextInput
                        style={[
                            styles.noteInput, 
                            { 
                                backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f9f9f9', 
                                borderColor: themeColors.border,
                                color: themeColors.text,
                                textAlignVertical: 'top'
                            }
                        ]}
                        placeholder="Escribe aquí (ej. sin cebolla, muy picante...)"
                        placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                        value={note}
                        onChangeText={setNote}
                        multiline
                        numberOfLines={4}
                    />
                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: themeColors.card, borderTopColor: themeColors.border }]}>
                <View style={[styles.quantityContainer, { backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0' }]}>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Ionicons name="remove" size={24} color={themeColors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.quantityText, { color: themeColors.text }]}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Ionicons name="add" size={24} color={themeColors.text} />
                    </TouchableOpacity>
                </View>

                <Button
                    title={`Agregar $${(product.price * quantity).toFixed(2)}`}
                    onPress={addToOrder}
                    style={styles.addButton}
                />
            </View>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSuccessModal}
                onRequestClose={handleSuccessClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={{ marginBottom: 15 }} />
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>¡Agregado!</Text>
                        <Text style={[styles.modalMessage, { color: themeColors.text, opacity: 0.7 }]}>Agregaste {quantity} {product.name} a tu carrito.</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={handleSuccessClose}
                        >
                            <Text style={styles.modalButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Error Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showErrorModal.visible}
                onRequestClose={() => setShowErrorModal({ visible: false, message: '' })}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalView}>
                        <Ionicons name="close-circle" size={60} color="#F44336" style={{ marginBottom: 15 }} />
                        <Text style={[styles.modalTitle, { color: themeColors.text }]}>Error</Text>
                        <Text style={[styles.modalMessage, { color: themeColors.text, opacity: 0.7 }]}>{showErrorModal.message}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setShowErrorModal({ visible: false, message: '' })}
                        >
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 120,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: width,
        height: 300,
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    content: {
        padding: 20,
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    price: {
        fontSize: 20,
        color: '#D92323',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    description: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 20,
    },
    divider: {
        height: 1,
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    note: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    noteInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 15,
        height: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 15,
    },
    quantityBtn: {
        padding: 10,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
    },
    addButton: {
        flex: 1,
        marginVertical: 0,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        maxWidth: 340,
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
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButton: {
        backgroundColor: '#D92323',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

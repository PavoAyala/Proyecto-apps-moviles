
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/Button';
import { supabase } from '../../lib/supabase';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
}

const { width } = Dimensions.get('window');

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

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
                Alert.alert('Error', error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const addToOrder = () => {
        Alert.alert('Orden', `Agregaste ${quantity} ${product?.name} a tu orden.`);
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#D92323" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Producto no encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
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
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Preferencias</Text>
                    <Text style={styles.note}>Nota para la cocina (opcional)</Text>
                    <View style={styles.noteInput}>
                        <Text style={{ color: '#999' }}>Escribe aquí...</Text>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <Ionicons name="remove" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <Ionicons name="add" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                <Button
                    title={`Agregar $${(product.price * quantity).toFixed(2)}`}
                    onPress={addToOrder}
                    style={styles.addButton}
                />
            </View>
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
        color: '#333',
        marginBottom: 5,
    },
    price: {
        fontSize: 20,
        color: '#666',
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
        backgroundColor: '#eee',
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
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        height: 100,
        backgroundColor: '#f9f9f9',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
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
        backgroundColor: '#f0f0f0',
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
    }
});

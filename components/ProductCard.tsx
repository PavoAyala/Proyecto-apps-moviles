import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Product {
    id: number;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
}

interface ProductCardProps {
    product: Product;
}

const { width } = Dimensions.get('window');

export const ProductCard = ({ product }: ProductCardProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];
    
    const router = useRouter();
    const { addItem } = useCart();

    const handleAddToCart = () => {
        addItem(product);
        Alert.alert('Agregado', `${product.name} se agregó al carrito.`);
    };

    return (
        <View style={[styles.cardContainer, { backgroundColor: themeColors.card }]}>
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push(`/product/${product.id}`)}
                activeOpacity={0.9}
            >
                <Image
                    source={{ uri: product.image_url || 'https://via.placeholder.com/300x200?text=No+Image' }}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.name, { color: themeColors.text }]}>{product.name}</Text>
                        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </View>
                    {product.description && (
                        <Text style={[styles.description, { color: themeColors.text, opacity: 0.6 }]} numberOfLines={2}>
                            {product.description}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    card: {

    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    content: {
        padding: 15,
        paddingBottom: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D92323',
        marginLeft: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    addButton: {
        backgroundColor: '#D92323',
        padding: 10,
        margin: 15,
        marginTop: 5,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

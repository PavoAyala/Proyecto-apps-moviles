import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    const router = useRouter();

    return (
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
                    <Text style={styles.name}>{product.name}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                </View>
                {product.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {product.description}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
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
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    content: {
        padding: 15,
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
});

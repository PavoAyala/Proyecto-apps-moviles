
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '../../components/ProductCard';
import { supabase } from '../../lib/supabase';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

export default function MenuScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      console.log('Fetching products...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      console.log('Supabase Response:', { data, error });

      if (error) {
        throw error;
      }

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Menú</Text>
        <Text style={styles.subtitle}>Tacos El Güero</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D92323" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text>No hay productos disponibles.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D92323',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

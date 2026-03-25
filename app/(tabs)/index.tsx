import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../../components/ProductCard';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { ProfileModal } from '../../components/ProfileModal';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors } from '../../constants/theme';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

export default function MenuScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme ?? 'light';
  const themeColors = Colors[theme];

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileVisible, setProfileVisible] = useState(false);

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
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.header, { backgroundColor: themeColors.card, borderBottomColor: themeColors.border }]}>
        <View>
          <Text style={styles.title}>Menú</Text>
          <Text style={[styles.subtitle, { color: themeColors.text, opacity: 0.6 }]}>Tacos El Güero</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => setProfileVisible(true)}>
          <MaterialIcons name="account-circle" size={36} color="#D92323" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D92323" />
        </View>
      )}

      {!loading && products.length === 0 && (
        <View style={styles.center}>
          <Text style={{ color: themeColors.text }}>No hay productos disponibles.</Text>
        </View>
      )}

      {!loading && products.length > 0 && (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      )}

      <ProfileModal visible={profileVisible} onClose={() => setProfileVisible(false)} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  profileButton: {
    padding: 4,
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

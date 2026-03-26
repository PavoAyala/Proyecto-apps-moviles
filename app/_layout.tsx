import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

import { CartProvider } from '@/context/CartContext';
import { OrderTypeProvider } from '@/context/OrderTypeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Check for broken session on app start
    const checkSession = async () => {
      const { error } = await supabase.auth.getSession();
      if (error && (error.message.includes('Refresh Token Not Found') || error.message.includes('Invalid Refresh Token'))) {
        console.warn('Broken session detected, clearing storage...');
        await supabase.auth.signOut();
      }
    };
    checkSession();
  }, []);

  return (
    <CartProvider>
      <OrderTypeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </OrderTypeProvider>
    </CartProvider>
  );
}

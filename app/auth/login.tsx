
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { supabase } from '../../lib/supabase';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/(tabs)');
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <Text style={styles.title}>Bienvenido de nuevo</Text>
            <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

            <View style={styles.form}>
                <Input
                    label="Email"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <Input
                    label="Contraseña"
                    placeholder="******"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.spacer} />

                <Button
                    title="Iniciar Sesión"
                    onPress={signInWithEmail}
                    loading={loading}
                />

                <Button
                    title="Cancelar"
                    variant="outline"
                    onPress={() => router.back()}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    form: {
        width: '100%',
    },
    spacer: {
        height: 20,
    },
});

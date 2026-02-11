
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';

export default function Landing() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.overlay}>
                <View style={styles.header}>
                    <Text style={styles.title}>Tacos El Güero</Text>
                    <Text style={styles.subtitle}>Los mejores tacos de Monterrey</Text>
                </View>

                <View style={styles.footer}>
                    <Button
                        title="Iniciar Sesión"
                        onPress={() => router.push('/auth/login')}
                    />
                    <Button
                        title="Regístrate"
                        variant="secondary"
                        onPress={() => router.push('/auth/register')}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D92323', // Fallback color
    },
    overlay: {
        flex: 1,
        padding: 30,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    header: {
        marginTop: 100,
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.9,
    },
    footer: {
        marginBottom: 50,
        width: '100%',
    },
});

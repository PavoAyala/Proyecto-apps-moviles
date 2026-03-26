import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Alert, StyleSheet, Text, View, ImageBackground, Animated, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { supabase } from '../../lib/supabase';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { Colors } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Register() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    async function signUpWithEmail() {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Por favor llena todos los campos');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('¡Éxito!', 'Cuenta creada correctamente. Por favor verifica tu correo.');
            router.back();
        }
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ImageBackground
                source={require('../../assets/images/taco_landing.png')}
                style={styles.backgroundImage}
                blurRadius={10}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)', '#000']}
                    style={styles.gradient}
                >
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                            <Animated.View 
                                style={[
                                    styles.content,
                                    { 
                                        opacity: fadeAnim,
                                        transform: [{ translateY: slideAnim }]
                                    }
                                ]}
                            >
                                <TouchableOpacity 
                                    style={styles.backButton}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="arrow-back" size={28} color="#fff" />
                                </TouchableOpacity>

                                <View style={styles.header}>
                                    <Text style={styles.title}>Crear Cuenta</Text>
                                    <Text style={styles.subtitle}>Únete a la familia de Tacos El Güero</Text>
                                </View>

                                <View style={[styles.card, { backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)' }]}>
                                    <Input
                                        label="Nombre Completo"
                                        placeholder="Tu Nombre"
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                    <Input
                                        label="Correo Electrónico"
                                        placeholder="ejemplo@correo.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    <Input
                                        label="Contraseña"
                                        placeholder="••••••••"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                    />
                                    <Input
                                        label="Confirmar Contraseña"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry
                                    />

                                    <Button
                                        title="Registrarse"
                                        onPress={signUpWithEmail}
                                        loading={loading}
                                        style={styles.registerButton}
                                    />
                                </View>

                                <View style={styles.footer}>
                                    <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                                    <TouchableOpacity onPress={() => router.back()}>
                                        <Text style={[styles.linkText, { color: themeColors.tint }]}> Inicia sesión</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradient: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 0,
        zIndex: 10,
    },
    header: {
        marginBottom: 30,
        marginTop: 60,
    },
    title: {
        fontSize: 40,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    registerButton: {
        height: 55,
        borderRadius: 16,
        backgroundColor: '#D92323',
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    footerText: {
        color: '#fff',
        fontSize: 15,
        opacity: 0.8,
    },
    linkText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});

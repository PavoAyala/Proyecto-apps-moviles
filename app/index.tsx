import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, Animated, Dimensions } from 'react-native';
import { Button } from '../components/Button';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

export default function Landing() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ImageBackground
                source={require('../assets/images/taco_landing.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                >
                    <Animated.View 
                        style={[
                            styles.content, 
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.header}>
                            <View style={styles.logoBadge}>
                                <Text style={styles.badgeText}>EL REY DEL TACO</Text>
                            </View>
                            <Text style={styles.title}>Tacos El Güero</Text>
                            <View style={styles.divider} />
                            <Text style={styles.subtitle}>Los mejores tacos de Monterrey</Text>
                        </View>

                        <View style={styles.footer}>
                            <Button
                                title="Iniciar Sesión"
                                style={styles.loginButton}
                                onPress={() => router.push('/auth/login')}
                            />
                            <Button
                                title="Regístrate"
                                variant="outline"
                                style={styles.registerButton}
                                onPress={() => router.push('/auth/register')}
                            />
                            <Text style={styles.copyright}>© 2024 Tacos El Güero</Text>
                        </View>
                    </Animated.View>
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
        justifyContent: 'flex-end',
        padding: 30,
    },
    content: {
        width: '100%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoBadge: {
        backgroundColor: '#D92323',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: 15,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    divider: {
        width: 50,
        height: 4,
        backgroundColor: '#D92323',
        marginVertical: 15,
        borderRadius: 2,
    },
    subtitle: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.95,
        fontWeight: '500',
        fontStyle: 'italic',
    },
    footer: {
        marginBottom: 40,
        width: '100%',
    },
    loginButton: {
        height: 55,
        borderRadius: 28,
        backgroundColor: '#D92323',
        shadowColor: '#D92323',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    registerButton: {
        height: 55,
        borderRadius: 28,
        borderColor: '#fff',
        borderWidth: 1.5,
        marginTop: 15,
    },
    copyright: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 25,
        fontSize: 12,
        opacity: 0.5,
    },
});

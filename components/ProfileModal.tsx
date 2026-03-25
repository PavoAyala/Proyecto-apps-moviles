import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';
import { useOrderType } from '../context/OrderTypeContext';
import { getUserStats } from '../lib/orders';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../hooks/use-color-scheme';

interface ProfileModalProps {
    readonly visible: boolean;
    readonly onClose: () => void;
}

export function ProfileModal({ visible, onClose }: ProfileModalProps) {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];

    const router = useRouter();
    const { orderType, setOrderType } = useOrderType();
    const [stats, setStats] = useState<{ email?: string, name?: string, createdAt?: string, orderCount: number } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            onClose();
            router.replace('/auth/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchStats();
        }
    }, [visible]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const data = await getUserStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Desconocida';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: themeColors.card }]}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <MaterialIcons name="close" size={24} color={themeColors.icon} />
                    </TouchableOpacity>

                    <Text style={[styles.title, { color: themeColors.text }]}>Mi Perfil</Text>

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={themeColors.tint} />
                        </View>
                    )}

                    {!loading && stats && (
                        <View style={styles.statsContainer}>
                            <MaterialIcons name="account-circle" size={64} color={themeColors.icon} style={styles.avatar} />
                            <Text style={[styles.nameText, { color: themeColors.text }]}>{stats.name}</Text>
                            <Text style={[styles.emailText, { color: themeColors.text, opacity: 0.6 }]}>{stats.email}</Text>
                            
                             <View style={[styles.infoRow, { borderBottomColor: themeColors.border }]}>
                                <Text style={[styles.infoLabel, { color: themeColors.text, opacity: 0.7 }]}>Miembro desde:</Text>
                                <Text style={[styles.infoValue, { color: themeColors.text }]}>{formatDate(stats.createdAt)}</Text>
                            </View>
                            <View style={[styles.infoRow, { borderBottomColor: themeColors.border }]}>
                                <Text style={[styles.infoLabel, { color: themeColors.text, opacity: 0.7 }]}>Pedidos realizados:</Text>
                                <Text style={[styles.infoValue, { color: themeColors.text }]}>{stats.orderCount}</Text>
                            </View>
                        </View>
                    )}

                    {!loading && !stats && (
                        <Text style={styles.errorText}>No se pudo cargar la información del perfil.</Text>
                    )}

                    <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

                    <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Preferencia de Orden</Text>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' },
                                orderType === 'dine-in' && styles.optionButtonActive
                            ]}
                            onPress={() => setOrderType('dine-in')}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialIcons 
                                    name="restaurant" 
                                    size={32} 
                                    color={orderType === 'dine-in' ? '#fff' : themeColors.tint} 
                                />
                            </View>
                            <Text style={[
                                styles.optionText,
                                { color: themeColors.text, opacity: 0.7 },
                                orderType === 'dine-in' && styles.optionTextActive
                            ]}>Comer aquí</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.optionButton,
                                { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' },
                                orderType === 'takeout' && styles.optionButtonActive
                            ]}
                            onPress={() => setOrderType('takeout')}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialIcons 
                                    name="delivery-dining" 
                                    size={32} 
                                    color={orderType === 'takeout' ? '#fff' : themeColors.tint} 
                                />
                            </View>
                            <Text style={[
                                styles.optionText,
                                { color: themeColors.text, opacity: 0.7 },
                                orderType === 'takeout' && styles.optionTextActive
                            ]}>Para llevar</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

                    <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme === 'dark' ? '#2d1a1a' : '#fff1f1' }]} onPress={handleLogout}>
                        <MaterialIcons name="logout" size={24} color="#ff4444" />
                        <Text style={styles.logoutText}>Cerrar Sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalView: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 5,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    statsContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        marginBottom: 10,
    },
    nameText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    emailText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    infoLabel: {
        fontSize: 16,
        color: '#555',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    errorText: {
        color: '#ff4444',
        marginVertical: 20,
        textAlign: 'center',
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 15,
    },
    optionButton: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionButtonActive: {
        backgroundColor: Colors.light.tint,
        borderColor: Colors.light.tint,
    },
    iconContainer: {
        marginBottom: 8,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        textAlign: 'center',
    },
    optionTextActive: {
        color: '#fff',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#fff1f1',
    },
    logoutText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff4444',
    },
});

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from './Button';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

interface CardPaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    amount: number;
}

export const CardPaymentModal = ({ visible, onClose, onConfirm, amount }: CardPaymentModalProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];

    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCardNumberChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        if (formatted.length <= 19) setCardNumber(formatted);
    };

    const handleExpiryChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length >= 2) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        if (formatted.length <= 5) setExpiry(formatted);
    };

    const handleCvvChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 4) setCvv(cleaned);
    };

    const handlePay = async () => {
        if (!cardNumber || !cardHolder || !expiry || !cvv) return;
        setLoading(true);
        await onConfirm();
        setLoading(false);
        onClose();
        // Reset form
        setCardNumber('');
        setCardHolder('');
        setExpiry('');
        setCvv('');
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={28} color={themeColors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.headerTitle, { color: themeColors.text }]}>Pago con Tarjeta</Text>
                            <View style={{ width: 28 }} />
                        </View>

                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            {/* Virtual Card Visualization */}
                            <LinearGradient
                                colors={['#1a1a1a', '#333333']}
                                style={styles.cardPreview}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.cardHeader}>
                                    <Ionicons name="radio-outline" size={32} color="rgba(255,255,255,0.8)" />
                                    <View style={styles.chip} />
                                </View>
                                
                                <Text style={styles.cardNumberText}>
                                    {cardNumber || '**** **** **** ****'}
                                </Text>

                                <View style={styles.cardFooter}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.cardLabel}>TITULAR</Text>
                                        <Text style={styles.cardValue} numberOfLines={1}>{cardHolder.toUpperCase() || 'NOMBRE APELLIDO'}</Text>
                                    </View>
                                    <View style={{ marginLeft: 20 }}>
                                        <Text style={styles.cardLabel}>EXPIRA</Text>
                                        <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
                                    </View>
                                </View>
                            </LinearGradient>

                            {/* Form */}
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: themeColors.text }]}>Número de Tarjeta</Text>
                                    <TextInput
                                        style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                                        placeholder="0000 0000 0000 0000"
                                        placeholderTextColor="#999"
                                        keyboardType="numeric"
                                        value={cardNumber}
                                        onChangeText={handleCardNumberChange}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={[styles.label, { color: themeColors.text }]}>Nombre del Titular</Text>
                                    <TextInput
                                        style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                                        placeholder="Como aparece en la tarjeta"
                                        placeholderTextColor="#999"
                                        autoCapitalize="characters"
                                        value={cardHolder}
                                        onChangeText={setCardHolder}
                                    />
                                </View>

                                <View style={styles.row}>
                                    <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                        <Text style={[styles.label, { color: themeColors.text }]}>Expira</Text>
                                        <TextInput
                                            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                                            placeholder="MM/YY"
                                            placeholderTextColor="#999"
                                            keyboardType="numeric"
                                            value={expiry}
                                            onChangeText={handleExpiryChange}
                                        />
                                    </View>
                                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                                        <Text style={[styles.label, { color: themeColors.text }]}>CVV</Text>
                                        <TextInput
                                            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                                            placeholder="123"
                                            placeholderTextColor="#999"
                                            keyboardType="numeric"
                                            secureTextEntry
                                            value={cvv}
                                            onChangeText={handleCvvChange}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.amountContainer}>
                                <Text style={[styles.amountLabel, { color: themeColors.text, opacity: 0.6 }]}>Total a pagar</Text>
                                <Text style={[styles.amountValue, { color: themeColors.text }]}>${amount.toFixed(2)}</Text>
                            </View>

                            <Button 
                                title={loading ? "Procesando..." : "Pagar ahora"} 
                                onPress={handlePay}
                                disabled={!cardNumber || !cardHolder || !expiry || !cvv || loading}
                                loading={loading}
                            />
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
    },
    container: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    cardPreview: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    chip: {
        width: 45,
        height: 35,
        borderRadius: 6,
        backgroundColor: '#ccad00',
        opacity: 0.8,
    },
    cardNumberText: {
        fontSize: 22,
        color: '#fff',
        letterSpacing: 2,
        marginBottom: 30,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    form: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    row: {
        flexDirection: 'row',
    },
    amountContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    amountLabel: {
        fontSize: 14,
        marginBottom: 5,
    },
    amountValue: {
        fontSize: 28,
        fontWeight: 'bold',
    },
});

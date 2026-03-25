import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import { useOrderType } from '../context/OrderTypeContext';
import { useColorScheme } from '../hooks/use-color-scheme';

export function OrderTypeModal() {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];
    
    const { orderType, setOrderType } = useOrderType();

    // If an order type is already selected, don't show the modal
    const visible = orderType === null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                // Prevent closing by back button on Android if selection is mandatory
                // or allow it if you prefer. For now, we make it mandatory.
            }}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView, { backgroundColor: themeColors.card }]}>
                    <Text style={[styles.title, { color: themeColors.text }]}>¿Cómo deseas tu orden?</Text>

                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={[styles.optionButton, { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }]}
                            onPress={() => setOrderType('dine-in')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                                <MaterialIcons name="restaurant" size={48} color={themeColors.tint} />
                            </View>
                            <Text style={[styles.optionText, { color: themeColors.text }]}>Para comer aquí</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, { backgroundColor: theme === 'dark' ? '#333' : '#f5f5f5' }]}
                            onPress={() => setOrderType('takeout')}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#444' : '#fff' }]}>
                                <MaterialIcons name="delivery-dining" size={48} color={themeColors.tint} />
                            </View>
                            <Text style={[styles.optionText, { color: themeColors.text }]}>Para llevar</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        maxWidth: 400,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        gap: 20,
    },
    optionButton: {
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#f5f5f5',
        flex: 1,
        // Add shadow to buttons for "pop" effect
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    iconContainer: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 50,
    },
    optionText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});

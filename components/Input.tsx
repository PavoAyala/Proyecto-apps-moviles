
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Colors } from '../constants/theme';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
    const colorScheme = useColorScheme();
    const theme = colorScheme ?? 'light';
    const themeColors = Colors[theme];

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: themeColors.text }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input, 
                    { 
                        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
                        borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#ddd',
                        color: themeColors.text
                    },
                    error ? styles.inputError : null,
                    style
                ]}
                placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
                autoCapitalize="none"
                {...props}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});

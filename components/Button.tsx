import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    loading?: boolean;
}

export const Button = ({ title, variant = 'primary', loading, style, ...props }: ButtonProps) => {
    const getBackgroundColor = () => {
        if (variant === 'primary') return '#D92323'; // Red like the logo might be
        if (variant === 'secondary') return '#F5A623'; // Orange
        return 'transparent';
    };

    const getTextColor = () => {
        if (variant === 'outline') return '#D92323';
        return '#FFFFFF';
    };

    const getBorder = () => {
        if (variant === 'outline') return { borderWidth: 2, borderColor: '#D92323' };
        return {};
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                getBorder(),
                style,
                props.disabled && styles.disabled
            ]}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        width: '100%',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabled: {
        opacity: 0.6,
    },
});

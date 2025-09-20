import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      backgroundColor: colors.background,
    },
    iconContainer: {
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 12,
    },
    message: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
    },
    button: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    buttonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
  });

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Page Not Found',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }} />
      
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.textSecondary} />
        </View>
        
        <Text style={styles.title}>
          Page Not Found
        </Text>
        
        <Text style={styles.message}>
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </Text>
        
        <Link href="/" asChild>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Ionicons name="home" size={20} color={colors.background} />
            <Text style={styles.buttonText}>
              Go to Home
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
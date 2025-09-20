import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import StorageService from '../../services/storage';
import { showSuccess, showError, formatFileSize } from '../../utils/helpers';
import { APP_NAME, APP_VERSION } from '../../utils/constants';

export default function SettingsScreen() {
  const { colors, isDarkMode, isSystemMode, toggleTheme, setSystemMode } = useTheme();
  const [cacheInfo, setCacheInfo] = useState(null);
  const [savedArticlesCount, setSavedArticlesCount] = useState(0);

  useEffect(() => {
    loadCacheInfo();
    loadSavedArticlesCount();
  }, []);

  const loadCacheInfo = async () => {
    try {
      const info = await StorageService.getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error('Error loading cache info:', error);
    }
  };

  const loadSavedArticlesCount = async () => {
    try {
      const savedArticles = await StorageService.getSavedArticles();
      setSavedArticlesCount(savedArticles.length);
    } catch (error) {
      console.error('Error loading saved articles count:', error);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove all cached news articles. You can always refresh to download them again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearCache();
              await loadCacheInfo();
              showSuccess('Cache cleared successfully');
            } catch (error) {
              showError('Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const handleThemeToggle = (value) => {
    // Always toggle the theme, regardless of system mode
    // This will automatically disable system mode when user manually toggles
    toggleTheme();
  };

  const handleSystemModeToggle = (value) => {
    if (value) {
      setSystemMode();
    } else {
      // If turning off system mode, keep current theme
      // The theme context will handle this automatically
    }
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    rightComponent,
    showChevron = false 
  }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
      disabled={!onPress && !rightComponent}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showChevron && (
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      marginTop: 32,
      marginHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      marginLeft: 4,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 13,
      lineHeight: 18,
    },
    settingRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    footer: {
      padding: 32,
      alignItems: 'center',
    },
    appName: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    appVersion: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.card}>
            <SettingItem
              icon="moon"
              title="Dark Mode"
              subtitle={isSystemMode ? "Following system setting" : (isDarkMode ? "Dark theme enabled" : "Light theme enabled")}
              rightComponent={
                <Switch
                  value={isDarkMode}
                  onValueChange={handleThemeToggle}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.border}
                />
              }
            />
            <SettingItem
              icon="phone-portrait"
              title="Use System Setting"
              subtitle="Automatically switch based on device setting"
              rightComponent={
                <Switch
                  value={isSystemMode}
                  onValueChange={handleSystemModeToggle}
                  trackColor={{
                    false: colors.border,
                    true: colors.primary,
                  }}
                  thumbColor={colors.background}
                  ios_backgroundColor={colors.border}
                />
              }
            />
          </View>
        </View>

        {/* Storage Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.card}>
            <SettingItem
              icon="bookmark"
              title="Saved Articles"
              subtitle={`${savedArticlesCount} articles saved for offline reading`}
            />
            <SettingItem
              icon="server"
              title="Cache Size"
              subtitle={cacheInfo ? 
                `${formatFileSize(cacheInfo.totalSize)} across ${cacheInfo.totalCategories} categories` :
                "Calculating..."
              }
            />
            <SettingItem
              icon="trash"
              title="Clear Cache"
              subtitle="Remove all cached news articles"
              onPress={handleClearCache}
              showChevron
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <SettingItem
              icon="information-circle"
              title="Version"
              subtitle={APP_VERSION}
            />
            <SettingItem
              icon="newspaper"
              title="News Source"
              subtitle="Powered by NewsAPI.org"
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.appName}>{APP_NAME}</Text>
        <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
      </View>
    </View>
  );
}
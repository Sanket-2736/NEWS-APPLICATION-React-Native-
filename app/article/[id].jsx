import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import StorageService from '../../services/storage';
import { formatDate, extractDomain, cleanTitle, showSuccess, showError } from '../../utils/helpers';

const { width } = Dimensions.get('window');

export default function ArticleScreen() {
  const { colors } = useTheme();
  const { id, articleData } = useLocalSearchParams();
  const [article, setArticle] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (articleData) {
      try {
        const parsedArticle = JSON.parse(articleData);
        setArticle(parsedArticle);
        checkIfSaved(parsedArticle.url);
        
        // Add to reading history
        StorageService.addToReadingHistory(parsedArticle);
      } catch (error) {
        console.error('Error parsing article data:', error);
      }
    }
  }, [articleData]);

  const checkIfSaved = async (url) => {
    try {
      const saved = await StorageService.isArticleSaved(url);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSave = async () => {
    if (!article) return;

    try {
      if (isSaved) {
        const success = await StorageService.removeSavedArticle(article.url);
        if (success) {
          setIsSaved(false);
          showSuccess('Article removed from saved list');
        } else {
          showError('Failed to remove article');
        }
      } else {
        const success = await StorageService.saveArticle(article);
        if (success) {
          setIsSaved(true);
          showSuccess('Article saved for offline reading');
        } else {
          showError('Article is already saved');
        }
      }
    } catch (error) {
      showError('Failed to save article');
    }
  };

  const handleShare = async () => {
    if (!article) return;

    try {
      await Share.share({
        message: `${article.title}\n\n${article.url}`,
        title: article.title,
        url: article.url,
      });
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    imageContainer: {
      width: '100%',
      height: 250,
      backgroundColor: colors.surface,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imagePlaceholder: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.surface,
    },
    content: {
      padding: 20,
    },
    header: {
      marginBottom: 16,
    },
    sourceInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    sourceText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      marginRight: 12,
    },
    timeText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 32,
      marginBottom: 16,
    },
    authorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    authorText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    description: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 20,
    },
    contentText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 26,
      marginBottom: 20,
    },
    urlContainer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderRadius: 8,
      marginBottom: 20,
    },
    urlLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    urlText: {
      fontSize: 14,
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 20,
      paddingHorizontal: 20,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: 50
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.card,
    },
    actionButtonText: {
      fontSize: 14,
      fontWeight: '600',
      marginLeft: 8,
    },
    saveButton: {
      color: isSaved ? colors.primary : colors.text,
    },
    shareButton: {
      color: colors.text,
    },
  });

  if (!article) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Loading article...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: extractDomain(article.url),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { color: colors.text },
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Article Image */}
        <View style={styles.imageContainer}>
          {article.urlToImage ? (
            <Image 
              source={{ uri: article.urlToImage }} 
              style={styles.image}
              onError={(error) => console.log('Image load error:', error)}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image" size={60} color={colors.textSecondary} />
            </View>
          )}
        </View>

        {/* Article Content */}
        <View style={styles.content}>
          <View style={styles.header}>
            {/* Source and Time */}
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceText}>
                {article.source?.name || extractDomain(article.url)}
              </Text>
              <Text style={styles.timeText}>
                {formatDate(article.publishedAt)}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              {cleanTitle(article.title)}
            </Text>

            {/* Author */}
            {article.author && (
              <View style={styles.authorContainer}>
                <Text style={styles.authorText}>
                  By {article.author}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {article.description && (
            <Text style={styles.description}>
              {article.description}
            </Text>
          )}

          {/* Content */}
          {article.content && article.content !== article.description && (
            <Text style={styles.contentText}>
              {article.content.replace(/\[\+\d+ chars\]$/, '...')}
            </Text>
          )}

          {/* Source URL */}
          <View style={styles.urlContainer}>
            <Text style={styles.urlLabel}>Read full article at:</Text>
            <TouchableOpacity onPress={() => Linking.openURL(article.url)}>
                <Text style={styles.urlText} numberOfLines={5}>
                {article.url}
                </Text>
            </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleSave}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={isSaved ? colors.primary : colors.text}
          />
          <Text style={[styles.actionButtonText, styles.saveButton]}>
            {isSaved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleShare}
          activeOpacity={0.7}
        >
          <Ionicons name="share-outline" size={20} color={colors.text} />
          <Text style={[styles.actionButtonText, styles.shareButton]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
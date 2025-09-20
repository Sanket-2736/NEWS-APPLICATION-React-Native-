import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NewsList from '../../components/NewsList';
import { useTheme } from '../../contexts/ThemeContext';
import NewsAPI from '../../services/newsAPI';
import StorageService from '../../services/storage';
import { handleApiError } from '../../utils/helpers';
import { NEWS_CATEGORIES } from '../../utils/constants';

export default function HomeScreen() {
  const { colors } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load news when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadNews();
    }, [])
  );

  const loadNews = async (useCache = true) => {
    try {
      setError(null);
      
      if (useCache) {
        const cachedNews = await StorageService.getCachedNews(NEWS_CATEGORIES.GENERAL);
        if (cachedNews && cachedNews.length > 0) {
          setArticles(cachedNews);
          setLoading(false);
          fetchFreshNews();
          return;
        }
      }

      setLoading(true);
      await fetchFreshNews();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setLoading(false);
      
      if (useCache) {
        const cachedNews = await StorageService.getCachedNews(NEWS_CATEGORIES.GENERAL);
        if (cachedNews && cachedNews.length > 0) {
          setArticles(cachedNews);
          setError(null);
        }
      }
    }
  };

  const fetchFreshNews = async () => {
    try {
      const response = await NewsAPI.fetchNews(NEWS_CATEGORIES.GENERAL);
      
      if (response.articles && response.articles.length > 0) {
        setArticles(response.articles);
        
        await StorageService.cacheNews(NEWS_CATEGORIES.GENERAL, response.articles);
        
        setError(null);
      } else {
        setError('No articles found');
      }
    } catch (err) {
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadNews(false); 
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    footer: {
      textAlign: 'center',
      paddingVertical: 10,
      color: colors.textSecondary,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <NewsList
        articles={articles}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        emptyMessage="No news articles available at the moment. Pull down to refresh."
      />
      
      {/* Footer */}
      <Text style={styles.footer}>Made with ❤ by Sanket</Text>
    </View>
  );
}

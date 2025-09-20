import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NewsList from '../../components/NewsList';
import { useTheme } from '../../contexts/ThemeContext';
import NewsAPI from '../../services/newsAPI';
import StorageService from '../../services/storage';
import { handleApiError } from '../../utils/helpers';
import { NEWS_CATEGORIES } from '../../utils/constants';

export default function SportsScreen() {
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
        // Try to load from cache first
        const cachedNews = await StorageService.getCachedNews(NEWS_CATEGORIES.SPORTS);
        if (cachedNews && cachedNews.length > 0) {
          setArticles(cachedNews);
          setLoading(false);
          // Still fetch fresh data in the background
          fetchFreshNews();
          return;
        }
      }

      // If no cache or useCache is false, fetch fresh data
      setLoading(true);
      await fetchFreshNews();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      setLoading(false);
      
      // Try to show cached data even if fresh fetch fails
      if (useCache) {
        const cachedNews = await StorageService.getCachedNews(NEWS_CATEGORIES.SPORTS);
        if (cachedNews && cachedNews.length > 0) {
          setArticles(cachedNews);
          setError(null); // Clear error if we have cached data
        }
      }
    }
  };

  const fetchFreshNews = async () => {
    try {
      const response = await NewsAPI.fetchNews(NEWS_CATEGORIES.SPORTS);
      
      if (response.articles && response.articles.length > 0) {
        setArticles(response.articles);
        
        // Cache the articles
        await StorageService.cacheNews(NEWS_CATEGORIES.SPORTS, response.articles);
        
        setError(null);
      } else {
        setError('No sports articles found');
      }
    } catch (err) {
      throw err; // Re-throw to be handled by calling function
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadNews(false); // Force fresh data
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });

  return (
    <View style={styles.container}>
      <NewsList
        articles={articles}
        loading={loading}
        error={error}
        onRefresh={handleRefresh}
        emptyMessage="No sports news available at the moment. Pull down to refresh."
      />
    </View>
  );
}
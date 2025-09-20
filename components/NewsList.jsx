import { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import StorageService from '../services/storage';
import { showError, showSuccess } from '../utils/helpers';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';
import NewsCard from './NewsCard';

export default function NewsList({ 
  articles, 
  loading, 
  error, 
  onRefresh, 
  onLoadMore,
  hasMore = false,
  emptyMessage = "No articles found"
}) {
  const { colors } = useTheme();
  const [savedArticles, setSavedArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSavedArticles();
  }, []);

  const loadSavedArticles = async () => {
    try {
      const saved = await StorageService.getSavedArticles();
      setSavedArticles(saved.map(article => article.url));
    } catch (error) {
      console.error('Error loading saved articles:', error);
    }
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
        await loadSavedArticles(); // Refresh saved articles list
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleSaveArticle = async (article) => {
    try {
      const isCurrentlySaved = savedArticles.includes(article.url);
      
      if (isCurrentlySaved) {
        // Remove from saved
        const success = await StorageService.removeSavedArticle(article.url);
        if (success) {
          setSavedArticles(prev => prev.filter(url => url !== article.url));
          showSuccess('Article removed from saved list');
        } else {
          showError('Failed to remove article');
        }
      } else {
        // Add to saved
        const success = await StorageService.saveArticle(article);
        if (success) {
          setSavedArticles(prev => [...prev, article.url]);
          showSuccess('Article saved for offline reading');
        } else {
          showError('Article is already saved');
        }
      }
    } catch (error) {
      showError('Failed to save article');
    }
  };

  const renderArticle = ({ item, index }) => (
    <NewsCard
      article={item}
      onSave={handleSaveArticle}
      isSaved={savedArticles.includes(item.url)}
    />
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <LoadingSpinner size="small" showText={false} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    footerLoader: {
      padding: 20,
      alignItems: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingVertical: 64,
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  if (loading && (!articles || articles.length === 0)) {
    return <LoadingSpinner text="Loading news..." />;
  }

  if (error && (!articles || articles.length === 0)) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={onRefresh}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item, index) => item.id || `article-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 300, // Approximate height of each card
          offset: 300 * index,
          index,
        })}
      />
    </View>
  );
}
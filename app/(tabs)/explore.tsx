import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Keyboard 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import NewsList from '../../components/NewsList';
import { useTheme } from '../../contexts/ThemeContext';
import NewsAPI from '../../services/newsAPI';
import { handleApiError, debounce } from '../../utils/helpers';
import { ThemedText } from '../../components/themed-text';

export default function ExploreScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce the search function to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setArticles([]);
        setError(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      setHasSearched(true);
      try {
        const response = await NewsAPI.searchNews(query);
        if (response.articles && response.articles.length > 0) {
          setArticles(response.articles);
        } else {
          setArticles([]);
          setError(`No articles found for "${query}"`);
        }
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        setArticles([]);
      } finally {
        setLoading(false);
        Keyboard.dismiss();
      }
    }, 500),
    []
  );

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };
  
  // Clear search results when the screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchQuery('');
        setArticles([]);
        setError(null);
        setHasSearched(false);
      };
    }, [])
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    searchBar: {
      flex: 1,
      height: 40,
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      fontSize: 16,
      color: colors.text,
    },
    clearButton: {
      marginLeft: 10,
      padding: 5,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    emptyMessage: {
      textAlign: 'center',
    },
  });

  const renderEmptyState = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons 
          name="search-outline" 
          size={50} 
          color={colors.textSecondary} 
          style={{ marginBottom: 16 }}
        />
        <ThemedText style={styles.emptyTitle}>
          {hasSearched ? "No Results Found" : "Search for News"}
        </ThemedText>
        <ThemedText style={styles.emptyMessage}>
          {hasSearched 
            ? "Try a different keyword or check your spelling." 
            : "Enter a keyword to find articles from across the web."
          }
        </ThemedText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for articles..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={handleSearchChange}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
      <NewsList
        articles={articles}
        loading={loading}
        error={error}
        emptyMessage={hasSearched ? `No articles found for "${searchQuery}"` : "Enter a keyword to search for news."}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}
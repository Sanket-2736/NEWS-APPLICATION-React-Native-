import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Keys for different storage types
  static KEYS = {
    CACHED_NEWS: 'cached_news_',
    SAVED_ARTICLES: 'saved_articles',
    READING_HISTORY: 'reading_history',
    APP_SETTINGS: 'app_settings',
  };

  // Cache news articles by category
  async cacheNews(category, articles, expirationHours = 1) {
    try {
      const cacheData = {
        articles,
        timestamp: Date.now(),
        expirationTime: Date.now() + (expirationHours * 60 * 60 * 1000),
        category,
      };
      
      await AsyncStorage.setItem(
        `${StorageService.KEYS.CACHED_NEWS}${category}`,
        JSON.stringify(cacheData)
      );
      
      console.log(`Cached ${articles.length} articles for ${category}`);
    } catch (error) {
      console.error('Error caching news:', error);
    }
  }

  // Get cached news articles
  async getCachedNews(category) {
    try {
      const cached = await AsyncStorage.getItem(`${StorageService.KEYS.CACHED_NEWS}${category}`);
      
      if (!cached) {
        return null;
      }

      const cacheData = JSON.parse(cached);
      
      // Check if cache has expired
      if (Date.now() > cacheData.expirationTime) {
        await AsyncStorage.removeItem(`${StorageService.KEYS.CACHED_NEWS}${category}`);
        return null;
      }

      console.log(`Retrieved ${cacheData.articles.length} cached articles for ${category}`);
      return cacheData.articles;
    } catch (error) {
      console.error('Error retrieving cached news:', error);
      return null;
    }
  }

  // Save article for offline reading
  async saveArticle(article) {
    try {
      const savedArticles = await this.getSavedArticles();
      
      // Check if article is already saved
      const existingIndex = savedArticles.findIndex(saved => saved.url === article.url);
      
      if (existingIndex === -1) {
        const articleWithTimestamp = {
          ...article,
          savedAt: Date.now(),
        };
        
        savedArticles.push(articleWithTimestamp);
        
        await AsyncStorage.setItem(
          StorageService.KEYS.SAVED_ARTICLES,
          JSON.stringify(savedArticles)
        );
        
        console.log('Article saved successfully');
        return true;
      } else {
        console.log('Article already saved');
        return false;
      }
    } catch (error) {
      console.error('Error saving article:', error);
      return false;
    }
  }

  // Get all saved articles
  async getSavedArticles() {
    try {
      const saved = await AsyncStorage.getItem(StorageService.KEYS.SAVED_ARTICLES);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error retrieving saved articles:', error);
      return [];
    }
  }

  // Remove saved article
  async removeSavedArticle(articleUrl) {
    try {
      const savedArticles = await this.getSavedArticles();
      const filteredArticles = savedArticles.filter(article => article.url !== articleUrl);
      
      await AsyncStorage.setItem(
        StorageService.KEYS.SAVED_ARTICLES,
        JSON.stringify(filteredArticles)
      );
      
      console.log('Article removed from saved list');
      return true;
    } catch (error) {
      console.error('Error removing saved article:', error);
      return false;
    }
  }

  // Check if article is saved
  async isArticleSaved(articleUrl) {
    try {
      const savedArticles = await this.getSavedArticles();
      return savedArticles.some(article => article.url === articleUrl);
    } catch (error) {
      console.error('Error checking saved article:', error);
      return false;
    }
  }

  // Add to reading history
  async addToReadingHistory(article) {
    try {
      const history = await this.getReadingHistory();
      
      // Remove if already exists to avoid duplicates
      const filteredHistory = history.filter(item => item.url !== article.url);
      
      // Add to beginning of array
      const updatedHistory = [{
        ...article,
        readAt: Date.now(),
      }, ...filteredHistory];

      // Keep only last 50 articles
      const limitedHistory = updatedHistory.slice(0, 50);
      
      await AsyncStorage.setItem(
        StorageService.KEYS.READING_HISTORY,
        JSON.stringify(limitedHistory)
      );
      
      console.log('Added to reading history');
    } catch (error) {
      console.error('Error adding to reading history:', error);
    }
  }

  // Get reading history
  async getReadingHistory() {
    try {
      const history = await AsyncStorage.getItem(StorageService.KEYS.READING_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error retrieving reading history:', error);
      return [];
    }
  }

  // Clear all cache
  async clearCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(StorageService.KEYS.CACHED_NEWS));
      
      await AsyncStorage.multiRemove(cacheKeys);
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  // Get cache size info
  async getCacheInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(StorageService.KEYS.CACHED_NEWS));
      
      let totalSize = 0;
      const cacheInfo = {};
      
      for (const key of cacheKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const category = key.replace(StorageService.KEYS.CACHED_NEWS, '');
          const parsed = JSON.parse(data);
          cacheInfo[category] = {
            articles: parsed.articles.length,
            timestamp: parsed.timestamp,
            size: data.length,
          };
          totalSize += data.length;
        }
      }
      
      return {
        categories: cacheInfo,
        totalSize,
        totalCategories: cacheKeys.length,
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return null;
    }
  }

  // Save app settings
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(StorageService.KEYS.APP_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Get app settings
  async getSettings() {
    try {
      const settings = await AsyncStorage.getItem(StorageService.KEYS.APP_SETTINGS);
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error('Error retrieving settings:', error);
      return null;
    }
  }
}

export default new StorageService();
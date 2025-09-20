import { NEWS_API_KEY } from '../utils/constants';

const BASE_URL = 'https://newsapi.org/v2';

class NewsAPI {
  constructor() {
    this.apiKey = NEWS_API_KEY;
  }

  async fetchNews(category = 'general', country = 'us') {
    try {
      const endpoint = category === 'general' 
        ? `${BASE_URL}/top-headlines?country=${country}&apiKey=${this.apiKey}`
        : `${BASE_URL}/top-headlines?country=${country}&category=${category}&apiKey=${this.apiKey}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch news');
      }

      // Filter out articles with null/undefined values and add unique IDs
      const filteredArticles = data.articles
        .filter(article => 
          article.title && 
          article.title !== '[Removed]' &&
          article.description &&
          article.url
        )
        .map((article, index) => ({
          ...article,
          id: `${category}_${index}_${Date.now()}`, // Create unique ID
          category: category,
          publishedAt: new Date(article.publishedAt).toISOString(),
        }));

      return {
        ...data,
        articles: filteredArticles,
      };
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  async fetchNewsByCountry(country = 'us') {
    try {
      const endpoint = `${BASE_URL}/top-headlines?country=${country}&apiKey=${this.apiKey}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch country news');
      }

      // Filter out articles with null/undefined values and add unique IDs
      const filteredArticles = data.articles
        .filter(article => 
          article.title && 
          article.title !== '[Removed]' &&
          article.description &&
          article.url
        )
        .map((article, index) => ({
          ...article,
          id: `country_${country}_${index}_${Date.now()}`, // Create unique ID
          category: 'country-news',
          country: country,
          publishedAt: new Date(article.publishedAt).toISOString(),
        }));

      return {
        ...data,
        articles: filteredArticles,
      };
    } catch (error) {
      console.error('Error fetching country news:', error);
      throw error;
    }
  }

  async searchNews(query, sortBy = 'publishedAt') {
    try {
      const endpoint = `${BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&apiKey=${this.apiKey}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to search news');
      }

      // Filter and process search results
      const filteredArticles = data.articles
        .filter(article => 
          article.title && 
          article.title !== '[Removed]' &&
          article.description &&
          article.url
        )
        .map((article, index) => ({
          ...article,
          id: `search_${index}_${Date.now()}`,
          category: 'search',
          publishedAt: new Date(article.publishedAt).toISOString(),
        }));

      return {
        ...data,
        articles: filteredArticles,
      };
    } catch (error) {
      console.error('Error searching news:', error);
      throw error;
    }
  }

  // Helper method to get available categories
  getAvailableCategories() {
    return [
      'general',
      'business',
      'entertainment',
      'health',
      'science',
      'sports',
      'technology'
    ];
  }

  // Helper method to format article for display
  formatArticle(article) {
    return {
      ...article,
      publishedAt: this.formatDate(article.publishedAt),
      description: article.description?.length > 150 
        ? `${article.description.substring(0, 150)}...` 
        : article.description,
    };
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
}

export default new NewsAPI();
import { Alert } from 'react-native';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const cleanTitle = (title) => {
  if (!title) return '';
  // Remove common patterns like " - CNN", " | Reuters", etc.
  return title.replace(/\s*[-|]\s*[A-Z][a-zA-Z\s]*$/, '').trim();
};

export const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (error) {
    return 'Unknown Source';
  }
};

export const isValidImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const lowercaseUrl = url.toLowerCase();
  return imageExtensions.some(ext => lowercaseUrl.includes(ext)) || 
         url.includes('image') || 
         url.includes('photo') || 
         url.includes('img');
};

export const getPlaceholderImage = (width = 400, height = 200) => {
  return `https://cdn.pixabay.com/photo/2017/06/26/19/03/news-2444778_960_720.jpg`;
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (!error.message) {
    return ERROR_MESSAGES.GENERIC;
  }

  const message = error.message.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK;
  } else if (message.includes('rate limit') || message.includes('429')) {
    return ERROR_MESSAGES.API_LIMIT;
  } else if (message.includes('no articles') || message.includes('not found')) {
    return ERROR_MESSAGES.NO_ARTICLES;
  } else {
    return error.message || ERROR_MESSAGES.GENERIC;
  }
};

export const showAlert = (title, message, buttons = [{ text: 'OK' }]) => {
  Alert.alert(title, message, buttons);
};

export const showSuccess = (message) => {
  showAlert('Success', message);
};

export const showError = (error) => {
  const message = typeof error === 'string' ? error : handleApiError(error);
  showAlert('Error', message);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const shareArticle = async (article) => {
  console.log('Share article:', article.title);
};

export const openUrl = async (url) => {
  console.log('Open URL:', url);
};

export const filterArticles = (articles, searchTerm) => {
  if (!searchTerm) return articles;
  
  const term = searchTerm.toLowerCase();
  return articles.filter(article => 
    article.title?.toLowerCase().includes(term) ||
    article.description?.toLowerCase().includes(term) ||
    article.source?.name?.toLowerCase().includes(term)
  );
};

export const sortArticlesByDate = (articles, ascending = false) => {
  return [...articles].sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
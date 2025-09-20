// API Configuration
export const NEWS_API_KEY = process.env.NEWS_API_KEY || '0ac7904f37e24b32919ea7e94101926d';
export const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// App Configuration
export const APP_NAME = 'News Reader';
export const APP_VERSION = '1.0.0';

// News Categories
export const NEWS_CATEGORIES = {
  GENERAL: 'general',
  BUSINESS: 'business',
  ENTERTAINMENT: 'entertainment',
  HEALTH: 'health',
  SCIENCE: 'science',
  SPORTS: 'sports',
  TECHNOLOGY: 'technology',
};

export const CATEGORY_LABELS = {
  [NEWS_CATEGORIES.GENERAL]: 'General',
  [NEWS_CATEGORIES.BUSINESS]: 'Business',
  [NEWS_CATEGORIES.ENTERTAINMENT]: 'Entertainment',
  [NEWS_CATEGORIES.HEALTH]: 'Health',
  [NEWS_CATEGORIES.SCIENCE]: 'Science',
  [NEWS_CATEGORIES.SPORTS]: 'Sports',
  [NEWS_CATEGORIES.TECHNOLOGY]: 'Technology',
};

// Cache Settings
export const CACHE_DURATION = {
  NEWS: 60 * 60 * 1000, // 1 hour in milliseconds
  IMAGES: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

// Layout Constants
export const LAYOUT = {
  HEADER_HEIGHT: 60,
  TAB_BAR_HEIGHT: 60,
  CARD_MARGIN: 16,
  CARD_PADDING: 16,
  BORDER_RADIUS: 12,
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  MEDIUM: 300,
  SLOW: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Please check your internet connection and try again.',
  API_LIMIT: 'API rate limit exceeded. Please try again later.',
  NO_ARTICLES: 'No articles found for this category.',
  GENERIC: 'Something went wrong. Please try again.',
  CACHE_LOAD: 'Failed to load cached articles.',
  SAVE_FAILED: 'Failed to save article.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ARTICLE_SAVED: 'Article saved for offline reading!',
  ARTICLE_REMOVED: 'Article removed from saved list.',
  CACHE_CLEARED: 'Cache cleared successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
};

// Default Values
export const DEFAULTS = {
  COUNTRY: 'us',
  LANGUAGE: 'en',
  PAGE_SIZE: 20,
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
};

// Storage Keys (for reference)
export const STORAGE_KEYS = {
  CACHED_NEWS: 'cached_news_',
  SAVED_ARTICLES: 'saved_articles',
  READING_HISTORY: 'reading_history',
  APP_SETTINGS: 'app_settings',
  THEME_PREFERENCE: 'themePreference',
  IS_SYSTEM_MODE: 'isSystemMode',
};

// API Status Codes
export const API_STATUS = {
  OK: 'ok',
  ERROR: 'error',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// Countries for news (supported by NewsAPI)
export const COUNTRIES = {
  ae: { name: 'United Arab Emirates', flag: '🇦🇪' },
  ar: { name: 'Argentina', flag: '🇦🇷' },
  at: { name: 'Austria', flag: '🇦🇹' },
  au: { name: 'Australia', flag: '🇦🇺' },
  be: { name: 'Belgium', flag: '🇧🇪' },
  bg: { name: 'Bulgaria', flag: '🇧🇬' },
  br: { name: 'Brazil', flag: '🇧🇷' },
  ca: { name: 'Canada', flag: '🇨🇦' },
  ch: { name: 'Switzerland', flag: '🇨🇭' },
  cn: { name: 'China', flag: '🇨🇳' },
  co: { name: 'Colombia', flag: '🇨🇴' },
  cu: { name: 'Cuba', flag: '🇨🇺' },
  cz: { name: 'Czech Republic', flag: '🇨🇿' },
  de: { name: 'Germany', flag: '🇩🇪' },
  eg: { name: 'Egypt', flag: '🇪🇬' },
  fr: { name: 'France', flag: '🇫🇷' },
  gb: { name: 'United Kingdom', flag: '🇬🇧' },
  gr: { name: 'Greece', flag: '🇬🇷' },
  hk: { name: 'Hong Kong', flag: '🇭🇰' },
  hu: { name: 'Hungary', flag: '🇭🇺' },
  id: { name: 'Indonesia', flag: '🇮🇩' },
  ie: { name: 'Ireland', flag: '🇮🇪' },
  il: { name: 'Israel', flag: '🇮🇱' },
  in: { name: 'India', flag: '🇮🇳' },
  it: { name: 'Italy', flag: '🇮🇹' },
  jp: { name: 'Japan', flag: '🇯🇵' },
  kr: { name: 'South Korea', flag: '🇰🇷' },
  lt: { name: 'Lithuania', flag: '🇱🇹' },
  lv: { name: 'Latvia', flag: '🇱🇻' },
  ma: { name: 'Morocco', flag: '🇲🇦' },
  mx: { name: 'Mexico', flag: '🇲🇽' },
  my: { name: 'Malaysia', flag: '🇲🇾' },
  ng: { name: 'Nigeria', flag: '🇳🇬' },
  nl: { name: 'Netherlands', flag: '🇳🇱' },
  no: { name: 'Norway', flag: '🇳🇴' },
  nz: { name: 'New Zealand', flag: '🇳🇿' },
  ph: { name: 'Philippines', flag: '🇵🇭' },
  pl: { name: 'Poland', flag: '🇵🇱' },
  pt: { name: 'Portugal', flag: '🇵🇹' },
  ro: { name: 'Romania', flag: '🇷🇴' },
  rs: { name: 'Serbia', flag: '🇷🇸' },
  ru: { name: 'Russia', flag: '🇷🇺' },
  sa: { name: 'Saudi Arabia', flag: '🇸🇦' },
  se: { name: 'Sweden', flag: '🇸🇪' },
  sg: { name: 'Singapore', flag: '🇸🇬' },
  si: { name: 'Slovenia', flag: '🇸🇮' },
  sk: { name: 'Slovakia', flag: '🇸🇰' },
  th: { name: 'Thailand', flag: '🇹🇭' },
  tr: { name: 'Turkey', flag: '🇹🇷' },
  tw: { name: 'Taiwan', flag: '🇹🇼' },
  ua: { name: 'Ukraine', flag: '🇺🇦' },
  us: { name: 'United States', flag: '🇺🇸' },
  ve: { name: 'Venezuela', flag: '🇻🇪' },
  za: { name: 'South Africa', flag: '🇿🇦' },
};
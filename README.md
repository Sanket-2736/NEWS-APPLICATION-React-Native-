# News Reader App 📱

A modern React Native news reader app built with Expo Router, featuring offline support, dark mode, and a clean, intuitive interface.

## ✨ Features

- **📰 Multiple Categories**: Browse news from different categories (General, Business, Technology, Sports)
- **🌙 Dark Mode**: Toggle between light and dark themes or follow system settings
- **💾 Offline Support**: Save articles for offline reading with AsyncStorage
- **🔄 Pull to Refresh**: Refresh news with intuitive pull-to-refresh gesture
- **📱 Responsive Design**: Works perfectly on phones and tablets
- **⚡ Fast Performance**: Optimized with caching and efficient rendering
- **🎨 Beautiful UI**: Modern design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- A device with Expo Go app or an emulator

### Installation

1. **Clone and setup the project:**
```bash
npx create-expo-app NewsReaderApp --template tabs
cd NewsReaderApp
```

2. **Install dependencies:**
```bash
# Core dependencies
npx expo install expo-router expo-linking expo-constants expo-status-bar
npx expo install react-native-safe-area-context react-native-screens
npx expo install @react-native-async-storage/async-storage
npx expo install expo-system-ui
npx expo install react-native-gesture-handler
npm install @react-navigation/native
```

3. **Get your News API key:**
   - Visit [newsapi.org](https://newsapi.org/)
   - Sign up for a free account
   - Copy your API key

4. **Setup environment variables:**
```bash
cp .env.example .env
# Edit .env and add your API key
NEWS_API_KEY=your_actual_api_key_here
```

5. **Start the development server:**
```bash
npx expo start
```

6. **Run on your device:**
   - Install Expo Go on your phone
   - Scan the QR code shown in the terminal
   - Or press 'i' for iOS simulator, 'a' for Android emulator

## 📁 Project Structure

```
NewsReaderApp/
├── app/                     # App screens (Expo Router)
│   ├── (tabs)/             # Tab navigation screens
│   │   ├── index.js        # Home/General news
│   │   ├── business.js     # Business news
│   │   ├── technology.js   # Tech news
│   │   ├── sports.js       # Sports news
│   │   └── settings.js     # Settings & preferences
│   ├── article/[id].js     # Article detail screen
│   ├── _layout.js          # Root layout
│   └── +not-found.js       # 404 page
├── components/             # Reusable components
│   ├── NewsCard.js         # Article card component
│   ├── NewsList.js         # News list with refresh
│   ├── LoadingSpinner.js   # Loading indicator
│   └── ErrorMessage.js     # Error display
├── contexts/               # React contexts
│   └── ThemeContext.js     # Dark mode context
├── services/               # API and storage services
│   ├── newsAPI.js          # News API integration
│   └── storage.js          # AsyncStorage wrapper
└── utils/                  # Utilities and helpers
    ├── constants.js        # App constants
    └── helpers.js          # Helper functions
```

## 🔧 Configuration

### API Configuration
The app uses [NewsAPI.org](https://newsapi.org/) for fetching news articles. Make sure to:
- Get your free API key
- Add it to your `.env` file
- Never commit your API key to version control

### Available Categories
- General (default)
- Business
- Technology
- Sports
- Health
- Entertainment
- Science

## 📱 Screenshots

*Add screenshots of your app here*

## 🛠️ Development

### Available Scripts
```bash
# Start development server
npx expo start

# Start with specific platform
npx expo start --ios
npx expo start --android
npx expo start --web

# Clear cache and start
npx expo start --clear

# Build for production
npx expo build
```

### Key Technologies
- **React Native**: Mobile app framework
- **Expo Router**: File-based navigation
- **AsyncStorage**: Local data persistence
- **React Navigation**: Navigation library
- **Expo Vector Icons**: Icon library
- **NewsAPI**: News data source

## 🎨 Customization

### Adding New Categories
1. Add your category to `utils/constants.js`:
```javascript
export const NEWS_CATEGORIES = {
  // ... existing categories
  HEALTH: 'health',
};
```

2. Create a new screen file in `app/(tabs)/health.js`
3. Add the tab to `app/(tabs)/_layout.js`

### Styling
- Colors and themes are defined in `contexts/ThemeContext.js`
- Component styles use the theme context for consistent theming
- Modify theme colors to match your brand

### API Integration
- Add new API endpoints in `services/newsAPI.js`
- Extend caching logic in `services/storage.js`

## 🚧 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**Navigation not working:**
```bash
npx expo install --fix
```

**API requests failing:**
- Check your API key in `.env`
- Verify you haven't exceeded the rate limit
- Ensure you have internet connectivity

**AsyncStorage issues:**
```bash
npx expo install @react-native-async-storage/async-storage
```

### Performance Tips
- Images are cached automatically
- Articles are cached for 1 hour by default
- Pull-to-refresh forces fresh data fetch
- Saved articles persist until manually removed

## 📈 Future Enhancements

- [ ] Search functionality
- [ ] Push notifications for breaking news
- [ ] Social sharing integration
- [ ] Reading progress tracking
- [ ] Multiple language support
- [ ] Bookmarking with categories
- [ ] Image caching optimization
- [ ] Pagination for infinite scroll

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing free news data
- [Expo](https://expo.dev/) for the amazing development platform
- [React Native](https://reactnative.dev/) community for excellent documentation

## 📞 Support

If you encounter any issues or have questions:
- Check the troubleshooting section above
- Review the [Expo documentation](https://docs.expo.dev/)
- Visit [NewsAPI documentation](https://newsapi.org/docs)

---

**Happy coding! 🎉**
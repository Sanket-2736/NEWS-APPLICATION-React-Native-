import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { cleanTitle, extractDomain, formatDate, truncateText } from '../utils/helpers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; // Account for padding

export default function NewsCard({ article, onSave, isSaved }) {
  const { colors } = useTheme();

  const handlePress = () => {
    router.push({
      pathname: '/article/[id]',
      params: { 
        id: article.id,
        articleData: JSON.stringify(article)
      }
    });
  };

  const handleSavePress = () => {
    if (onSave) {
      onSave(article);
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
    },
    imageContainer: {
      width: '100%',
      height: 200,
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
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    sourceInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 8,
    },
    sourceText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
      marginRight: 8,
    },
    timeText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    saveButton: {
      padding: 4,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 24,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 12,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    categoryBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    categoryText: {
      fontSize: 10,
      color: colors.background,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    readMoreText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {article.urlToImage ? (
          <Image 
            source={{ uri: article.urlToImage }} 
            style={styles.image}
            onError={(error) => console.log('Image load error:', error)}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={40} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        {/* Header with source and save button */}
        <View style={styles.header}>
          <View style={styles.sourceInfo}>
            <Text style={styles.sourceText}>
              {article.source?.name || extractDomain(article.url)}
            </Text>
            <Text style={styles.timeText}>
              {formatDate(article.publishedAt)}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSavePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={isSaved ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isSaved ? colors.primary : colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={3}>
          {cleanTitle(article.title)}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {truncateText(article.description, 120)}
        </Text>

        {/* Footer with category and read more */}
        <View style={styles.footer}>
          {article.category && article.category !== 'general' && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {article.category}
              </Text>
            </View>
          )}
          <Text style={styles.readMoreText}>
            Read more →
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
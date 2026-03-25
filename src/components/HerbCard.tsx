import React, {memo} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import herbImages from '../data/herbImages';
import {Colors} from '../theme/colors';
import {Herb} from '../types/herb';

const TEMP_COLORS: Record<string, string> = {
  Hot: Colors.temperatureHot,
  Warm: Colors.temperatureWarm,
  Neutral: Colors.temperatureNeutral,
  Cool: Colors.temperatureCool,
  Cold: Colors.temperatureCold,
};

interface HerbCardProps {
  herb: Herb;
  onPress?: () => void;
}

function HerbCardComponent({herb, onPress}: HerbCardProps) {
  const tempColor = TEMP_COLORS[herb.temperature] || Colors.textSecondary;

  const localImage = herbImages[herb.slug];

  const content = (
    <>
      {localImage ? (
        <Image
          source={localImage}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={herb.image?.alt}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>—</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {herb.name}
        </Text>
        <Text style={styles.chineseName} numberOfLines={1}>
          {herb.chineseName}
        </Text>
        <Text style={styles.englishName} numberOfLines={1}>
          {herb.englishName}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.tempBadge, {backgroundColor: tempColor}]}>
            <Text style={styles.tempText}>{herb.temperature}</Text>
          </View>
        </View>
        <Text style={styles.category} numberOfLines={2}>
          {herb.category}
        </Text>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable style={styles.card} onPress={onPress} android_ripple={{color: Colors.chipBackground}}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

export const HerbCard = memo(HerbCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.cardBorder,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  content: {
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chineseName: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 2,
  },
  englishName: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  tempBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tempText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.white,
  },
  category: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 14,
  },
});

import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import herbImages from '../data/herbImages';
import {Colors} from '../theme/colors';
import {Herb} from '../types/herb';

const HERB_DETAIL_URL = 'https://www.meandqi.com/knowledge-base/herbs';

function getHerbDetailUrl(slug: string): string {
  return `${HERB_DETAIL_URL}/${slug}/`;
}

const TEMP_COLORS: Record<string, string> = {
  Hot: Colors.temperatureHot,
  Warm: Colors.temperatureWarm,
  Neutral: Colors.temperatureNeutral,
  Cool: Colors.temperatureCool,
  Cold: Colors.temperatureCold,
};

interface HerbDetailSheetProps {
  herb: Herb | null;
  onClose: () => void;
}

export function HerbDetailSheet({herb, onClose}: HerbDetailSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%', '100%'], []);

  useEffect(() => {
    if (herb) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [herb]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const tempColor = herb
    ? TEMP_COLORS[herb.temperature] || Colors.textSecondary
    : Colors.textSecondary;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleComponent={null}>
      <BottomSheetScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {herb && (
          <>
            <View style={styles.imageWrapper}>
              {herbImages[herb.slug] ? (
                <Image
                  source={herbImages[herb.slug]}
                  style={styles.image}
                  resizeMode="cover"
                  accessibilityLabel={herb.image?.alt}
                />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <Text style={styles.imagePlaceholderText}>—</Text>
                </View>
              )}
              <View style={styles.handleOverlay}>
                <View style={styles.handle} />
              </View>
            </View>

            <View style={styles.body}>
              <Text style={styles.name}>{herb.name}</Text>
              <Text style={styles.chineseName}>{herb.chineseName}</Text>
              <Text style={styles.englishName}>{herb.englishName}</Text>

              <View style={[styles.tempBadge, {backgroundColor: tempColor}]}>
                <Text style={styles.tempText}>
                  Temperature: {herb.temperature}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Category</Text>
                <Text style={styles.sectionValue}>{herb.category}</Text>
              </View>

              {herb.tastes.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tastes (五味)</Text>
                  <View style={styles.tagRow}>
                    {herb.tastes.map(t => (
                      <View key={t} style={styles.tag}>
                        <Text style={styles.tagText}>{t}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {herb.organs.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Organs / Meridians</Text>
                  <View style={styles.tagRow}>
                    {herb.organs.map(o => (
                      <View key={o} style={styles.tag}>
                        <Text style={styles.tagText}>{o}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.externalLinkBtn}
                onPress={() => Linking.openURL(getHerbDetailUrl(herb.slug))}
                activeOpacity={0.8}>
                <Text style={styles.externalLinkText}>
                  View more on Me & Qi →
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.8}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: Colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  imageWrapper: {
    position: 'relative',
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleOverlay: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  scrollContent: {
    paddingBottom: 40,
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
    fontSize: 32,
    color: Colors.textSecondary,
  },
  body: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  chineseName: {
    fontSize: 18,
    color: Colors.primary,
    marginTop: 4,
  },
  englishName: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  tempBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 12,
  },
  tempText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sectionValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.chipBackground,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.chipText,
  },
  externalLinkBtn: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 12,
  },
  externalLinkText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  closeBtn: {
    marginTop: 16,
    paddingVertical: 14,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

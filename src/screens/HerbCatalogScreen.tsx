import React, {useCallback, useRef, useState} from 'react';
import {FlatList, LayoutChangeEvent, StyleSheet, View} from 'react-native';
import {FilterHeader} from '../components/FilterHeader';
import {HerbCard} from '../components/HerbCard';
import {HerbDetailSheet} from '../components/HerbDetailSheet';
import {useFilteredHerbs} from '../hooks/useFilteredHerbs';
import {Colors} from '../theme/colors';
import {Herb} from '../types/herb';

export function HerbCatalogScreen() {
  const {
    herbs,
    allHerbs,
    filters,
    filterOptions,
    hasActiveFilters,
    toggleTemperature,
    toggleTaste,
    toggleOrgan,
    setSearch,
    resetFilters,
  } = useFilteredHerbs();

  const [headerHeight, setHeaderHeight] = useState(0);
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);
  const listRef = useRef<FlatList>(null);

  const onHeaderLayout = useCallback((e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height);
  }, []);

  const renderItem = useCallback(({item}: {item: Herb}) => {
    return <HerbCard herb={item} onPress={() => setSelectedHerb(item)} />;
  }, []);

  const keyExtractor = useCallback((item: Herb) => item.slug, []);

  return (
    <View style={styles.screen}>
      <FlatList
        ref={listRef}
        data={herbs}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        contentContainerStyle={[
          styles.listContent,
          {paddingTop: headerHeight + 8},
        ]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews
      />

      <View style={styles.headerWrapper} onLayout={onHeaderLayout}>
        <FilterHeader
          filters={filters}
          filterOptions={filterOptions}
          hasActiveFilters={hasActiveFilters}
          herbCount={herbs.length}
          totalCount={allHerbs.length}
          onToggleTemperature={toggleTemperature}
          onToggleTaste={toggleTaste}
          onToggleOrgan={toggleOrgan}
          onSetSearch={setSearch}
          onReset={resetFilters}
        />
      </View>

      <View style={styles.sheetOverlay} pointerEvents="box-none">
        <HerbDetailSheet
          herb={selectedHerb}
          onClose={() => setSelectedHerb(null)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  listContent: {
    paddingHorizontal: 6,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
  },
});

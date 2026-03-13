import React, {memo, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FunnelIcon} from './FunnelIcon';
import {Colors} from '../theme/colors';
import {FilterOptions, FilterState} from '../types/herb';

interface FilterHeaderProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  hasActiveFilters: boolean;
  herbCount: number;
  totalCount: number;
  onToggleTemperature: (temp: string) => void;
  onToggleTaste: (taste: string) => void;
  onToggleOrgan: (organ: string) => void;
  onSetSearch: (search: string) => void;
  onReset: () => void;
}

const TEMP_COLORS: Record<string, string> = {
  Hot: Colors.temperatureHot,
  Warm: Colors.temperatureWarm,
  Neutral: Colors.temperatureNeutral,
  Cool: Colors.temperatureCool,
  Cold: Colors.temperatureCold,
};

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  activeColor?: string;
}

function Chip({label, active, onPress, activeColor}: ChipProps) {
  const bgColor = active
    ? activeColor || Colors.chipActiveBackground
    : Colors.chipBackground;
  const txtColor = active ? Colors.chipActiveText : Colors.chipText;

  return (
    <TouchableOpacity
      style={[styles.chip, {backgroundColor: bgColor}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text style={[styles.chipLabel, {color: txtColor}]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface FilterDropdownProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  filterOptions: FilterOptions;
  onToggleTemperature: (temp: string) => void;
  onToggleTaste: (taste: string) => void;
  onToggleOrgan: (organ: string) => void;
  onReset: () => void;
}

function FilterDropdown({
  visible,
  onClose,
  filters,
  filterOptions,
  onToggleTemperature,
  onToggleTaste,
  onToggleOrgan,
  onReset,
}: FilterDropdownProps) {
  return (
    <>
      <Modal visible={visible} animationType="fade" transparent>
        <Pressable style={styles.dropdownOverlay} onPress={onClose}>
          <View style={styles.dropdown} onStartShouldSetResponder={() => true}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Filters</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.dropdownClose}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dropdownBody}>
              {/* Temperature */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Temperature</Text>
                <View style={styles.chipRow}>
                  {filterOptions.temperatures.map(temp => (
                    <Chip
                      key={temp}
                      label={temp}
                      active={filters.temperature === temp}
                      activeColor={TEMP_COLORS[temp]}
                      onPress={() => onToggleTemperature(temp)}
                    />
                  ))}
                </View>
              </View>

              {/* Taste */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Taste</Text>
                <View style={styles.chipRow}>
                  {filterOptions.tastes.map(taste => (
                    <Chip
                      key={taste}
                      label={taste}
                      active={filters.tastes.includes(taste)}
                      onPress={() => onToggleTaste(taste)}
                    />
                  ))}
                </View>
              </View>

              {/* Organ */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Organ / Meridian</Text>
                <View style={styles.chipRow}>
                  {filterOptions.organs.map(organ => (
                    <Chip
                      key={organ}
                      label={organ}
                      active={filters.organs.includes(organ)}
                      onPress={() => onToggleOrgan(organ)}
                    />
                  ))}
                </View>
              </View>

              {(filters.temperature ||
                filters.tastes.length > 0 ||
                filters.organs.length > 0) && (
                <TouchableOpacity
                  style={styles.clearAllBtn}
                  onPress={() => {
                    onReset();
                    onClose();
                  }}>
                  <Text style={styles.clearAllText}>Clear all filters</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function FilterHeaderComponent({
  filters,
  filterOptions,
  hasActiveFilters,
  herbCount,
  totalCount,
  onToggleTemperature,
  onToggleTaste,
  onToggleOrgan,
  onSetSearch,
  onReset,
}: FilterHeaderProps) {
  const insets = useSafeAreaInsets();
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  return (
    <>
      <View
        style={[
          styles.container,
          {paddingTop: insets.top + 8, backgroundColor: Colors.background},
        ]}>
        <View style={styles.inner}>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search herbs..."
              placeholderTextColor={Colors.textSecondary}
              value={filters.search}
              onChangeText={onSetSearch}
            />
            <TouchableOpacity
              style={[
                styles.filterIconBtn,
                hasActiveFilters && styles.filterIconBtnActive,
              ]}
              onPress={() => setFilterDropdownVisible(true)}
              activeOpacity={0.7}>
              <FunnelIcon
                size={20}
                color={hasActiveFilters ? Colors.secondary : Colors.chipText}
              />
              {hasActiveFilters && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>
                    {[
                      filters.temperature ? 1 : 0,
                      filters.tastes.length,
                      filters.organs.length,
                    ].reduce((a, b) => a + b, 0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.resultCount}>
            {herbCount === totalCount
              ? `${totalCount} herbs`
              : `${herbCount} of ${totalCount} herbs`}
          </Text>
        </View>
      </View>

      <FilterDropdown
        visible={filterDropdownVisible}
        onClose={() => setFilterDropdownVisible(false)}
        filters={filters}
        filterOptions={filterOptions}
        onToggleTemperature={onToggleTemperature}
        onToggleTaste={onToggleTaste}
        onToggleOrgan={onToggleOrgan}
        onReset={onReset}
      />
    </>
  );
}

export const FilterHeader = memo(FilterHeaderComponent);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  inner: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: 40,
    backgroundColor: Colors.cardBackground,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  filterIconBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: Colors.chipBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconBtnActive: {
    borderColor: Colors.secondary,
    backgroundColor: 'rgba(45, 90, 74, 0.15)',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  resultCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },

  // Filter dropdown
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dropdown: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.cardBorder,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dropdownClose: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  dropdownBody: {
    padding: 16,
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  clearAllBtn: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(139,37,0,0.1)',
    borderRadius: 10,
  },
  clearAllText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

import {useMemo, useState} from 'react';
import herbsJson from '../data/herbs.json';
import {
  FilterOptions,
  FilterState,
  Herb,
  HerbsData,
  INITIAL_FILTER_STATE,
} from '../types/herb';

const data = herbsJson as HerbsData;

function extractFilterOptions(herbs: Herb[]): FilterOptions {
  const temperaturesSet = new Set<string>();
  const tastesSet = new Set<string>();
  const organsSet = new Set<string>();

  for (const herb of herbs) {
    if (herb.temperature) {
      temperaturesSet.add(herb.temperature);
    }
    for (const t of herb.tastes) {
      tastesSet.add(t);
    }
    for (const o of herb.organs) {
      organsSet.add(o);
    }
  }

  const tempOrder = ['Hot', 'Warm', 'Neutral', 'Cool', 'Cold'];
  const temperatures = tempOrder.filter(t => temperaturesSet.has(t));

  return {
    temperatures,
    tastes: Array.from(tastesSet).sort(),
    organs: Array.from(organsSet).sort(),
  };
}

function applyFilters(herbs: Herb[], filters: FilterState): Herb[] {
  return herbs.filter(herb => {
    if (filters.temperature && herb.temperature !== filters.temperature) {
      return false;
    }

    if (
      filters.tastes.length > 0 &&
      !filters.tastes.some(t => herb.tastes.includes(t))
    ) {
      return false;
    }

    if (
      filters.organs.length > 0 &&
      !filters.organs.some(o => herb.organs.includes(o))
    ) {
      return false;
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      return (
        herb.name.toLowerCase().includes(q) ||
        herb.englishName.toLowerCase().includes(q) ||
        herb.chineseName.toLowerCase().includes(q)
      );
    }

    return true;
  });
}

export function useFilteredHerbs() {
  const allHerbs = data.herbs;
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  const filterOptions = useMemo(
    () => extractFilterOptions(allHerbs),
    [allHerbs],
  );

  const filteredHerbs = useMemo(
    () => applyFilters(allHerbs, filters),
    [allHerbs, filters],
  );

  const resetFilters = () => setFilters(INITIAL_FILTER_STATE);

  const toggleTemperature = (temp: string) => {
    setFilters(prev => ({
      ...prev,
      temperature: prev.temperature === temp ? null : temp,
    }));
  };

  const toggleTaste = (taste: string) => {
    setFilters(prev => ({
      ...prev,
      tastes: prev.tastes.includes(taste)
        ? prev.tastes.filter(t => t !== taste)
        : [...prev.tastes, taste],
    }));
  };

  const toggleOrgan = (organ: string) => {
    setFilters(prev => ({
      ...prev,
      organs: prev.organs.includes(organ)
        ? prev.organs.filter(o => o !== organ)
        : [...prev.organs, organ],
    }));
  };

  const setSearch = (search: string) => {
    setFilters(prev => ({...prev, search}));
  };

  const hasActiveFilters =
    filters.temperature !== null ||
    filters.tastes.length > 0 ||
    filters.organs.length > 0 ||
    filters.search.length > 0;

  return {
    herbs: filteredHerbs,
    allHerbs,
    filters,
    filterOptions,
    hasActiveFilters,
    toggleTemperature,
    toggleTaste,
    toggleOrgan,
    setSearch,
    resetFilters,
  };
}

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchCatalog } from '@/data/api';
import * as fallback from '@/data/mock';
import { Agency, Amusement, Category } from '@/data/types';
import { supabaseEnabled } from '@/lib/supabase';
import { colors, spacing } from '@/theme';

interface DataState {
  categories: Category[];
  agencies: Agency[];
  amusements: Amusement[];
  /** 'supabase' when live data loaded, 'mock' when local fallback is in use */
  source: 'supabase' | 'mock';
  getAmusement: (id: string) => Amusement | undefined;
  getAgency: (id: string) => Agency | undefined;
  getCategory: (id: string) => Category | undefined;
}

const DataContext = createContext<DataState | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(supabaseEnabled);
  const [source, setSource] = useState<'supabase' | 'mock'>('mock');
  const [categories, setCategories] = useState<Category[]>(fallback.categories);
  const [agencies, setAgencies] = useState<Agency[]>(fallback.agencies);
  const [amusements, setAmusements] = useState<Amusement[]>(fallback.amusements);

  useEffect(() => {
    if (!supabaseEnabled) {
      console.warn('Supabase env not set — using local mock data.');
      return;
    }
    let cancelled = false;
    fetchCatalog()
      .then((data) => {
        if (cancelled) return;
        setCategories(data.categories);
        setAgencies(data.agencies);
        setAmusements(data.amusements);
        setSource('supabase');
      })
      .catch((e) => {
        console.warn('Catalog fetch failed, using local mock data:', e?.message ?? e);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<DataState>(
    () => ({
      categories,
      agencies,
      amusements,
      source,
      getAmusement: (id) => amusements.find((a) => a.id === id),
      getAgency: (id) => agencies.find((a) => a.id === id),
      getCategory: (id) => categories.find((c) => c.id === id),
    }),
    [categories, agencies, amusements, source]
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>در حال دریافت اطلاعات...</Text>
      </View>
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataState {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  loadingText: { color: colors.textMuted, fontSize: 14 },
});

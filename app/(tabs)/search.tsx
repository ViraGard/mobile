import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AmusementCard from '@/components/AmusementCard';
import { Chip, Input } from '@/components/ui';
import { useData } from '@/context/DataContext';
import { t } from '@/i18n/fa';
import { colors, spacing } from '@/theme';

export default function Search() {
  const { amusements, categories, getAgency } = useData();
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    if (params.category) setCategory(params.category);
  }, [params.category]);

  const results = useMemo(() => {
    const q = query.trim();
    return amusements.filter((a) => {
      if (category && a.categoryId !== category) return false;
      if (!q) return true;
      const agency = getAgency(a.agencyId);
      const haystack = `${a.title} ${a.city} ${a.location} ${agency?.name ?? ''}`;
      return haystack.includes(q);
    });
  }, [query, category, amusements, getAgency]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.searchWrap}>
        <Input
          value={query}
          onChangeText={setQuery}
          placeholder={t.searchPlaceholder}
          returnKeyType="search"
        />
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          <Chip label={t.all} active={category === null} onPress={() => setCategory(null)} />
          {categories.map((c) => (
            <Chip
              key={c.id}
              label={c.title}
              active={category === c.id}
              onPress={() => setCategory(category === c.id ? null : c.id)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AmusementCard item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>{t.noResults}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  searchWrap: { padding: spacing.lg, paddingBottom: spacing.sm },
  chips: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row-reverse',
  },
  list: { padding: spacing.lg, paddingTop: spacing.sm },
  empty: { alignItems: 'center', paddingTop: spacing.xxl * 2, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 15 },
});

import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AmusementCard from '@/components/AmusementCard';
import { amusements, categories } from '@/data/mock';
import { t } from '@/i18n/fa';
import { colors, radius, spacing } from '@/theme';

export default function Home() {
  const featured = amusements.filter((a) => a.featured);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t.greeting}</Text>
            <Text style={styles.appName}>{t.appName}</Text>
          </View>
          <View style={styles.logoCircle}>
            <Ionicons name="compass" size={26} color="#fff" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t.chooseCategory}</Text>
        <View style={styles.categoryGrid}>
          {categories.map((c) => (
            <Pressable
              key={c.id}
              style={styles.categoryItem}
              onPress={() =>
                router.push({ pathname: '/(tabs)/search', params: { category: c.id } })
              }
            >
              <View style={[styles.categoryIcon, { backgroundColor: `${c.color}18` }]}>
                <Ionicons name={c.icon as never} size={26} color={c.color} />
              </View>
              <Text style={styles.categoryTitle} numberOfLines={1}>
                {c.title}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t.featured}</Text>
          <Pressable onPress={() => router.push('/(tabs)/search')}>
            <Text style={styles.seeAll}>{t.seeAll}</Text>
          </Pressable>
        </View>
        <FlatList
          data={featured}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <AmusementCard item={item} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: { fontSize: 14, color: colors.textMuted, textAlign: 'right' },
  appName: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  sectionRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  seeAll: { color: colors.primary, fontSize: 13, fontWeight: '600', marginBottom: spacing.md },
  categoryGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryTitle: { fontSize: 11, color: colors.text, textAlign: 'center' },
});

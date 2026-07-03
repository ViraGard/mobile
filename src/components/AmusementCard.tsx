import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Amusement, getAgency, getCategory } from '@/data/mock';
import { t } from '@/i18n/fa';
import { colors, faNum, faPrice, radius, spacing } from '@/theme';

export default function AmusementCard({ item }: { item: Amusement }) {
  const agency = getAgency(item.agencyId);
  const category = getCategory(item.categoryId);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
      onPress={() => router.push({ pathname: '/amusement/[id]', params: { id: item.id } })}
    >
      <Image source={{ uri: item.photos[0] }} style={styles.image} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{category?.title}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.rating}>
            <Text style={styles.ratingText}>{faNum(item.rating)}</Text>
            <Ionicons name="star" size={13} color={colors.accent} />
          </View>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location" size={14} color={colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.city} · {agency?.name}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{faPrice(item.priceAdult)}</Text>
          <Text style={styles.priceLabel}>{t.perAdult}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  image: { width: '100%', height: 160, backgroundColor: colors.primaryLight },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: 'rgba(14,124,102,0.92)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  body: { padding: spacing.lg },
  titleRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  title: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'right' },
  rating: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  metaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  metaText: { flex: 1, fontSize: 13, color: colors.textMuted, textAlign: 'right' },
  priceRow: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    gap: 6,
    marginTop: spacing.sm,
  },
  price: { fontSize: 16, fontWeight: '800', color: colors.primary },
  priceLabel: { fontSize: 12, color: colors.textMuted },
});

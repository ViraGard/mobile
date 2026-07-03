import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@/components/ui';
import { getAgency, getAmusement } from '@/data/mock';
import { t } from '@/i18n/fa';
import { colors, faNum, faPrice, radius, spacing } from '@/theme';

const { width } = Dimensions.get('window');

export default function AmusementDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getAmusement(id!);
  const agency = item ? getAgency(item.agencyId) : undefined;

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>{t.noResults}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {item.photos.map((p, i) => (
            <Image key={i} source={{ uri: p }} style={styles.photo} />
          ))}
        </ScrollView>

        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.agencyRow}>
            <Ionicons name="business" size={15} color={colors.textMuted} />
            <Text style={styles.agencyName}>{agency?.name}</Text>
            {agency?.verified ? (
              <View style={styles.verified}>
                <Ionicons name="checkmark-circle" size={13} color={colors.success} />
                <Text style={styles.verifiedText}>{t.verifiedAgency}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.metaRow}>
            <Ionicons name="location" size={15} color={colors.textMuted} />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {faNum(item.minAge)}–{faNum(item.maxAge)} {t.years}
              </Text>
              <Text style={styles.statLabel}>{t.ageLimit}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {faNum(item.capacity)} {t.people}
              </Text>
              <Text style={styles.statLabel}>{t.capacity}</Text>
            </View>
            <View style={styles.stat}>
              <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: 3 }}>
                <Text style={styles.statValue}>{faNum(item.rating)}</Text>
                <Ionicons name="star" size={14} color={colors.accent} />
              </View>
              <Text style={styles.statLabel}>امتیاز</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t.description}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <Text style={styles.sectionTitle}>{t.schedule}</Text>
          {item.slots.map((s) => (
            <Card key={s.id} style={styles.slotCard}>
              <Text style={styles.slotDate}>{s.date}</Text>
              <Text style={styles.slotTime}>
                {t.start} {s.start} · {t.end} {s.end}
                {s.departure ? ` · ${t.departure} ${s.departure}` : ''}
              </Text>
              <Text style={styles.slotRemaining}>
                {faNum(s.remaining)} {t.people} باقی‌مانده
              </Text>
            </Card>
          ))}

          <Text style={styles.sectionTitle}>{t.rules}</Text>
          {item.rules.map((r, i) => (
            <View key={i} style={styles.ruleRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.ruleText}>{r}</Text>
            </View>
          ))}
          <View style={styles.ruleRow}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
            <Text style={[styles.ruleText, { color: colors.danger }]}>{t.platformRules}</Text>
          </View>
          {item.healthRestricted ? (
            <View style={styles.ruleRow}>
              <Ionicons name="fitness-outline" size={16} color={colors.warning} />
              <Text style={[styles.ruleText, { color: colors.warning }]}>
                {t.restrictions}: {t.healthConfirm}
              </Text>
            </View>
          ) : null}

          {item.options.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>{t.options}</Text>
              {item.options.map((op) => (
                <View key={op.id} style={styles.optionRow}>
                  <Text style={styles.optionTitle}>{op.title}</Text>
                  <Text style={styles.optionPrice}>{faPrice(op.price)}</Text>
                </View>
              ))}
            </>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>{faPrice(item.priceAdult)}</Text>
          <Text style={styles.footerPriceLabel}>
            {t.priceAdult}
            {item.priceChild > 0 ? ` · ${t.priceChild} ${faPrice(item.priceChild)}` : ''}
          </Text>
        </View>
        <Button
          title={t.reserve}
          onPress={() => router.push({ pathname: '/booking/[id]', params: { id: item.id } })}
          style={{ paddingHorizontal: spacing.xxl }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { paddingBottom: 120 },
  photo: { width, height: 240, backgroundColor: colors.primaryLight },
  body: { padding: spacing.lg },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'right' },
  agencyRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  agencyName: { fontSize: 14, color: colors.textMuted },
  verified: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3 },
  verifiedText: { fontSize: 12, color: colors.success, fontWeight: '600' },
  metaRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  metaText: { fontSize: 13, color: colors.textMuted, textAlign: 'right', flex: 1 },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  stat: { alignItems: 'center', gap: 2 },
  statValue: { fontSize: 14, fontWeight: '700', color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  description: { fontSize: 14, lineHeight: 24, color: colors.text, textAlign: 'right' },
  slotCard: { marginBottom: spacing.sm, padding: spacing.md },
  slotDate: { fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'right' },
  slotTime: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginTop: 2 },
  slotRemaining: { fontSize: 12, color: colors.primary, textAlign: 'right', marginTop: 2 },
  ruleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: spacing.sm,
  },
  ruleText: { flex: 1, fontSize: 13, color: colors.text, textAlign: 'right', lineHeight: 20 },
  optionRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionTitle: { fontSize: 14, color: colors.text },
  optionPrice: { fontSize: 14, fontWeight: '600', color: colors.primary },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footerPrice: { fontSize: 17, fontWeight: '800', color: colors.primary, textAlign: 'right' },
  footerPriceLabel: { fontSize: 11, color: colors.textMuted, textAlign: 'right', marginTop: 2 },
});

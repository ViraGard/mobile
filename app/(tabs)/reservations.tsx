import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import { Reservation, ReservationStatus, useApp } from '@/context/AppContext';
import { useData } from '@/context/DataContext';
import { t } from '@/i18n/fa';
import { colors, faNum, faPrice, radius, spacing } from '@/theme';

const statusMeta: Record<ReservationStatus, { label: string; color: string }> = {
  confirmed: { label: t.statusConfirmed, color: colors.success },
  pending: { label: t.statusPending, color: colors.warning },
  done: { label: t.statusDone, color: colors.textMuted },
  canceled: { label: t.statusCanceled, color: colors.danger },
};

function ReservationCard({ item }: { item: Reservation }) {
  const { getAmusement } = useData();
  const amusement = getAmusement(item.amusementId);
  const slot = amusement?.slots.find((s) => s.id === item.slotId);
  const status = statusMeta[item.status];

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title} numberOfLines={1}>
          {amusement?.title ?? '—'}
        </Text>
        <View style={[styles.status, { backgroundColor: `${status.color}18` }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
        <Text style={styles.metaText}>
          {slot ? `${slot.date} · ${slot.start}` : item.createdAt}
        </Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="people-outline" size={14} color={colors.textMuted} />
        <Text style={styles.metaText}>
          {faNum(item.adults)} {t.adults}
          {item.children > 0 ? ` · ${faNum(item.children)} ${t.children}` : ''}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.code}>
          {t.reservationCode}: {item.code}
        </Text>
        <Text style={styles.total}>{faPrice(item.total)}</Text>
      </View>
    </Card>
  );
}

export default function Reservations() {
  const { reservations } = useApp();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.header}>{t.myReservations}</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReservationCard item={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>{t.emptyReservations}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'right',
    padding: spacing.lg,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { marginBottom: spacing.md },
  topRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  title: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text, textAlign: 'right' },
  status: {
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  metaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  metaText: { fontSize: 13, color: colors.textMuted, textAlign: 'right' },
  bottomRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  code: { fontSize: 13, color: colors.textMuted },
  total: { fontSize: 15, fontWeight: '800', color: colors.primary },
  empty: { alignItems: 'center', paddingTop: spacing.xxl * 2, gap: spacing.md },
  emptyText: { color: colors.textMuted, fontSize: 15 },
});

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card } from '@/components/ui';
import { Reservation, useApp } from '@/context/AppContext';
import { getAmusement } from '@/data/mock';
import { t } from '@/i18n/fa';
import { colors, faPrice, spacing } from '@/theme';

export default function Payment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getAmusement(id!);
  const { draft, confirmDraft } = useApp();
  const [paying, setPaying] = useState(false);
  const [result, setResult] = useState<Reservation | null>(null);

  const pay = () => {
    setPaying(true);
    // Simulate gateway delay
    setTimeout(() => {
      const res = confirmDraft();
      setResult(res);
      setPaying(false);
    }, 1500);
  };

  if (result) {
    return (
      <View style={styles.successWrap}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={56} color="#fff" />
        </View>
        <Text style={styles.successTitle}>{t.paymentSuccess}</Text>
        <Text style={styles.successCode}>
          {t.reservationCode}: {result.code}
        </Text>
        <Text style={styles.smsNote}>{t.smsNote}</Text>
        <Button
          title={t.viewReservations}
          onPress={() => {
            router.dismissAll();
            router.replace('/(tabs)/reservations');
          }}
          style={{ alignSelf: 'stretch', marginTop: spacing.xxl }}
        />
        <Button
          title={t.backToHome}
          variant="ghost"
          onPress={() => {
            router.dismissAll();
            router.replace('/(tabs)');
          }}
          style={{ alignSelf: 'stretch', marginTop: spacing.sm }}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Card style={styles.gateway}>
        <Ionicons name="card" size={40} color={colors.primary} />
        <Text style={styles.gatewayTitle}>{t.paymentGateway}</Text>
        <Text style={styles.itemTitle}>{item?.title}</Text>
        <Text style={styles.amount}>{draft ? faPrice(draft.total) : '—'}</Text>
      </Card>
      <Button
        title={t.payNow}
        onPress={pay}
        loading={paying}
        disabled={!draft}
        style={{ marginTop: spacing.xl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, flexGrow: 1, justifyContent: 'center' },
  gateway: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  gatewayTitle: { fontSize: 14, color: colors.textMuted },
  itemTitle: { fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center' },
  amount: { fontSize: 24, fontWeight: '800', color: colors.primary, marginTop: spacing.sm },
  successWrap: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  successCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  successTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  successCode: { fontSize: 15, color: colors.primary, fontWeight: '700', marginTop: spacing.sm },
  smsNote: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 22,
  },
});

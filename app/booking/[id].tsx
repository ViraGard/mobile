import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, Input } from '@/components/ui';
import { Participant, useApp } from '@/context/AppContext';
import { getAmusement, TAX_RATE } from '@/data/mock';
import { t } from '@/i18n/fa';
import { colors, faNum, faPrice, radius, spacing } from '@/theme';

const emptyParticipant = (isChild: boolean): Participant => ({
  firstName: '',
  lastName: '',
  age: '',
  nationalId: '',
  isChild,
  healthOk: false,
});

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable style={styles.stepBtn} onPress={() => onChange(value + 1)}>
          <Ionicons name="add" size={20} color={colors.primary} />
        </Pressable>
        <Text style={styles.stepValue}>{faNum(value)}</Text>
        <Pressable
          style={[styles.stepBtn, value <= min && { opacity: 0.4 }]}
          onPress={() => value > min && onChange(value - 1)}
        >
          <Ionicons name="remove" size={20} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

export default function Booking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getAmusement(id!);
  const { setDraft } = useApp();

  const [slotId, setSlotId] = useState(item?.slots[0]?.id ?? '');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [optionIds, setOptionIds] = useState<string[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([emptyParticipant(false)]);

  const syncParticipants = (a: number, c: number) => {
    setParticipants((prev) => {
      const next: Participant[] = [];
      for (let i = 0; i < a; i++) next.push(prev.filter((p) => !p.isChild)[i] ?? emptyParticipant(false));
      for (let i = 0; i < c; i++) next.push(prev.filter((p) => p.isChild)[i] ?? emptyParticipant(true));
      return next;
    });
  };

  const totals = useMemo(() => {
    if (!item) return { subtotal: 0, optionsTotal: 0, tax: 0, total: 0 };
    const people = adults + children;
    const subtotal = adults * item.priceAdult + children * item.priceChild;
    const optionsTotal = item.options
      .filter((o) => optionIds.includes(o.id))
      .reduce((sum, o) => sum + o.price * people, 0);
    const tax = Math.round((subtotal + optionsTotal) * TAX_RATE);
    return { subtotal, optionsTotal, tax, total: subtotal + optionsTotal + tax };
  }, [item, adults, children, optionIds]);

  if (!item) return null;

  const updateParticipant = (index: number, patch: Partial<Participant>) => {
    setParticipants((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const submit = () => {
    for (const p of participants) {
      if (!p.firstName.trim() || !p.lastName.trim() || !p.age.trim() || !p.nationalId.trim()) {
        Alert.alert(t.fillAllFields);
        return;
      }
      if (p.nationalId.replace(/\D/g, '').length !== 10) {
        Alert.alert(t.invalidNationalId);
        return;
      }
      const age = parseInt(p.age, 10);
      if (isNaN(age) || age < item.minAge || age > item.maxAge) {
        Alert.alert(t.ageOutOfRange, `${t.ageLimit}: ${faNum(item.minAge)}–${faNum(item.maxAge)} ${t.years}`);
        return;
      }
      if (!p.healthOk) {
        Alert.alert(t.healthRequired);
        return;
      }
    }
    setDraft({
      amusementId: item.id,
      slotId,
      adults,
      children,
      optionIds,
      participants,
      ...totals,
    });
    router.push({ pathname: '/payment/[id]', params: { id: item.id } });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.amusementTitle}>{item.title}</Text>

        {/* Slot selection */}
        <Text style={styles.sectionTitle}>{t.selectTime}</Text>
        {item.slots.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSlotId(s.id)}
            style={[styles.slot, slotId === s.id && styles.slotActive]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.slotDate}>{s.date}</Text>
              <Text style={styles.slotTime}>
                {s.start} تا {s.end}
              </Text>
            </View>
            <Ionicons
              name={slotId === s.id ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={slotId === s.id ? colors.primary : colors.textMuted}
            />
          </Pressable>
        ))}

        {/* Counts */}
        <Card style={{ marginTop: spacing.lg }}>
          <Stepper
            label={`${t.adults} (${faPrice(item.priceAdult)})`}
            value={adults}
            min={1}
            onChange={(v) => {
              setAdults(v);
              syncParticipants(v, children);
            }}
          />
          {item.priceChild > 0 ? (
            <Stepper
              label={`${t.children} (${faPrice(item.priceChild)})`}
              value={children}
              min={0}
              onChange={(v) => {
                setChildren(v);
                syncParticipants(adults, v);
              }}
            />
          ) : null}
        </Card>

        {/* Options */}
        {item.options.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{t.options}</Text>
            <Card style={{ padding: 0 }}>
              {item.options.map((op, i) => {
                const active = optionIds.includes(op.id);
                return (
                  <Pressable
                    key={op.id}
                    onPress={() =>
                      setOptionIds((prev) =>
                        active ? prev.filter((x) => x !== op.id) : [...prev, op.id]
                      )
                    }
                    style={[styles.optionRow, i > 0 && styles.optionBorder]}
                  >
                    <View style={styles.optionRight}>
                      <Ionicons
                        name={active ? 'checkbox' : 'square-outline'}
                        size={22}
                        color={active ? colors.primary : colors.textMuted}
                      />
                      <Text style={styles.optionTitle}>{op.title}</Text>
                    </View>
                    <Text style={styles.optionPrice}>{faPrice(op.price)}</Text>
                  </Pressable>
                );
              })}
            </Card>
          </>
        ) : null}

        {/* Participants */}
        <Text style={styles.sectionTitle}>{t.participants}</Text>
        {participants.map((p, i) => (
          <Card key={i} style={{ marginBottom: spacing.md }}>
            <Text style={styles.participantHeader}>
              {t.participant} {faNum(i + 1)} {p.isChild ? `(${t.children})` : ''}
            </Text>
            <View style={styles.formRow}>
              <Input
                value={p.firstName}
                onChangeText={(v) => updateParticipant(i, { firstName: v })}
                placeholder={t.firstName}
                style={styles.halfInput}
              />
              <Input
                value={p.lastName}
                onChangeText={(v) => updateParticipant(i, { lastName: v })}
                placeholder={t.lastName}
                style={styles.halfInput}
              />
            </View>
            <View style={styles.formRow}>
              <Input
                value={p.age}
                onChangeText={(v) => updateParticipant(i, { age: v })}
                placeholder={t.age}
                keyboardType="number-pad"
                maxLength={3}
                style={styles.halfInput}
              />
              <Input
                value={p.nationalId}
                onChangeText={(v) => updateParticipant(i, { nationalId: v })}
                placeholder={t.nationalId}
                keyboardType="number-pad"
                maxLength={10}
                style={styles.halfInput}
              />
            </View>
            <Pressable
              onPress={() => updateParticipant(i, { healthOk: !p.healthOk })}
              style={styles.healthRow}
            >
              <Ionicons
                name={p.healthOk ? 'checkbox' : 'square-outline'}
                size={20}
                color={p.healthOk ? colors.primary : colors.textMuted}
              />
              <Text style={styles.healthText}>{t.healthConfirm}</Text>
            </Pressable>
          </Card>
        ))}

        {/* Price summary */}
        <Text style={styles.sectionTitle}>{t.priceSummary}</Text>
        <Card>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {faNum(adults)} × {t.adults}
              {children > 0 ? ` + ${faNum(children)} × ${t.children}` : ''}
            </Text>
            <Text style={styles.priceValue}>{faPrice(totals.subtotal)}</Text>
          </View>
          {totals.optionsTotal > 0 ? (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>{t.optionsSum}</Text>
              <Text style={styles.priceValue}>{faPrice(totals.optionsTotal)}</Text>
            </View>
          ) : null}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t.tax}</Text>
            <Text style={styles.priceValue}>{faPrice(totals.tax)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t.total}</Text>
            <Text style={styles.totalValue}>{faPrice(totals.total)}</Text>
          </View>
        </Card>

        <Button title={t.continueToPayment} onPress={submit} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl * 2 },
  amusementTitle: { fontSize: 18, fontWeight: '800', color: colors.text, textAlign: 'right' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  slot: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  slotActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  slotDate: { fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'right' },
  slotTime: { fontSize: 12, color: colors.textMuted, textAlign: 'right', marginTop: 2 },
  stepper: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  stepperLabel: { fontSize: 14, color: colors.text, flex: 1, textAlign: 'right' },
  stepperControls: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: { fontSize: 16, fontWeight: '700', color: colors.text, minWidth: 24, textAlign: 'center' },
  optionRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  optionBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  optionRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm, flex: 1 },
  optionTitle: { fontSize: 14, color: colors.text, textAlign: 'right' },
  optionPrice: { fontSize: 13, fontWeight: '600', color: colors.primary },
  participantHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  formRow: { flexDirection: 'row-reverse', gap: spacing.sm, marginBottom: spacing.sm },
  halfInput: { flex: 1 },
  healthRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  healthText: { flex: 1, fontSize: 12, color: colors.text, textAlign: 'right' },
  priceRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  priceLabel: { fontSize: 13, color: colors.textMuted },
  priceValue: { fontSize: 13, color: colors.text, fontWeight: '600' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  totalLabel: { fontSize: 15, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 15, fontWeight: '800', color: colors.primary },
});

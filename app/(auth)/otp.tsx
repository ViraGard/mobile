import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Input } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { t } from '@/i18n/fa';
import { colors, spacing } from '@/theme';

const MOCK_CODE = '1234';

export default function Otp() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { login } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    // Accept Latin or Persian digits
    const normalized = code.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    if (normalized !== MOCK_CODE) {
      setError(t.wrongCode);
      return;
    }
    login(phone ?? '');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>{t.otpTitle}</Text>
        <Text style={styles.subtitle}>
          {t.otpSubtitle} {phone}
        </Text>
        <Text style={styles.hint}>{t.otpHint}</Text>

        <Input
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={4}
          autoFocus
          placeholder="– – – –"
          style={{ textAlign: 'center', fontSize: 24, letterSpacing: 12 }}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title={t.verify} onPress={submit} style={{ marginTop: spacing.lg }} />

        <Pressable onPress={() => router.back()}>
          <Text style={styles.editPhone}>{t.editPhone}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'right', marginTop: spacing.sm },
  hint: {
    fontSize: 13,
    color: colors.accent,
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  error: { color: colors.danger, textAlign: 'right', marginTop: spacing.md },
  editPhone: {
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: 15,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Row } from '@/components/ui';
import { t } from '@/i18n/fa';
import { colors, spacing } from '@/theme';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    const normalized = phone.replace(/[^\d۰-۹]/g, '');
    if (normalized.length < 10) {
      setError(t.invalidPhone);
      return;
    }
    if (!accepted) {
      setError(t.mustAcceptTerms);
      return;
    }
    setError('');
    router.push({ pathname: '/(auth)/otp', params: { phone: normalized } });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Ionicons name="compass" size={44} color="#fff" />
          </View>
          <Text style={styles.appName}>{t.appName}</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>

        <Text style={styles.title}>{t.loginTitle}</Text>
        <Text style={styles.subtitle}>{t.loginSubtitle}</Text>

        <Input
          value={phone}
          onChangeText={setPhone}
          placeholder={t.phonePlaceholder}
          keyboardType="phone-pad"
          maxLength={11}
          style={{ textAlign: 'center', fontSize: 20, letterSpacing: 2 }}
        />

        <Pressable onPress={() => setAccepted(!accepted)} style={styles.termsRow}>
          <Row>
            <Ionicons
              name={accepted ? 'checkbox' : 'square-outline'}
              size={22}
              color={accepted ? colors.primary : colors.textMuted}
            />
            <Text style={styles.termsText}>{t.acceptTerms}</Text>
          </Row>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title={t.sendCode} onPress={submit} style={{ marginTop: spacing.lg }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, padding: spacing.xl, justifyContent: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xxl },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  appName: { fontSize: 28, fontWeight: '800', color: colors.text },
  tagline: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'right' },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  termsRow: { marginTop: spacing.lg },
  termsText: { color: colors.text, fontSize: 14, marginEnd: spacing.sm },
  error: { color: colors.danger, textAlign: 'right', marginTop: spacing.md },
});

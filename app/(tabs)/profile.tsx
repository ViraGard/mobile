import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import { useApp } from '@/context/AppContext';
import { t } from '@/i18n/fa';
import { colors, spacing } from '@/theme';

function MenuItem({
  icon,
  label,
  value,
  danger,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuRight}>
        <Ionicons name={icon} size={20} color={danger ? colors.danger : colors.primary} />
        <Text style={[styles.menuLabel, danger && { color: colors.danger }]}>{label}</Text>
      </View>
      <View style={styles.menuLeft}>
        {value ? <Text style={styles.menuValue}>{value}</Text> : null}
        <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}

export default function Profile() {
  const { phone, logout } = useApp();

  const onLogout = () => {
    Alert.alert(t.logout, undefined, [
      { text: 'انصراف', style: 'cancel' },
      {
        text: t.logout,
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={colors.primary} />
          </View>
          <Text style={styles.name}>{t.guestUser}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>

        <Card style={{ padding: 0 }}>
          <MenuItem icon="shield-checkmark" label={t.kycStatus} value={t.kycVerified} />
          <View style={styles.divider} />
          <MenuItem icon="language" label={t.language} value={t.farsi} />
          <View style={styles.divider} />
          <MenuItem icon="document-text" label={t.terms} />
          <View style={styles.divider} />
          <MenuItem icon="headset" label={t.support} />
        </Card>

        <Card style={{ padding: 0, marginTop: spacing.lg }}>
          <MenuItem icon="log-out" label={t.logout} danger onPress={onLogout} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  avatarWrap: { alignItems: 'center', marginVertical: spacing.xl },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  phone: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
  menuItem: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  menuRight: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.md },
  menuLeft: { flexDirection: 'row-reverse', alignItems: 'center', gap: spacing.sm },
  menuLabel: { fontSize: 15, color: colors.text, fontWeight: '600' },
  menuValue: { fontSize: 13, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.lg },
});

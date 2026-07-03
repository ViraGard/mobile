import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTitleAlign: 'center',
          headerTintColor: colors.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/otp" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="amusement/[id]" options={{ title: '' }} />
        <Stack.Screen name="booking/[id]" options={{ title: 'تکمیل رزرو' }} />
        <Stack.Screen name="payment/[id]" options={{ title: 'پرداخت', headerBackVisible: false, gestureEnabled: false }} />
      </Stack>
    </AppProvider>
  );
}

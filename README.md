# ViraGard Mobile (Mock Version)

Customer app for the ViraGard entertainment reservation platform. React Native + Expo (SDK 53) + expo-router + TypeScript. Data comes from **Supabase** (catalog + reservations); if Supabase isn't configured, the app automatically falls back to local mock data in `src/data/mock.ts`.

## Supabase setup (one time)

1. Create a free project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** → paste and run `supabase/setup.sql` (creates tables, RLS policies, and seeds all mock data — safe to re-run)
3. Copy `.env.example` to `.env` and fill from **Project Settings → API**:
   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

> RLS policies in `setup.sql` are wide-open for the mock phase (anon read catalog, anon insert reservations). Tighten before anything real.

## Run

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with **Expo Go** (Android/iOS) or press `a` for Android emulator / `w` for web.

## Mock login

- Any 10–11 digit phone number
- OTP code: **1234**

## What's included (customer core flow)

- Phone login + OTP (mock), terms acceptance
- Home: 12 amusement categories + featured list (Farsi, RTL layout)
- Search by title / agency / city + category filter chips
- Amusement detail: photos, agency (verified badge), rules, age/health restrictions, time slots, adult/child prices, optional add-ons
- Booking: slot selection, adult/child counts, options, participant forms (name, age, national ID, health confirmation), price summary with 10% VAT
- Mock payment gateway → reservation code + simulated SMS note
- My reservations list with statuses
- Profile: KYC status, language (Farsi), logout

## Structure

```
app/            expo-router screens
  (auth)/       login, otp
  (tabs)/       home, search, reservations, profile
  amusement/    detail
  booking/      reservation form
  payment/      mock gateway
src/
  lib/supabase.ts    Supabase client (env-driven)
  data/types.ts      shared domain types + TAX_RATE
  data/api.ts        Supabase queries → app types (same shape the Laravel API will use)
  data/mock.ts       local fallback dataset (source of truth: supabase/setup.sql)
  context/           DataContext (catalog) + AppContext (auth, reservations)
  i18n/fa.ts         Farsi strings (en/ar to be added)
  components/        shared UI
  theme.ts           colors, spacing, fa number formatting
supabase/setup.sql   schema + RLS + seed data
```

## Next steps

- English/Arabic i18n + full RTL/LTR switching
- Agency screens (create amusement, KYC upload, received reservations)
- Real API integration (Laravel), push notifications + SMS

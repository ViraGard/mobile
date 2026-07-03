# ViraGard Mobile (Mock Version)

Customer app for the ViraGard entertainment reservation platform. React Native + Expo (SDK 53) + expo-router + TypeScript. All data is mocked in `src/data/mock.ts` — no backend needed yet.

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
  data/mock.ts       mock categories, agencies, amusements  ← replace with Laravel API later
  context/           auth + reservation state
  i18n/fa.ts         Farsi strings (en/ar to be added)
  components/        shared UI
  theme.ts           colors, spacing, fa number formatting
```

## Next steps

- English/Arabic i18n + full RTL/LTR switching
- Agency screens (create amusement, KYC upload, received reservations)
- Real API integration (Laravel), push notifications + SMS

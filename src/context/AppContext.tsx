import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface Participant {
  firstName: string;
  lastName: string;
  age: string;
  nationalId: string;
  isChild: boolean;
  healthOk: boolean;
}

export interface BookingDraft {
  amusementId: string;
  slotId: string;
  adults: number;
  children: number;
  optionIds: string[];
  participants: Participant[];
  subtotal: number;
  optionsTotal: number;
  tax: number;
  total: number;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'done' | 'canceled';

export interface Reservation {
  id: string;
  code: string;
  amusementId: string;
  slotId: string;
  adults: number;
  children: number;
  optionIds: string[];
  participants: Participant[];
  total: number;
  status: ReservationStatus;
  createdAt: string;
}

interface AppState {
  phone: string | null;
  isLoggedIn: boolean;
  login: (phone: string) => void;
  logout: () => void;
  reservations: Reservation[];
  draft: BookingDraft | null;
  setDraft: (d: BookingDraft | null) => void;
  confirmDraft: () => Reservation | null;
}

const AppContext = createContext<AppState | undefined>(undefined);

/** Seeded mock reservation so the list isn't empty on first login */
const seedReservations: Reservation[] = [
  {
    id: 'r-seed-1',
    code: 'VG-۱۰۴۲',
    amusementId: 'am7',
    slotId: 's1',
    adults: 2,
    children: 0,
    optionIds: ['op1'],
    participants: [],
    total: 1375000,
    status: 'done',
    createdAt: 'شنبه ۶ تیر',
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(seedReservations);
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const login = useCallback((p: string) => setPhone(p), []);
  const logout = useCallback(() => setPhone(null), []);

  const confirmDraft = useCallback((): Reservation | null => {
    if (!draft) return null;
    const res: Reservation = {
      id: `r-${Date.now()}`,
      code: `VG-${Math.floor(1000 + Math.random() * 9000).toLocaleString('fa-IR').replace(/٬/g, '')}`,
      amusementId: draft.amusementId,
      slotId: draft.slotId,
      adults: draft.adults,
      children: draft.children,
      optionIds: draft.optionIds,
      participants: draft.participants,
      total: draft.total,
      status: 'confirmed',
      createdAt: 'امروز',
    };
    setReservations((prev) => [res, ...prev]);
    setDraft(null);
    return res;
  }, [draft]);

  const value = useMemo(
    () => ({
      phone,
      isLoggedIn: phone !== null,
      login,
      logout,
      reservations,
      draft,
      setDraft,
      confirmDraft,
    }),
    [phone, login, logout, reservations, draft, confirmDraft]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

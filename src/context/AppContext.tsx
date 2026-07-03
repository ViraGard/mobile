import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchReservationsByPhone, insertReservation } from '@/data/api';
import { supabaseEnabled } from '@/lib/supabase';

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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const login = useCallback((p: string) => setPhone(p), []);
  const logout = useCallback(() => {
    setPhone(null);
    setReservations([]);
    setDraft(null);
  }, []);

  // Load this phone's past reservations from Supabase after login
  useEffect(() => {
    if (!phone || !supabaseEnabled) return;
    let cancelled = false;
    fetchReservationsByPhone(phone).then((rows) => {
      if (cancelled) return;
      setReservations(
        rows.map((r) => ({
          id: r.id,
          code: r.code,
          amusementId: r.amusement_id,
          slotId: r.slot_id,
          adults: r.adults,
          children: r.children,
          optionIds: r.option_ids ?? [],
          participants: [],
          total: Number(r.total),
          status: r.status,
          createdAt: new Date(r.created_at).toLocaleDateString('fa-IR'),
        }))
      );
    });
    return () => {
      cancelled = true;
    };
  }, [phone]);

  const confirmDraft = useCallback((): Reservation | null => {
    if (!draft || !phone) return null;
    const code = `VG-${Math.floor(1000 + Math.random() * 9000)}`;
    const res: Reservation = {
      id: `r-${Date.now()}`,
      code,
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

    // Persist to Supabase (best-effort; UI already updated)
    insertReservation({
      code,
      phone,
      amusementId: draft.amusementId,
      slotId: draft.slotId,
      adults: draft.adults,
      children: draft.children,
      optionIds: draft.optionIds,
      total: draft.total,
      participants: draft.participants.map((p) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        age: parseInt(p.age, 10) || 0,
        nationalId: p.nationalId,
        isChild: p.isChild,
        healthOk: p.healthOk,
      })),
    });

    return res;
  }, [draft, phone]);

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

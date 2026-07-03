/**
 * Supabase data access. Rows are snake_case in the DB and mapped
 * to the app's camelCase types here — same mapping the Laravel API will use.
 */
import { supabase } from '@/lib/supabase';
import { Agency, Amusement, Category } from './types';

interface OptionRow {
  id: string;
  title: string;
  price: number;
}

interface SlotRow {
  id: string;
  date_label: string;
  start_time: string;
  end_time: string;
  departure: string | null;
  remaining: number;
}

interface AmusementRow {
  id: string;
  category_id: string;
  agency_id: string;
  title: string;
  description: string;
  photos: string[];
  city: string;
  location: string;
  price_adult: number;
  price_child: number;
  rules: string[];
  min_age: number;
  max_age: number;
  capacity: number;
  health_restricted: boolean;
  rating: number;
  verified: boolean;
  featured: boolean;
  amusement_options: OptionRow[];
  time_slots: SlotRow[];
}

function mapAmusement(row: AmusementRow): Amusement {
  return {
    id: row.id,
    categoryId: row.category_id,
    agencyId: row.agency_id,
    title: row.title,
    description: row.description,
    photos: row.photos ?? [],
    city: row.city,
    location: row.location,
    priceAdult: Number(row.price_adult),
    priceChild: Number(row.price_child),
    rules: row.rules ?? [],
    minAge: row.min_age,
    maxAge: row.max_age,
    capacity: row.capacity,
    healthRestricted: row.health_restricted,
    rating: Number(row.rating),
    verified: row.verified,
    featured: row.featured,
    options: (row.amusement_options ?? []).map((o) => ({
      id: o.id,
      title: o.title,
      price: Number(o.price),
    })),
    slots: (row.time_slots ?? []).map((s) => ({
      id: s.id,
      date: s.date_label,
      start: s.start_time,
      end: s.end_time,
      departure: s.departure ?? undefined,
      remaining: s.remaining,
    })),
  };
}

export async function fetchCatalog(): Promise<{
  categories: Category[];
  agencies: Agency[];
  amusements: Amusement[];
}> {
  if (!supabase) throw new Error('Supabase not configured');

  const [cats, ags, ams] = await Promise.all([
    supabase.from('categories').select('*').order('sort'),
    supabase.from('agencies').select('*'),
    supabase.from('amusements').select('*, amusement_options(*), time_slots(*)'),
  ]);

  if (cats.error) throw cats.error;
  if (ags.error) throw ags.error;
  if (ams.error) throw ams.error;

  return {
    categories: (cats.data ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      icon: c.icon,
      color: c.color,
    })),
    agencies: (ags.data ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      city: a.city,
      verified: a.verified,
      phone: a.phone,
    })),
    amusements: ((ams.data ?? []) as unknown as AmusementRow[]).map(mapAmusement),
  };
}

export interface NewReservation {
  code: string;
  phone: string;
  amusementId: string;
  slotId: string;
  adults: number;
  children: number;
  optionIds: string[];
  total: number;
  participants: {
    firstName: string;
    lastName: string;
    age: number;
    nationalId: string;
    isChild: boolean;
    healthOk: boolean;
  }[];
}

export async function insertReservation(r: NewReservation): Promise<string | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      code: r.code,
      phone: r.phone,
      amusement_id: r.amusementId,
      slot_id: r.slotId,
      adults: r.adults,
      children: r.children,
      option_ids: r.optionIds,
      total: r.total,
      status: 'confirmed',
    })
    .select('id')
    .single();

  if (error) {
    console.warn('insertReservation failed:', error.message);
    return null;
  }

  if (r.participants.length > 0) {
    const { error: pErr } = await supabase.from('participants').insert(
      r.participants.map((p) => ({
        reservation_id: data.id,
        first_name: p.firstName,
        last_name: p.lastName,
        age: p.age,
        national_id: p.nationalId,
        is_child: p.isChild,
        health_ok: p.healthOk,
      }))
    );
    if (pErr) console.warn('insert participants failed:', pErr.message);
  }

  return data.id as string;
}

export interface ReservationRow {
  id: string;
  code: string;
  amusement_id: string;
  slot_id: string;
  adults: number;
  children: number;
  option_ids: string[];
  total: number;
  status: 'pending' | 'confirmed' | 'done' | 'canceled';
  created_at: string;
}

export async function fetchReservationsByPhone(phone: string): Promise<ReservationRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('phone', phone)
    .order('created_at', { ascending: false });
  if (error) {
    console.warn('fetchReservations failed:', error.message);
    return [];
  }
  return (data ?? []) as ReservationRow[];
}

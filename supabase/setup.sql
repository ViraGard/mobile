-- ViraGard mock database — run this once in Supabase SQL Editor.
-- Safe to re-run: drops and recreates everything.

drop table if exists participants cascade;
drop table if exists reservations cascade;
drop table if exists time_slots cascade;
drop table if exists amusement_options cascade;
drop table if exists amusements cascade;
drop table if exists agencies cascade;
drop table if exists categories cascade;

-- ---------------------------------------------------------------- schema

create table categories (
  id    text primary key,
  title text not null,
  icon  text not null,
  color text not null,
  sort  int  not null default 0
);

create table agencies (
  id       text primary key,
  name     text not null,
  city     text not null,
  verified boolean not null default false,
  phone    text not null
);

create table amusements (
  id                text primary key,
  category_id       text not null references categories(id),
  agency_id         text not null references agencies(id),
  title             text not null,
  description       text not null,
  photos            jsonb not null default '[]',
  city              text not null,
  location          text not null,
  price_adult       bigint not null,
  price_child       bigint not null default 0,
  rules             jsonb not null default '[]',
  min_age           int not null default 0,
  max_age           int not null default 99,
  capacity          int not null default 10,
  health_restricted boolean not null default false,
  rating            numeric(2,1) not null default 0,
  verified          boolean not null default false,
  featured          boolean not null default false
);

create table amusement_options (
  amusement_id text not null references amusements(id) on delete cascade,
  id           text not null,
  title        text not null,
  price        bigint not null,
  primary key (amusement_id, id)
);

create table time_slots (
  amusement_id text not null references amusements(id) on delete cascade,
  id           text not null,
  date_label   text not null,
  start_time   text not null,
  end_time     text not null,
  departure    text,
  remaining    int not null default 0,
  primary key (amusement_id, id)
);

create table reservations (
  id           uuid primary key default gen_random_uuid(),
  code         text not null,
  phone        text not null,
  amusement_id text not null references amusements(id),
  slot_id      text not null,
  adults       int not null default 1,
  children     int not null default 0,
  option_ids   jsonb not null default '[]',
  total        bigint not null,
  status       text not null default 'confirmed'
               check (status in ('pending','confirmed','done','canceled')),
  created_at   timestamptz not null default now()
);

create table participants (
  id             uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references reservations(id) on delete cascade,
  first_name     text not null,
  last_name      text not null,
  age            int not null,
  national_id    text not null,
  is_child       boolean not null default false,
  health_ok      boolean not null default false
);

-- ------------------------------------------------------- RLS (dev only!)
-- Catalog: public read. Reservations: anon can insert/read.
-- These policies are for the MOCK phase — tighten before production.

alter table categories        enable row level security;
alter table agencies          enable row level security;
alter table amusements        enable row level security;
alter table amusement_options enable row level security;
alter table time_slots        enable row level security;
alter table reservations      enable row level security;
alter table participants      enable row level security;

create policy "public read categories"  on categories        for select using (true);
create policy "public read agencies"    on agencies          for select using (true);
create policy "public read amusements"  on amusements        for select using (true);
create policy "public read options"     on amusement_options for select using (true);
create policy "public read slots"       on time_slots        for select using (true);
create policy "anon insert reservations" on reservations     for insert with check (true);
create policy "anon read reservations"   on reservations     for select using (true);
create policy "anon insert participants" on participants     for insert with check (true);
create policy "anon read participants"   on participants     for select using (true);

-- ---------------------------------------------------------------- seed

insert into categories (id, title, icon, color, sort) values
  ('tour',      'تور گردشگری',            'map',           '#0E7C66', 1),
  ('rowing',    'قایق‌سواری',              'boat',          '#0284C7', 2),
  ('motor',     'موتورسواری',             'bicycle',       '#DC2626', 3),
  ('racecar',   'رانندگی ماشین مسابقه',   'car-sport',     '#7C3AED', 4),
  ('horse',     'اسب‌سواری',               'walk',          '#B45309', 5),
  ('camping',   'کمپینگ',                 'bonfire',       '#EA580C', 6),
  ('plane',     'پرواز تفریحی',           'airplane',      '#0369A1', 7),
  ('pottery',   'سفالگری',                'color-palette', '#9D174D', 8),
  ('painting',  'نقاشی',                  'brush',         '#4338CA', 9),
  ('paraglide', 'پاراگلایدر',             'cloud',         '#059669', 10),
  ('diving',    'غواصی',                  'water',         '#1D4ED8', 11),
  ('safari',    'سافاری کویر',            'sunny',         '#CA8A04', 12);

insert into agencies (id, name, city, verified, phone) values
  ('ag1', 'آژانس ماجراجویان البرز', 'تهران',   true, '02188776655'),
  ('ag2', 'کلوپ دریایی خزر',        'رشت',     true, '01333445566'),
  ('ag3', 'هنرکده آفتاب',           'اصفهان',  true, '03136251234'),
  ('ag4', 'گروه پرواز آسمان',       'تهران',   true, '02177889900'),
  ('ag5', 'کویرگردان یزد',          'یزد',     true, '03536223344');

insert into amusements (id, category_id, agency_id, title, description, photos, city, location, price_adult, price_child, rules, min_age, max_age, capacity, health_restricted, rating, verified, featured) values
  ('am1', 'tour', 'ag1', 'تور یک‌روزه آبشار و جنگل',
   'یک روز کامل در دل طبیعت با پیاده‌روی سبک تا آبشار، صبحانه و ناهار محلی، لیدر حرفه‌ای و بیمه مسافرتی. مناسب خانواده‌ها و گروه‌های دوستانه.',
   '["https://picsum.photos/seed/viragard11/800/500","https://picsum.photos/seed/viragard12/800/500","https://picsum.photos/seed/viragard13/800/500"]',
   'تهران', 'مبدأ: میدان آرژانتین، تهران', 1250000, 850000,
   '["همراه داشتن کارت شناسایی الزامی است","حداکثر ۱۵ دقیقه تأخیر در مبدأ","رعایت زمان‌بندی لیدر"]',
   5, 65, 30, false, 4.8, true, true),
  ('am2', 'rowing', 'ag2', 'قایق‌سواری کایاک در مرداب',
   'تجربه پاروزنی در مرداب زیبا همراه با مربی، جلیقه نجات و آموزش اولیه ۲۰ دقیقه‌ای. قایق دونفره و تک‌نفره موجود است.',
   '["https://picsum.photos/seed/viragard21/800/500","https://picsum.photos/seed/viragard22/800/500"]',
   'رشت', 'مرداب عینک، رشت', 480000, 300000,
   '["پوشیدن جلیقه نجات الزامی است","شنا بلد بودن توصیه می‌شود"]',
   8, 60, 16, true, 4.6, true, true),
  ('am3', 'racecar', 'ag1', 'رانندگی با ماشین مسابقه در پیست',
   'هیجان رانندگی با خودروی مسابقه‌ای در پیست استاندارد به همراه مربی، تجهیزات ایمنی کامل و ۳ دور پیست. گواهینامه رانندگی الزامی است.',
   '["https://picsum.photos/seed/viragard31/800/500","https://picsum.photos/seed/viragard32/800/500","https://picsum.photos/seed/viragard33/800/500"]',
   'تهران', 'پیست آزادی، تهران', 2900000, 0,
   '["گواهینامه رانندگی الزامی است","کفش بسته الزامی است","حضور ۳۰ دقیقه قبل از سانس"]',
   18, 55, 6, true, 4.9, true, true),
  ('am4', 'horse', 'ag5', 'اسب‌سواری در دشت',
   'اسب‌سواری با اسب‌های آموزش‌دیده، همراه مربی و عکاسی. مناسب مبتدی‌ها.',
   '["https://picsum.photos/seed/viragard41/800/500","https://picsum.photos/seed/viragard42/800/500"]',
   'یزد', 'دشت ساغند، یزد', 650000, 450000,
   '["پوشیدن کلاه ایمنی الزامی است","شلوار بلند الزامی است"]',
   7, 60, 10, true, 4.5, true, false),
  ('am5', 'camping', 'ag5', 'کمپ شبانه کویر با تلسکوپ',
   'یک شب اقامت در کمپ کویری، رصد ستارگان با تلسکوپ، شام و صبحانه محلی، موسیقی زنده و آتش‌بازی مجاز کمپ.',
   '["https://picsum.photos/seed/viragard51/800/500","https://picsum.photos/seed/viragard52/800/500","https://picsum.photos/seed/viragard53/800/500"]',
   'یزد', 'کویر بافق، یزد', 1800000, 1100000,
   '["همراه داشتن لباس گرم الزامی است","ورود حیوان خانگی ممنوع"]',
   6, 70, 25, false, 4.7, true, true),
  ('am6', 'plane', 'ag4', 'پرواز تفریحی بر فراز تهران',
   'پرواز ۳۰ دقیقه‌ای با هواپیمای فوق‌سبک بر فراز شهر همراه خلبان مجرب. شامل بیمه و فیلم پرواز.',
   '["https://picsum.photos/seed/viragard61/800/500","https://picsum.photos/seed/viragard62/800/500"]',
   'تهران', 'فرودگاه آزادی، تهران', 4500000, 0,
   '["حداکثر وزن مجاز ۱۰۰ کیلوگرم","همراه داشتن کارت ملی الزامی است"]',
   12, 65, 1, true, 5.0, true, false),
  ('am7', 'pottery', 'ag3', 'کارگاه سفالگری با چرخ',
   'کارگاه ۲ ساعته سفالگری با چرخ سنتی، ساخت یک ظرف توسط خودتان و پخت و ارسال آن پس از یک هفته. تمام مواد اولیه شامل قیمت است.',
   '["https://picsum.photos/seed/viragard71/800/500","https://picsum.photos/seed/viragard72/800/500"]',
   'اصفهان', 'خیابان چهارباغ، اصفهان', 550000, 400000,
   '["لباس راحت بپوشید","اثر ساخته‌شده یک هفته بعد تحویل می‌شود"]',
   6, 99, 12, false, 4.4, true, false),
  ('am8', 'painting', 'ag3', 'شب نقاشی و قهوه',
   'یک شب دورهمی نقاشی با راهنمایی مدرس، بوم و رنگ رایگان و قهوه نامحدود. اثرتان را با خود ببرید.',
   '["https://picsum.photos/seed/viragard81/800/500"]',
   'اصفهان', 'کافه هنر، اصفهان', 420000, 320000,
   '["رزرو حداقل ۲۴ ساعت قبل"]',
   10, 99, 20, false, 4.3, true, false),
  ('am9', 'paraglide', 'ag4', 'پرواز پاراگلایدر دونفره',
   'پرواز تندم با خلبان دارای مدرک، شامل بیمه، تجهیزات کامل و فیلم پرواز از هلمت.',
   '["https://picsum.photos/seed/viragard91/800/500","https://picsum.photos/seed/viragard92/800/500"]',
   'تهران', 'سایت پروازی شهران، تهران', 2200000, 0,
   '["وزن مجاز ۴۵ تا ۹۵ کیلوگرم","کفش ورزشی الزامی است"]',
   15, 60, 8, true, 4.8, true, false);

insert into amusement_options (amusement_id, id, title, price) values
  ('am1', 'op1', 'صندلی VIP اتوبوس', 200000),
  ('am1', 'op2', 'ناهار ویژه (کباب)', 350000),
  ('am1', 'op3', 'عکاسی حرفه‌ای', 150000),
  ('am2', 'op1', 'قایق تک‌نفره', 120000),
  ('am2', 'op2', 'فیلم‌برداری با پهپاد', 400000),
  ('am3', 'op1', '۳ دور اضافه', 1200000),
  ('am3', 'op2', 'فیلم دوربین داخل خودرو', 250000),
  ('am4', 'op1', 'عکاسی با لباس محلی', 300000),
  ('am5', 'op1', 'چادر اختصاصی دونفره', 500000),
  ('am5', 'op2', 'شترسواری هنگام غروب', 350000),
  ('am6', 'op1', 'فیلم ۴K از کابین', 300000),
  ('am7', 'op1', 'لعاب‌کاری رنگی', 150000),
  ('am7', 'op2', 'ارسال اثر به منزل', 100000),
  ('am8', 'op1', 'قاب چوبی اثر', 180000),
  ('am9', 'op1', 'فیلم و عکس هوایی', 250000);

insert into time_slots (amusement_id, id, date_label, start_time, end_time, departure, remaining) values
  ('am1', 's1', 'پنجشنبه ۱۸ تیر', '۰۶:۰۰', '۲۰:۰۰', '۰۶:۰۰', 12),
  ('am1', 's2', 'جمعه ۱۹ تیر',    '۰۶:۰۰', '۲۰:۰۰', '۰۶:۰۰', 4),
  ('am2', 's1', 'پنجشنبه ۱۸ تیر', '۰۹:۰۰', '۱۱:۰۰', null, 8),
  ('am2', 's2', 'پنجشنبه ۱۸ تیر', '۱۵:۰۰', '۱۷:۰۰', null, 10),
  ('am2', 's3', 'جمعه ۱۹ تیر',    '۰۹:۰۰', '۱۱:۰۰', null, 2),
  ('am3', 's1', 'جمعه ۱۹ تیر',    '۱۰:۰۰', '۱۱:۰۰', null, 3),
  ('am3', 's2', 'جمعه ۱۹ تیر',    '۱۶:۰۰', '۱۷:۰۰', null, 6),
  ('am4', 's1', 'پنجشنبه ۱۸ تیر', '۱۷:۰۰', '۱۹:۰۰', null, 6),
  ('am4', 's2', 'شنبه ۲۰ تیر',    '۰۸:۰۰', '۱۰:۰۰', null, 10),
  ('am5', 's1', 'پنجشنبه ۱۸ تیر', '۱۶:۰۰', '۱۰:۰۰ فردا', '۱۴:۰۰', 9),
  ('am6', 's1', 'جمعه ۱۹ تیر',    '۰۸:۰۰', '۰۸:۳۰', null, 1),
  ('am6', 's2', 'جمعه ۱۹ تیر',    '۰۹:۰۰', '۰۹:۳۰', null, 1),
  ('am7', 's1', 'چهارشنبه ۱۷ تیر', '۱۰:۰۰', '۱۲:۰۰', null, 5),
  ('am7', 's2', 'پنجشنبه ۱۸ تیر', '۱۶:۰۰', '۱۸:۰۰', null, 8),
  ('am8', 's1', 'پنجشنبه ۱۸ تیر', '۱۸:۰۰', '۲۱:۰۰', null, 14),
  ('am9', 's1', 'جمعه ۱۹ تیر',    '۰۷:۰۰', '۱۲:۰۰', null, 5);

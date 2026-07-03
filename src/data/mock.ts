/** Mock data — replaced by Laravel API later. */

export interface Category {
  id: string;
  title: string;
  icon: string; // Ionicons name
  color: string;
}

export interface AmusementOption {
  id: string;
  title: string;
  price: number; // per person, toman
}

export interface TimeSlot {
  id: string;
  date: string; // shamsi display
  start: string;
  end: string;
  departure?: string;
  remaining: number;
}

export interface Amusement {
  id: string;
  categoryId: string;
  title: string;
  agencyId: string;
  description: string;
  photos: string[];
  city: string;
  location: string;
  priceAdult: number;
  priceChild: number;
  rules: string[];
  minAge: number;
  maxAge: number;
  capacity: number;
  healthRestricted: boolean; // requires "no physical/mental issue" confirmation
  options: AmusementOption[];
  slots: TimeSlot[];
  rating: number;
  verified: boolean;
  featured?: boolean;
}

export interface Agency {
  id: string;
  name: string;
  city: string;
  verified: boolean;
  phone: string;
}

export const TAX_RATE = 0.1;

export const categories: Category[] = [
  { id: 'tour', title: 'تور گردشگری', icon: 'map', color: '#0E7C66' },
  { id: 'rowing', title: 'قایق‌سواری', icon: 'boat', color: '#0284C7' },
  { id: 'motor', title: 'موتورسواری', icon: 'bicycle', color: '#DC2626' },
  { id: 'racecar', title: 'رانندگی ماشین مسابقه', icon: 'car-sport', color: '#7C3AED' },
  { id: 'horse', title: 'اسب‌سواری', icon: 'walk', color: '#B45309' },
  { id: 'camping', title: 'کمپینگ', icon: 'bonfire', color: '#EA580C' },
  { id: 'plane', title: 'پرواز تفریحی', icon: 'airplane', color: '#0369A1' },
  { id: 'pottery', title: 'سفالگری', icon: 'color-palette', color: '#9D174D' },
  { id: 'painting', title: 'نقاشی', icon: 'brush', color: '#4338CA' },
  { id: 'paraglide', title: 'پاراگلایدر', icon: 'cloud', color: '#059669' },
  { id: 'diving', title: 'غواصی', icon: 'water', color: '#1D4ED8' },
  { id: 'safari', title: 'سافاری کویر', icon: 'sunny', color: '#CA8A04' },
];

export const agencies: Agency[] = [
  { id: 'ag1', name: 'آژانس ماجراجویان البرز', city: 'تهران', verified: true, phone: '02188776655' },
  { id: 'ag2', name: 'کلوپ دریایی خزر', city: 'رشت', verified: true, phone: '01333445566' },
  { id: 'ag3', name: 'هنرکده آفتاب', city: 'اصفهان', verified: true, phone: '03136251234' },
  { id: 'ag4', name: 'گروه پرواز آسمان', city: 'تهران', verified: true, phone: '02177889900' },
  { id: 'ag5', name: 'کویرگردان یزد', city: 'یزد', verified: true, phone: '03536223344' },
];

const img = (seed: number) => `https://picsum.photos/seed/viragard${seed}/800/500`;

export const amusements: Amusement[] = [
  {
    id: 'am1',
    categoryId: 'tour',
    title: 'تور یک‌روزه آبشار و جنگل',
    agencyId: 'ag1',
    description:
      'یک روز کامل در دل طبیعت با پیاده‌روی سبک تا آبشار، صبحانه و ناهار محلی، لیدر حرفه‌ای و بیمه مسافرتی. مناسب خانواده‌ها و گروه‌های دوستانه.',
    photos: [img(11), img(12), img(13)],
    city: 'تهران',
    location: 'مبدأ: میدان آرژانتین، تهران',
    priceAdult: 1250000,
    priceChild: 850000,
    rules: ['همراه داشتن کارت شناسایی الزامی است', 'حداکثر ۱۵ دقیقه تأخیر در مبدأ', 'رعایت زمان‌بندی لیدر'],
    minAge: 5,
    maxAge: 65,
    capacity: 30,
    healthRestricted: false,
    options: [
      { id: 'op1', title: 'صندلی VIP اتوبوس', price: 200000 },
      { id: 'op2', title: 'ناهار ویژه (کباب)', price: 350000 },
      { id: 'op3', title: 'عکاسی حرفه‌ای', price: 150000 },
    ],
    slots: [
      { id: 's1', date: 'پنجشنبه ۱۸ تیر', start: '۰۶:۰۰', end: '۲۰:۰۰', departure: '۰۶:۰۰', remaining: 12 },
      { id: 's2', date: 'جمعه ۱۹ تیر', start: '۰۶:۰۰', end: '۲۰:۰۰', departure: '۰۶:۰۰', remaining: 4 },
    ],
    rating: 4.8,
    verified: true,
    featured: true,
  },
  {
    id: 'am2',
    categoryId: 'rowing',
    title: 'قایق‌سواری کایاک در مرداب',
    agencyId: 'ag2',
    description:
      'تجربه پاروزنی در مرداب زیبا همراه با مربی، جلیقه نجات و آموزش اولیه ۲۰ دقیقه‌ای. قایق دونفره و تک‌نفره موجود است.',
    photos: [img(21), img(22)],
    city: 'رشت',
    location: 'مرداب عینک، رشت',
    priceAdult: 480000,
    priceChild: 300000,
    rules: ['پوشیدن جلیقه نجات الزامی است', 'شنا بلد بودن توصیه می‌شود'],
    minAge: 8,
    maxAge: 60,
    capacity: 16,
    healthRestricted: true,
    options: [
      { id: 'op1', title: 'قایق تک‌نفره', price: 120000 },
      { id: 'op2', title: 'فیلم‌برداری با پهپاد', price: 400000 },
    ],
    slots: [
      { id: 's1', date: 'پنجشنبه ۱۸ تیر', start: '۰۹:۰۰', end: '۱۱:۰۰', remaining: 8 },
      { id: 's2', date: 'پنجشنبه ۱۸ تیر', start: '۱۵:۰۰', end: '۱۷:۰۰', remaining: 10 },
      { id: 's3', date: 'جمعه ۱۹ تیر', start: '۰۹:۰۰', end: '۱۱:۰۰', remaining: 2 },
    ],
    rating: 4.6,
    verified: true,
    featured: true,
  },
  {
    id: 'am3',
    categoryId: 'racecar',
    title: 'رانندگی با ماشین مسابقه در پیست',
    agencyId: 'ag1',
    description:
      'هیجان رانندگی با خودروی مسابقه‌ای در پیست استاندارد به همراه مربی، تجهیزات ایمنی کامل و ۳ دور پیست. گواهینامه رانندگی الزامی است.',
    photos: [img(31), img(32), img(33)],
    city: 'تهران',
    location: 'پیست آزادی، تهران',
    priceAdult: 2900000,
    priceChild: 0,
    rules: ['گواهینامه رانندگی الزامی است', 'کفش بسته الزامی است', 'حضور ۳۰ دقیقه قبل از سانس'],
    minAge: 18,
    maxAge: 55,
    capacity: 6,
    healthRestricted: true,
    options: [
      { id: 'op1', title: '۳ دور اضافه', price: 1200000 },
      { id: 'op2', title: 'فیلم دوربین داخل خودرو', price: 250000 },
    ],
    slots: [
      { id: 's1', date: 'جمعه ۱۹ تیر', start: '۱۰:۰۰', end: '۱۱:۰۰', remaining: 3 },
      { id: 's2', date: 'جمعه ۱۹ تیر', start: '۱۶:۰۰', end: '۱۷:۰۰', remaining: 6 },
    ],
    rating: 4.9,
    verified: true,
    featured: true,
  },
  {
    id: 'am4',
    categoryId: 'horse',
    title: 'اسب‌سواری در دشت',
    agencyId: 'ag5',
    description: 'اسب‌سواری با اسب‌های آموزش‌دیده، همراه مربی و عکاسی. مناسب مبتدی‌ها.',
    photos: [img(41), img(42)],
    city: 'یزد',
    location: 'دشت ساغند، یزد',
    priceAdult: 650000,
    priceChild: 450000,
    rules: ['پوشیدن کلاه ایمنی الزامی است', 'شلوار بلند الزامی است'],
    minAge: 7,
    maxAge: 60,
    capacity: 10,
    healthRestricted: true,
    options: [{ id: 'op1', title: 'عکاسی با لباس محلی', price: 300000 }],
    slots: [
      { id: 's1', date: 'پنجشنبه ۱۸ تیر', start: '۱۷:۰۰', end: '۱۹:۰۰', remaining: 6 },
      { id: 's2', date: 'شنبه ۲۰ تیر', start: '۰۸:۰۰', end: '۱۰:۰۰', remaining: 10 },
    ],
    rating: 4.5,
    verified: true,
  },
  {
    id: 'am5',
    categoryId: 'camping',
    title: 'کمپ شبانه کویر با تلسکوپ',
    agencyId: 'ag5',
    description:
      'یک شب اقامت در کمپ کویری، رصد ستارگان با تلسکوپ، شام و صبحانه محلی، موسیقی زنده و آتش‌بازی مجاز کمپ.',
    photos: [img(51), img(52), img(53)],
    city: 'یزد',
    location: 'کویر بافق، یزد',
    priceAdult: 1800000,
    priceChild: 1100000,
    rules: ['همراه داشتن لباس گرم الزامی است', 'ورود حیوان خانگی ممنوع'],
    minAge: 6,
    maxAge: 70,
    capacity: 25,
    healthRestricted: false,
    options: [
      { id: 'op1', title: 'چادر اختصاصی دونفره', price: 500000 },
      { id: 'op2', title: 'شترسواری هنگام غروب', price: 350000 },
    ],
    slots: [
      { id: 's1', date: 'پنجشنبه ۱۸ تیر', start: '۱۶:۰۰', end: '۱۰:۰۰ فردا', departure: '۱۴:۰۰', remaining: 9 },
    ],
    rating: 4.7,
    verified: true,
    featured: true,
  },
  {
    id: 'am6',
    categoryId: 'plane',
    title: 'پرواز تفریحی بر فراز تهران',
    agencyId: 'ag4',
    description: 'پرواز ۳۰ دقیقه‌ای با هواپیمای فوق‌سبک بر فراز شهر همراه خلبان مجرب. شامل بیمه و فیلم پرواز.',
    photos: [img(61), img(62)],
    city: 'تهران',
    location: 'فرودگاه آزادی، تهران',
    priceAdult: 4500000,
    priceChild: 0,
    rules: ['حداکثر وزن مجاز ۱۰۰ کیلوگرم', 'همراه داشتن کارت ملی الزامی است'],
    minAge: 12,
    maxAge: 65,
    capacity: 1,
    healthRestricted: true,
    options: [{ id: 'op1', title: 'فیلم ۴K از کابین', price: 300000 }],
    slots: [
      { id: 's1', date: 'جمعه ۱۹ تیر', start: '۰۸:۰۰', end: '۰۸:۳۰', remaining: 1 },
      { id: 's2', date: 'جمعه ۱۹ تیر', start: '۰۹:۰۰', end: '۰۹:۳۰', remaining: 1 },
    ],
    rating: 5.0,
    verified: true,
  },
  {
    id: 'am7',
    categoryId: 'pottery',
    title: 'کارگاه سفالگری با چرخ',
    agencyId: 'ag3',
    description:
      'کارگاه ۲ ساعته سفالگری با چرخ سنتی، ساخت یک ظرف توسط خودتان و پخت و ارسال آن پس از یک هفته. تمام مواد اولیه شامل قیمت است.',
    photos: [img(71), img(72)],
    city: 'اصفهان',
    location: 'خیابان چهارباغ، اصفهان',
    priceAdult: 550000,
    priceChild: 400000,
    rules: ['لباس راحت بپوشید', 'اثر ساخته‌شده یک هفته بعد تحویل می‌شود'],
    minAge: 6,
    maxAge: 99,
    capacity: 12,
    healthRestricted: false,
    options: [
      { id: 'op1', title: 'لعاب‌کاری رنگی', price: 150000 },
      { id: 'op2', title: 'ارسال اثر به منزل', price: 100000 },
    ],
    slots: [
      { id: 's1', date: 'چهارشنبه ۱۷ تیر', start: '۱۰:۰۰', end: '۱۲:۰۰', remaining: 5 },
      { id: 's2', date: 'پنجشنبه ۱۸ تیر', start: '۱۶:۰۰', end: '۱۸:۰۰', remaining: 8 },
    ],
    rating: 4.4,
    verified: true,
  },
  {
    id: 'am8',
    categoryId: 'painting',
    title: 'شب نقاشی و قهوه',
    agencyId: 'ag3',
    description: 'یک شب دورهمی نقاشی با راهنمایی مدرس، بوم و رنگ رایگان و قهوه نامحدود. اثرتان را با خود ببرید.',
    photos: [img(81)],
    city: 'اصفهان',
    location: 'کافه هنر، اصفهان',
    priceAdult: 420000,
    priceChild: 320000,
    rules: ['رزرو حداقل ۲۴ ساعت قبل'],
    minAge: 10,
    maxAge: 99,
    capacity: 20,
    healthRestricted: false,
    options: [{ id: 'op1', title: 'قاب چوبی اثر', price: 180000 }],
    slots: [
      { id: 's1', date: 'پنجشنبه ۱۸ تیر', start: '۱۸:۰۰', end: '۲۱:۰۰', remaining: 14 },
    ],
    rating: 4.3,
    verified: true,
  },
  {
    id: 'am9',
    categoryId: 'paraglide',
    title: 'پرواز پاراگلایدر دونفره',
    agencyId: 'ag4',
    description: 'پرواز تندم با خلبان دارای مدرک، شامل بیمه، تجهیزات کامل و فیلم پرواز از هلمت.',
    photos: [img(91), img(92)],
    city: 'تهران',
    location: 'سایت پروازی شهران، تهران',
    priceAdult: 2200000,
    priceChild: 0,
    rules: ['وزن مجاز ۴۵ تا ۹۵ کیلوگرم', 'کفش ورزشی الزامی است'],
    minAge: 15,
    maxAge: 60,
    capacity: 8,
    healthRestricted: true,
    options: [{ id: 'op1', title: 'فیلم و عکس هوایی', price: 250000 }],
    slots: [
      { id: 's1', date: 'جمعه ۱۹ تیر', start: '۰۷:۰۰', end: '۱۲:۰۰', remaining: 5 },
    ],
    rating: 4.8,
    verified: true,
  },
];

export function getAmusement(id: string): Amusement | undefined {
  return amusements.find((a) => a.id === id);
}

export function getAgency(id: string): Agency | undefined {
  return agencies.find((a) => a.id === id);
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

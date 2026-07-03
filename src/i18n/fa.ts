/**
 * Farsi strings (default language).
 * Structure is i18n-ready: add en.ts / ar.ts with the same keys later.
 */
export const t = {
  appName: 'ویراگارد',
  tagline: 'رزرو تفریحات و سرگرمی',

  // Auth
  loginTitle: 'ورود / ثبت‌نام',
  loginSubtitle: 'شماره موبایل خود را وارد کنید',
  phonePlaceholder: '۰۹۱۲ ××× ××××',
  sendCode: 'ارسال کد تأیید',
  otpTitle: 'کد تأیید',
  otpSubtitle: 'کد ارسال‌شده به شماره را وارد کنید',
  otpHint: '(نسخه آزمایشی: کد ۱۲۳۴)',
  verify: 'تأیید و ورود',
  wrongCode: 'کد وارد شده صحیح نیست',
  invalidPhone: 'شماره موبایل معتبر وارد کنید',
  editPhone: 'ویرایش شماره',
  acceptTerms: 'قوانین و شرایط استفاده را می‌پذیرم',
  mustAcceptTerms: 'پذیرش قوانین الزامی است',

  // Tabs
  tabHome: 'خانه',
  tabSearch: 'جستجو',
  tabReservations: 'رزروها',
  tabProfile: 'پروفایل',

  // Home
  greeting: 'سلام 👋',
  chooseCategory: 'دسته‌بندی‌ها',
  featured: 'پیشنهاد ویژه',
  seeAll: 'مشاهده همه',
  perAdult: 'هر بزرگسال',

  // Search
  searchPlaceholder: 'جستجوی عنوان، آژانس یا مکان...',
  noResults: 'نتیجه‌ای یافت نشد',
  all: 'همه',

  // Detail
  agency: 'آژانس',
  verifiedAgency: 'تأیید شده',
  description: 'توضیحات',
  rules: 'قوانین',
  restrictions: 'محدودیت‌ها',
  schedule: 'تاریخ و ساعت',
  start: 'شروع',
  end: 'پایان',
  departure: 'حرکت',
  priceAdult: 'بزرگسال',
  priceChild: 'کودک',
  options: 'گزینه‌های اختیاری',
  reserve: 'رزرو',
  platformRules: 'قوانین پلتفرم: مصرف مشروبات الکلی و مواد مخدر ممنوع است.',
  ageLimit: 'محدوده سنی',
  capacity: 'ظرفیت',
  people: 'نفر',
  years: 'سال',
  location: 'مکان',

  // Booking
  bookingTitle: 'تکمیل رزرو',
  selectDate: 'انتخاب تاریخ',
  selectTime: 'انتخاب سانس',
  adults: 'بزرگسال',
  children: 'کودک',
  participants: 'مشخصات همراهان',
  firstName: 'نام',
  lastName: 'نام خانوادگی',
  age: 'سن',
  nationalId: 'کد ملی',
  healthConfirm: 'هیچ‌گونه مشکل جسمی، روحی یا بیماری خاصی ندارم',
  healthRequired: 'تأیید سلامت برای همه همراهان الزامی است',
  fillAllFields: 'لطفاً مشخصات همه همراهان را کامل کنید',
  invalidNationalId: 'کد ملی باید ۱۰ رقم باشد',
  ageOutOfRange: 'سن یکی از همراهان خارج از محدوده مجاز است',
  priceSummary: 'خلاصه قیمت',
  optionsSum: 'گزینه‌ها',
  tax: 'مالیات بر ارزش افزوده (۱۰٪)',
  total: 'مبلغ قابل پرداخت',
  continueToPayment: 'ادامه و پرداخت',
  participant: 'همراه',

  // Payment
  paymentTitle: 'پرداخت',
  paymentGateway: 'درگاه پرداخت (آزمایشی)',
  payNow: 'پرداخت',
  paymentSuccess: 'پرداخت با موفقیت انجام شد',
  reservationCode: 'کد رزرو',
  smsNote: 'پیامک تأیید برای شما، آژانس و پشتیبانی ارسال شد. (شبیه‌سازی)',
  backToHome: 'بازگشت به خانه',
  viewReservations: 'مشاهده رزروها',

  // Reservations
  myReservations: 'رزروهای من',
  emptyReservations: 'هنوز رزروی ثبت نکرده‌اید',
  statusConfirmed: 'تأیید شده',
  statusPending: 'در انتظار تأیید',
  statusDone: 'انجام شده',
  statusCanceled: 'لغو شده',

  // Profile
  profile: 'پروفایل',
  guestUser: 'کاربر ویراگارد',
  language: 'زبان',
  farsi: 'فارسی',
  kycStatus: 'احراز هویت',
  kycVerified: 'تأیید شده (کارت ملی)',
  terms: 'قوانین و شرایط',
  support: 'پشتیبانی',
  logout: 'خروج از حساب',
};

export type Strings = typeof t;

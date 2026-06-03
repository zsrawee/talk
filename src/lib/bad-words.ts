import engWords from "./bad-words-en.json";

const arabicWords: string[] = [
  "سافل", "قحب", "عرص", "نيك", "شرموط", "خول", "لوطي",
  "زاني", "كلب", "خنزير", "حمار", "بهيم", "غبي", "أحمق",
  "جاهل", "كذاب", "منافق", "خائن", "ظالم", "فاسق", "كافر",
  "ملعون", "نجس", "وسخ", "قذر", "حقير", "وضيع", "خسيس",
  "لئيم", "بخيل", "جبان", "نذل", "فاجر", "مفسد", "مجرم",
  "تافه", "سخيف", "فاشل", "حاقد", "انتحار", "قاتل", "قتل",
  "حرق", "سجن", "ذبح", "طعن", "سرقة", "حرامي", "عاهرة",
  "داعر", "شاذ", "شذوذ", "جنس", "سكس", "بورن", "إباحي",
  "زب", "طيز", "كس", "مهبل", "بظر", "ثدي", "اير", "مص",
  "لحس", "متخلف", "اناني", "مغرور", "متكبر", "خبيث", "ماكر",
  "حاسد", "وقح", "ساقط", "رذيل", "نصاب", "غشاش", "خربان",
  "دجال", "شيطان", "ابليس", "زنجي", "مجنون", "مخبول", "مهلوس",
  "سكير", "شرير", "جهنم", "جحيم", "حثالة",
  "فاحش", "شوفين", "خرفان", "سفلة",
  "خول", "خولة", "خوال", "خولات",
  "احمق", "احمقة", "حمق",
  "سافل", "سافلة",
  "كلب", "كلبة",
  "خنزير",
  "حمار", "حمارة",
  "زاني", "زانية",
  "عاهر", "عاهرة",
  "ساقط", "ساقطة",
  "خبيث", "خبيثة",
  "شرموط", "شراميط",
  "متناك",
  "لوطي", "لواطة",
  "مخنث",
  "مخنثة",
  "مشواذ",
  "قواد",
  "قحبة",
  "عرص",
  "داعر",
  "داعرة",
  "سحاقية",
  "سحاق",
  "جنس",
  "جنسي",
  "جنسية",
  "خل", "خوي",
  "ahmaq", "ahmak", "a7maq",
  "sharmoot", "sharmota", "sharmout",
  "khal", "khawal", "5al", "5awal",
  "qahba", "qahbe", "qo7ba",
  "arse", "3arse", "3ars",
  "neek", "nayek", "nayk",
  "kess", "koss", "kiss",
  "zabr", "zib", "zbor",
  "tiz", "tez",
  "meek", "mek",
  "loti", "louty", "looty",
  "zany", "zane",
  "kalb", "kelb", "klb",
  "khanzeer", "khanzir", "5anzeer",
  "hemar", "hmar", "7emar", "7mar",
  "gaby", "ghaby", "ghabi",
  "jahil",
  "kathab", "kazzab",
  "munafiq",
  "kafr", "kafir",
  "mal3on", "maloon",
  "najis",
  "khara", "5ara",
  "khayeb", "5ayeb",
  "fasq", "fasik",
  "fck", "fuk", "fuc",
  "انوش", "انعاش",
  "انحاش",
  "شوفين", "شوفاني",
  "خرع",
  "خرفان",
  "مجنون",
];

const arabiziToArabic: Record<string, string> = {
  "2": "أ", "3": "ع", "5": "خ", "6": "ط", "7": "ح",
  "8": "ق", "9": "ص", "4": "ش",
};
const leetToNormal: Record<string, string> = {
  "0": "o", "1": "i", "2": "z", "3": "e", "4": "a",
  "5": "s", "6": "g", "7": "t", "8": "b", "9": "p",
  "@": "a", "$": "s", "!": "i", "+": "t",
};

function normalizeArabic(word: string): string {
  return word
    .replace(/[إأآا]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[ى]/g, "ي")
    .replace(/[ًٌٍَُِّْ]/g, "")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي");
}

function normalizeArabizi(word: string): string {
  return word.split("").map((c) => arabiziToArabic[c] || c).join("");
}

function normalizeLeet(word: string): string {
  return word.split("").map((c) => leetToNormal[c] || c).join("");
}

function stripRepetition(word: string): string {
  return word.replace(/(.)\1{2,}/g, "$1$1");
}

function stripSeparators(word: string): string {
  return word.replace(/[.\-_*~,|+=\\/]/g, "");
}

function isArabicChar(c: string): boolean {
  return /[\u0600-\u06FF]/.test(c);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[] = [];
  for (let i = 0; i <= n; i++) dp[i] = i;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(dp[j], dp[j - 1], prev);
      prev = temp;
    }
  }
  return dp[n];
}

function getThreshold(len: number): number {
  if (len <= 3) return 0;
  if (len <= 5) return 1;
  if (len <= 8) return 2;
  return 3;
}

const badWordsSet = new Set([
  ...engWords.map((w) => w.toLowerCase()),
  ...arabicWords,
]);

const badWordsNormalized = new Set(
  [...badWordsSet].map((w) => normalizeArabic(w))
);

const badWordsArray = [...badWordsSet];

export function containsBadWords(text: string): boolean {
  if (!text) return false;

  const lower = text.toLowerCase().trim();
  const rawWords = lower.split(/[\s,.\-_@!؟?،؛:()\n\r]+/).filter(Boolean);
  const cleaned: { word: string; raw: string; isArabic: boolean }[] = [];

  for (const raw of rawWords) {
    const stripped = stripSeparators(raw);
    const noRepeat = stripRepetition(stripped);
    const isArabic = isArabicChar(noRepeat);
    let word: string;

    if (isArabic) {
      word = normalizeArabic(noRepeat);
    } else {
      const noLeet = normalizeLeet(noRepeat);
      const arabizi = normalizeArabizi(noLeet);
      word = arabizi.includes("ا") || arabizi.length < noLeet.length ? arabizi : noLeet;
    }

    cleaned.push({ word, raw, isArabic });
  }

  for (const { word } of cleaned) {
    if (!word || word.length < 2) continue;

    if (badWordsSet.has(word) || badWordsNormalized.has(word)) return true;

    const maybeArabic = isArabicChar(word.charAt(0));
    const refList = maybeArabic ? arabicWords : badWordsArray;
    const threshold = getThreshold(word.length);

    for (const bad of refList) {
      const ref = maybeArabic ? normalizeArabic(bad) : bad;
      if (Math.abs(word.length - ref.length) / Math.max(word.length, ref.length) > 0.45) continue;
      if (levenshtein(word, ref) <= threshold) return true;
    }
  }

  return false;
}



export const kDEFAULT_WORD_COUNT = 5;

export const kESTIMATE_TOTAL_WORD_COUNT = 6000;

export const kCOUNTRY_LANG_CODE = 'de';
export const kSPEAK_LANG_CODE = 'de-DE';
export const kLANG_NAME = 'german';
export const kLANG_NAME_CAPITAL = 'German';
export const kCOUNTRY_NAME = 'Germany';
export const kCOUNTRY_FLAG_IMG = '/de.webp';
export const kCOMMONWORDS_URL_WWW = "https://www.commongermanwords.com";
export const kCOUNTRY_FLAG_EMOJI = '🇩🇪';
export const kLANGUAGE_ALPHABET =   [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "ä",
    "ö",
    "ü",
    "ß",
  ];

export const kIMAGE_PATHS = [
  '/germany1.webp',
  '/germany2.webp',
  '/germany3.webp',
  '/germany4.webp',
  '/germany5.webp',
  '/germany6.webp',
  '/germany7.webp',
];

export const kEXAMPLE_WORDS = {
  browse: ["die", "hund", "aber"],
  top100: ["ich", "du", "das"],
  top500: ["einfach", "werden", "immer"],
  top500Nouns: ["gott", "frau", "arzt"],
  top500Verbs: ["haben", "wollte", "musst"],
  top500Adjectives: ["gut", "spät", "alt"],
  top500Adverbs: ["dann", "immer", "vielleicht"],
  top100Nouns: ["glaube", "vater", "tag"],
  top100Verbs: ["ist", "hast", "will"],
  top100Adjectives: ["toll", "richtig", "lange"],
  top100Adverbs: ["wo", "nie", "heute"],
} as const;


export const kARTICLE_WORDS = [
  { word: "der Mann", translation: "the man" },
  { word: "die Frau", translation: "the woman" },
  { word: "das Kind", translation: "the child" },
];

export const kARTICLES_BY_GENDER = {
  masculine: { singular: "der", plural: "die" },
  feminine: { singular: "die", plural: "die" },
  neuter: { singular: "das", plural: "die" },
}

/*
export const kESTIMATE_TOTAL_WORD_COUNT = 7000;

export const kCOUNTRY_LANG_CODE = 'es';
export const kSPEAK_LANG_CODE = 'es-ES';
export const kLANG_NAME = 'spanish';
export const kLANG_NAME_CAPITAL = 'Spanish';
export const kCOUNTRY_NAME = 'Spain';
export const kCOUNTRY_FLAG_IMG = '/es.webp';
export const kCOMMONWORDS_URL_WWW = "https://www.commonspanishwords.com";
export const kCOUNTRY_FLAG_EMOJI = '🇪🇸';
export const kLANGUAGE_ALPHABET = [
  "a",
  "á",
  "b",
  "c",
  "d",
  "e",
  "é",
  "f",
  "g",
  "h",
  "i",
  "í",
  "j",
  "k",
  "l",
  "m",
  "n",
  "ñ",
  "o",
  "ó",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "ú",
  "v",
  "w",
  "x",
  "y",
  "z",
];

export const kIMAGE_PATHS = [
  '/spain1.webp',
  '/spain2.webp',
  '/spain3.webp',
  '/spain4.webp',
  '/spain5.webp',
  '/spain6.webp',
  '/spain7.webp',
];

export const kEXAMPLE_WORDS = {
  browse: ["que", "bueno", "hola"],
  top100: ["de", "es", "la"],
  top500: ["gracias", "esta", "nos"],
  top500Nouns: ["dios", "favor", "casa"],
  top500Verbs: ["estoy", "puedo", "sabes"],
  top500Adjectives: ["grande", "nueva", "lista"],
  top500Adverbs: ["casi", "todava", "cerca"],
  top100Nouns: ["agua", "cena", "boca"],
  top100Verbs: ["comer", "amo", "buscar"],
  top100Adjectives: ["gran", "cierto", "genial"],
  top100Adverbs: ["bien", "ahora", "tan"],
} as const;

export const kARTICLE_WORDS = [
  { word: "el hombre", translation: "the man" },
  { word: "la mujer", translation: "the woman" },
  { word: "el niño", translation: "the boy / child" },
];

export const kARTICLES_BY_GENDER = {
      masculine: { singular: "el", plural: "los" },
      feminine: { singular: "la", plural: "las" },
    }
*/

/*
export const kESTIMATE_TOTAL_WORD_COUNT = 7000;

export const kCOUNTRY_LANG_CODE = 'fr';
export const kSPEAK_LANG_CODE = 'fr-FR';
export const kLANG_NAME = 'french';
export const kLANG_NAME_CAPITAL = 'French';
export const kCOUNTRY_NAME = 'France';
export const kCOUNTRY_FLAG_IMG = '/fr.webp';
export const kCOMMONWORDS_URL_WWW = "https://www.commonfrenchwords.com";
export const kCOUNTRY_FLAG_EMOJI = '🇫🇷';
export const kLANGUAGE_ALPHABET = [
  "a",
  "à",
  "â",
  "b",
  "c",
  "ç",
  "d",
  "e",
  "é",
  "è",
  "ê",
  "ë",
  "f",
  "g",
  "h",
  "i",
  "î",
  "ï",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "ô",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "ù",
  "û",
  "ü",
  "v",
  "w",
  "x",
  "y",
  "ÿ",
  "z",
];

export const kIMAGE_PATHS = [
  '/france1.webp',
  '/france2.webp',
  '/france3.webp',
  '/france4.webp',
  '/france5.webp',
  '/france6.webp',
  '/france7.webp',
];

export const kEXAMPLE_WORDS = {
  browse: ["bonjour", "merci", "salut"],
  top100: ["de", "la", "et"],
  top500: ["merci", "toujours", "notre"],
  top500Nouns: ["dieu", "maison", "femme"],
  top500Verbs: ["être", "avoir", "savoir"],
  top500Adjectives: ["grand", "nouveau", "petit"],
  top500Adverbs: ["souvent", "toujours", "près"],
  top100Nouns: ["eau", "dîner", "bouche"],
  top100Verbs: ["manger", "aimer", "chercher"],
  top100Adjectives: ["grand", "vrai", "génial"],
  top100Adverbs: ["bien", "maintenant", "tellement"],
} as const;

export const kARTICLE_WORDS = [
  { word: "l’homme", translation: "the man" },
  { word: "la femme", translation: "the woman" },
  { word: "l’enfant", translation: "the child" },
];

export const kARTICLES_BY_GENDER = {
  masculine: { singular: "le", plural: "les" },
  feminine: { singular: "la", plural: "les" },
  vowel: { singular: "l’", plural: "les" },
}
*/
/**
 * Jarvis command routing — pure, local keyword matching.
 *
 * Commands are matched entirely in the browser; nothing typed here is sent to
 * any server or AI service. Every route returned points at a screen that
 * already exists in `App.tsx`.
 *
 * Kept free of `@/` imports and non-erasable TS syntax so it runs under
 * `node --test` without a bundler.
 */

export type JarvisIntentId =
  | "home"
  | "explore"
  | "library"
  | "unity"
  | "profile"
  | "tradition"
  | "scripture"
  | "health"
  | "unknown";

export type CatalogTradition = { slug: string; name: string };
export type CatalogScripture = { id: number; name: string; originalName?: string };

export type JarvisCatalog = {
  traditions?: CatalogTradition[];
  scriptures?: CatalogScripture[];
};

export type JarvisRoute = {
  intent: JarvisIntentId;
  /** In-app path to navigate to, or null when Jarvis should only reply. */
  href: string | null;
  /** Display name of the matched tradition / scripture, if any. */
  match?: string;
};

type KeywordIntent = {
  intent: Exclude<JarvisIntentId, "tradition" | "scripture" | "unknown">;
  href: string | null;
  keywords: string[];
};

// Order matters: the first intent with a keyword hit wins.
const KEYWORD_INTENTS: KeywordIntent[] = [
  {
    // NoorJyoti is a scripture-audio library, not a health service.
    intent: "health",
    href: null,
    keywords: [
      "health", "medical", "medicine", "doctor", "symptom", "symptoms",
      "diagnosis", "treatment", "illness", "disease", "therapy", "cure",
    ],
  },
  {
    intent: "library",
    href: "/library",
    keywords: [
      "library", "history", "bookmark", "bookmarks", "continue", "resume",
      "recent", "saved", "favorite", "favorites", "favourite", "favourites",
      "progress", "quota",
    ],
  },
  {
    intent: "unity",
    href: "/unity",
    keywords: ["unity", "quote", "quotes", "wisdom", "oneness", "theme", "themes"],
  },
  {
    intent: "profile",
    href: "/profile",
    keywords: [
      "profile", "settings", "setting", "preferences", "preference",
      "language", "languages", "voice", "voices", "account", "sign",
    ],
  },
  {
    intent: "explore",
    href: "/explore",
    keywords: [
      "explore", "browse", "discover", "tradition", "traditions", "faith",
      "faiths", "religion", "religions", "scriptures", "catalog", "all",
    ],
  },
  {
    intent: "home",
    href: "/",
    keywords: ["home", "listen", "play", "player", "today", "featured", "daily"],
  },
];

/** Lowercase, strip diacritics and punctuation, collapse whitespace. */
export function normalize(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(input: string): string[] {
  const n = normalize(input);
  return n ? n.split(" ") : [];
}

/** True when every word of `name` appears, in order, in `text`. */
function containsPhrase(text: string, name: string): boolean {
  const phrase = normalize(name);
  if (!phrase) return false;
  return ` ${text} `.includes(` ${phrase} `);
}

function bestNameMatch<T>(
  text: string,
  items: T[] | undefined,
  names: (item: T) => (string | undefined)[],
): T | undefined {
  let best: T | undefined;
  let bestLen = 0;
  for (const item of items ?? []) {
    for (const name of names(item)) {
      if (!name) continue;
      const len = normalize(name).length;
      if (len > bestLen && containsPhrase(text, name)) {
        best = item;
        bestLen = len;
      }
    }
  }
  return best;
}

/**
 * Route a free-text command to an existing screen.
 *
 * Priority: health notice → named scripture → named tradition → keyword
 * intent → unknown. Scriptures win over traditions so "play the bhagavad gita"
 * opens the scripture rather than the Hindu tradition page.
 */
export function routeCommand(input: string, catalog: JarvisCatalog = {}): JarvisRoute {
  const text = normalize(input);
  if (!text) return { intent: "unknown", href: null };
  const words = new Set(tokens(text));

  const health = KEYWORD_INTENTS[0];
  if (health.keywords.some((k) => words.has(k))) {
    return { intent: "health", href: null };
  }

  const scripture = bestNameMatch(text, catalog.scriptures, (s) => [s.name, s.originalName]);
  if (scripture) {
    return { intent: "scripture", href: `/scripture/${scripture.id}`, match: scripture.name };
  }

  const tradition = bestNameMatch(text, catalog.traditions, (t) => [t.name, t.slug.replace(/-/g, " ")]);
  if (tradition) {
    return {
      intent: "tradition",
      href: `/tradition/${encodeURIComponent(tradition.slug)}`,
      match: tradition.name,
    };
  }

  for (const entry of KEYWORD_INTENTS.slice(1)) {
    if (entry.keywords.some((k) => words.has(k))) {
      return { intent: entry.intent, href: entry.href };
    }
  }

  return { intent: "unknown", href: null };
}

/**
 * Jarvis command routing for the mobile app — pure, local keyword matching.
 *
 * Commands are matched entirely on the device; nothing typed here is sent to
 * any server or AI service. Every route returned is an existing expo-router
 * screen under `app/`. The mobile route table differs from the web one
 * (`artifacts/ekdharma/src/lib/jarvis-intents.ts`): here Library is catalog
 * browsing, listening history lives under Profile, and Paths / All Teachings
 * are mobile-only screens.
 *
 * Kept free of `@/` imports and non-erasable TS syntax so it runs under
 * `node --test` without a bundler.
 */

export type JarvisIntentId =
  | "home"
  | "paths"
  | "teachings"
  | "library"
  | "explore"
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
  /** expo-router path to push, or null when Jarvis should only reply. */
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
    // Profile holds history, bookmarks and favorites on mobile.
    intent: "profile",
    href: "/profile",
    keywords: [
      "profile", "history", "bookmark", "bookmarks", "continue", "resume",
      "recent", "saved", "favorite", "favorites", "favourite", "favourites",
      "progress", "account", "sign", "settings",
    ],
  },
  {
    intent: "paths",
    href: "/paths",
    keywords: [
      "path", "paths", "moment", "moments", "anxiety", "grief", "gratitude",
      "courage", "comfort", "guidance",
    ],
  },
  {
    intent: "teachings",
    href: "/all-teachings",
    keywords: ["teachings", "all", "scriptures", "catalog", "everything"],
  },
  {
    intent: "unity",
    href: "/unity",
    keywords: ["unity", "quote", "quotes", "wisdom", "oneness", "theme", "themes"],
  },
  {
    intent: "library",
    href: "/library",
    keywords: ["library", "books", "book", "read"],
  },
  {
    intent: "explore",
    href: "/explore",
    keywords: [
      "explore", "browse", "discover", "tradition", "traditions", "faith",
      "faiths", "religion", "religions", "language", "languages",
    ],
  },
  {
    intent: "home",
    href: "/",
    keywords: ["home", "listen", "play", "today", "featured", "daily"],
  },
];

/** Lowercase, strip Latin diacritics and punctuation, collapse whitespace. */
export function normalize(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
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
 * intent → unknown.
 */
export function routeCommand(input: string, catalog: JarvisCatalog = {}): JarvisRoute {
  const text = normalize(input);
  if (!text) return { intent: "unknown", href: null };
  const words = new Set(text.split(" "));

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

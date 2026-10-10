/**
 * UI copy for the Jarvis screen. The mobile app has no i18n layer yet, so all
 * Jarvis strings live here in one table to make future localisation a single
 * swap.
 */
export const jarvisStrings = {
  title: "Jarvis",
  caption: "Guide",
  subtitle: "Tell Jarvis where you want to go in the library.",
  inputLabel: "Command",
  inputPlaceholder: "Try “play the Bhagavad Gita”",
  submit: "Go",
  privacy:
    "Commands are matched on your device and are not sent to any server or AI service. Jarvis has no chat and no voice input.",
  suggestionsHeading: "Suggestions",
  suggestions: [
    "Choose a path",
    "Browse traditions",
    "Show my history",
    "Words of unity",
  ],
  unknown: "Jarvis didn't recognise that. Try naming a scripture or tradition, or tap a suggestion.",
  health:
    "NoorJyoti shares sacred texts for reflection only. It does not give medical or health advice — please speak with a qualified professional.",
  briefingHeading: "Today's briefing",
  briefingFeatured: "Daily wisdom",
  briefingContinue: "Continue listening",
  briefingQuote: "Word of unity",
  chapter: (n: number, title: string) => `Ch ${n}: ${title}`,
  skillsHeading: "What Jarvis can open",
  licensing: "All scripture texts are public domain. Narration is AI-generated.",
  homeCardTitle: "Ask Jarvis",
  homeCardBody: "Jump to any scripture, tradition or screen with a quick command.",
  skills: [
    { href: "/", icon: "home", label: "Home", description: "Traditions and daily light" },
    { href: "/paths", icon: "compass", label: "Paths", description: "Verses for life's moments" },
    { href: "/all-teachings", icon: "list", label: "All teachings", description: "Every scripture" },
    { href: "/library", icon: "book-open", label: "Library", description: "Open the books" },
    { href: "/unity", icon: "circle", label: "Unity", description: "Shared wisdom across faiths" },
    { href: "/profile", icon: "user", label: "Profile", description: "History, bookmarks, favorites" },
  ],
} as const;

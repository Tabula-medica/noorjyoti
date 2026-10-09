/**
 * UI copy for the Jarvis page. The inner web app has no i18n layer yet, so
 * all Jarvis strings live here in one table to make future localisation a
 * single swap.
 */
export const jarvisStrings = {
  title: "Jarvis",
  subtitle: "Your guide to the library. Tell Jarvis where you want to go.",
  inputLabel: "Command",
  inputPlaceholder: "Try “play the Bhagavad Gita” or “show my bookmarks”",
  submit: "Go",
  privacy:
    "Commands are matched on your device and are not sent to any server or AI service. Jarvis has no chat and no voice input.",
  suggestionsHeading: "Suggestions",
  suggestions: [
    "Browse all traditions",
    "Continue listening",
    "Words of unity",
    "Change narration voice",
  ],
  unknown: "Jarvis didn't recognise that. Try naming a scripture or tradition, or pick a suggestion.",
  health:
    "NoorJyoti shares sacred texts for reflection only. It does not give medical or health advice — please speak with a qualified professional.",
  opening: (target: string) => `Opening ${target}…`,
  briefingHeading: "Today's briefing",
  briefingFeatured: "Daily wisdom",
  briefingContinue: "Continue your journey",
  briefingQuote: "Word of unity",
  briefingEmpty: "Nothing to show yet.",
  chapter: (n: number, title: string) => `Ch ${n}: ${title}`,
  skillsHeading: "What Jarvis can open",
  licensing: "All scripture texts are public domain. Narration is AI-generated.",
  skills: {
    home: { label: "Listen", description: "Player and daily wisdom" },
    explore: { label: "Explore", description: "Every tradition and scripture" },
    library: { label: "Library", description: "History, bookmarks, favorites" },
    unity: { label: "Unity", description: "Shared wisdom across faiths" },
    profile: { label: "Profile", description: "Language and voice preferences" },
  },
} as const;

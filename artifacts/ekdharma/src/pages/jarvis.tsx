import { useState, type FormEvent } from "react";
import { Link, useLocation } from "wouter";
import {
  useListTraditions,
  useListScriptures,
  useGetFeatured,
  useListMyHistory,
  useListUnityQuotes,
} from "@workspace/api-client-react";
import { Sparkles, Home, Compass, Library, HeartHandshake, User, ArrowRight } from "lucide-react";
import { routeCommand } from "@/lib/jarvis-intents";
import { jarvisStrings as s } from "@/lib/jarvis-strings";

const SKILLS = [
  { key: "home", href: "/", icon: Home },
  { key: "explore", href: "/explore", icon: Compass },
  { key: "library", href: "/library", icon: Library },
  { key: "unity", href: "/unity", icon: HeartHandshake },
  { key: "profile", href: "/profile", icon: User },
] as const;

export default function Jarvis() {
  const [, setLocation] = useLocation();
  const { data: traditions } = useListTraditions();
  const { data: scriptures } = useListScriptures();
  const { data: featured } = useGetFeatured();
  const { data: history } = useListMyHistory();
  const { data: quotes } = useListUnityQuotes();

  const [command, setCommand] = useState("");
  const [reply, setReply] = useState<string | null>(null);

  function run(input: string) {
    const route = routeCommand(input, { traditions, scriptures });
    if (route.intent === "health") {
      setReply(s.health);
      return;
    }
    if (!route.href) {
      setReply(s.unknown);
      return;
    }
    const target =
      route.match ??
      (route.intent in s.skills ? s.skills[route.intent as keyof typeof s.skills].label : route.href);
    setReply(s.opening(target));
    setLocation(route.href);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (command.trim()) run(command);
  }

  const topFeatured = featured?.[0];
  const lastPlayed = history?.[0];
  const quote = quotes?.length ? quotes[new Date().getDate() % quotes.length] : undefined;

  return (
    <div className="flex-1 p-6 animate-in fade-in duration-500 relative z-10 pb-16">
      <h2 className="font-display text-2xl text-secondary tracking-widest mb-2 text-center uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" aria-hidden="true" /> {s.title}
      </h2>
      <p className="font-serif italic text-center text-sm text-foreground/70 mb-6">{s.subtitle}</p>

      {/* Command bar */}
      <form onSubmit={onSubmit} className="flex gap-2 mb-2" role="search">
        <label htmlFor="jarvis-command" className="sr-only">
          {s.inputLabel}
        </label>
        <input
          id="jarvis-command"
          type="text"
          autoComplete="off"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder={s.inputPlaceholder}
          className="flex-1 min-w-0 rounded-xl bg-card border border-primary/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary text-primary-foreground px-4 py-3 text-sm font-sans uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {s.submit}
        </button>
      </form>
      <p className="text-[11px] text-muted-foreground mb-4">{s.privacy}</p>

      <div aria-live="polite" className="min-h-[1.5rem] mb-4">
        {reply && <p className="text-sm text-foreground/90 font-serif italic">{reply}</p>}
      </div>

      {/* Suggestion chips */}
      <h3 className="font-sans text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-3 pl-1">
        {s.suggestionsHeading}
      </h3>
      <div className="flex flex-wrap gap-2 mb-8">
        {s.suggestions.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => {
              setCommand(chip);
              run(chip);
            }}
            className="rounded-full border border-primary/20 bg-card/50 px-3 py-1.5 text-xs text-foreground/90 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Briefing from existing catalog + listener endpoints */}
      <section aria-labelledby="jarvis-briefing" className="mb-8">
        <h3
          id="jarvis-briefing"
          className="font-sans text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-3 pl-1"
        >
          {s.briefingHeading}
        </h3>
        <div className="space-y-3">
          {lastPlayed && (
            <Link href={`/scripture/${lastPlayed.scriptureId}`} className="block">
              <div className="p-4 rounded-xl bg-card/50 border border-primary/10 hover:border-primary/30">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">{s.briefingContinue}</p>
                <p className="font-display text-sm text-foreground">{lastPlayed.scriptureName}</p>
                <p className="text-xs text-muted-foreground">
                  {s.chapter(lastPlayed.chapterNumber, lastPlayed.chapterTitle)}
                </p>
              </div>
            </Link>
          )}
          {topFeatured && (
            <Link href={`/scripture/${topFeatured.scriptureId}`} className="block">
              <div className="p-4 rounded-xl bg-card/50 border border-primary/10 hover:border-primary/30">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">{s.briefingFeatured}</p>
                <p className="font-serif italic text-sm text-foreground/90">{topFeatured.tagline}</p>
                <p className="text-xs text-muted-foreground">
                  {topFeatured.traditionName} • {topFeatured.scriptureName}
                </p>
              </div>
            </Link>
          )}
          {quote && (
            <Link href="/unity" className="block">
              <div className="p-4 rounded-xl bg-card/50 border border-primary/10 hover:border-primary/30">
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary mb-1">{s.briefingQuote}</p>
                <p className="font-serif italic text-sm text-foreground/90">“{quote.quote}”</p>
                <p className="text-xs text-muted-foreground">— {quote.attribution}</p>
              </div>
            </Link>
          )}
          {!lastPlayed && !topFeatured && !quote && (
            <p className="text-sm text-muted-foreground">{s.briefingEmpty}</p>
          )}
        </div>
      </section>

      {/* Skills grid — existing screens only */}
      <section aria-labelledby="jarvis-skills">
        <h3
          id="jarvis-skills"
          className="font-sans text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-3 pl-1"
        >
          {s.skillsHeading}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {SKILLS.map(({ key, href, icon: Icon }) => (
            <Link key={key} href={href} className="block">
              <div className="h-full p-4 rounded-xl bg-card/50 border border-primary/10 hover:border-primary/30 group">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4 text-secondary" aria-hidden="true" />
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                </div>
                <p className="font-display text-sm text-foreground">{s.skills[key].label}</p>
                <p className="text-xs text-muted-foreground">{s.skills[key].description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground text-center mt-8">{s.licensing}</p>
    </div>
  );
}

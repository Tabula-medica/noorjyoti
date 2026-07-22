import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Play, Headphones, Globe, Heart, Sparkles, 
  BookOpen, Music, Share2, Mail, ArrowRight,
  Star, Users, Clock, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

/* ── SEO Component ── */
function SEOHead({ title, description, canonical, structuredData }) {
  useEffect(() => {
    document.title = title;
    const metas = [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ];
    metas.forEach(m => {
      let el = document.querySelector(`meta[${m.name ? "name" : "property"}=\"${m.name || m.property}\"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(m.name ? "name" : "property", m.name || m.property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", m.content);
    });
    if (structuredData) {
      let ld = document.getElementById("noorjyoti-ld");
      if (!ld) { ld = document.createElement("script"); ld.id = "noorjyoti-ld"; ld.type = "application/ld+json"; document.head.appendChild(ld); }
      ld.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, canonical, structuredData]);
  return null;
}

/* ── Tradition Card ── */
function TraditionCard({ name, nativeName, description, color, icon: Icon, scriptureCount, languageCount, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4`} style={{ backgroundColor: color + "15" }}>
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1">{name}</h3>
      <p className="text-sm text-slate-500 mb-2 font-medium">{nativeName}</p>
      <p className="text-sm text-slate-600 leading-relaxed mb-4">{description}</p>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {scriptureCount} scriptures</span>
        <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {languageCount} languages</span>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="w-5 h-5 text-slate-400" />
      </div>
    </motion.div>
  );
}

/* ── Testimonial ── */
function Testimonial({ quote, name, location, tradition }) {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-100">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-slate-700 text-sm leading-relaxed mb-4 italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{location} · {tradition}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Stats Counter ── */
function StatCounter({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon className="w-6 h-6 text-amber-500 mb-2" />
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

export default function PublicHome() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const traditions = [
    { name: "Hinduism", nativeName: "हिन्दू धर्म", description: "Bhagavad Gita, Upanishads, Vedas — ancient wisdom for modern seekers", color: "#FF6B35", icon: BookOpen, scriptureCount: 12, languageCount: 18 },
    { name: "Buddhism", nativeName: "बौद्ध धर्म", description: "Tripitaka, Dhammapada, Heart Sutra — the path to enlightenment", color: "#8B5CF6", icon: Sparkles, scriptureCount: 8, languageCount: 15 },
    { name: "Christianity", nativeName: "Christianity", description: "Bible, Gospels, Psalms — love, hope, and redemption", color: "#3B82F6", icon: Heart, scriptureCount: 15, languageCount: 22 },
    { name: "Islam", nativeName: "الإسلام", description: "Quran, Hadith, Sufi poetry — submission to the divine", color: "#10B981", icon: Star, scriptureCount: 6, languageCount: 12 },
    { name: "Judaism", nativeName: "יהדות", description: "Torah, Talmud, Psalms — covenant and commandment", color: "#F59E0B", icon: BookOpen, scriptureCount: 9, languageCount: 10 },
    { name: "Sikhism", nativeName: "ਸਿੱਖੀ", description: "Guru Granth Sahib — one light, many lamps", color: "#EC4899", icon: Sparkles, scriptureCount: 5, languageCount: 8 },
    { name: "Jainism", nativeName: "जैन धर्म", description: "Agamas, Tattvartha Sutra — non-violence and truth", color: "#6366F1", icon: Heart, scriptureCount: 4, languageCount: 6 },
    { name: "Taoism", nativeName: "道教", description: "Tao Te Ching, Zhuangzi — the way of harmony", color: "#14B8A6", icon: BookOpen, scriptureCount: 3, languageCount: 8 },
  ];

  const testimonials = [
    { quote: "NoorJyoti helped me understand the Quran and Bhagavad Gita side by side. The unity is beautiful.", name: "Aisha R.", location: "London, UK", tradition: "Islam & Hinduism" },
    { quote: "I play the bedtime stories for my kids every night. They now know Ramayana AND Noah's Ark.", name: "David K.", location: "Toronto, Canada", tradition: "Christianity & Hinduism" },
    { quote: "As a meditation teacher, NoorJyoti is my go-to resource for multi-tradition guided sessions.", name: "Priya M.", location: "Bangalore, India", tradition: "Buddhism & Hinduism" },
    { quote: "The audio quality is incredible. It feels like the narrator is sitting right next to me.", name: "Sarah L.", location: "New York, USA", tradition: "Judaism" },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NoorJyoti",
    "url": "https://noorjyoti.app",
    "description": "A sanctuary for sacred listening. Explore the world's wisdom traditions in a calm, reverent space.",
    "publisher": {
      "@type": "Organization",
      "name": "NoorJyoti",
      "logo": { "@type": "ImageObject", "url": "https://noorjyoti.app/logo.png" }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://noorjyoti.app/library?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead 
        title="NoorJyoti — Sacred Listening for Every Faith"
        description="Explore the world's wisdom traditions in a calm, reverent space. Bhagavad Gita, Quran, Bible, Torah, Tripitaka & more in 20+ languages."
        canonical="https://noorjyoti.app"
        structuredData={structuredData}
      />

      {/* ── Navigation ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">NoorJyoti</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/library" className="text-sm text-slate-600 hover:text-slate-900">Library</Link>
              <Link href="/traditions" className="text-sm text-slate-600 hover:text-slate-900">Traditions</Link>
              <Link href="/unity" className="text-sm text-slate-600 hover:text-slate-900">Unity</Link>
              <a href="#download" className="text-sm text-slate-600 hover:text-slate-900">Download App</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/listen" className="hidden sm:flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                <Headphones className="w-4 h-4" /> Listen Now
              </Link>
              <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-5">
                <Link href="/early-access">Get Early Access</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 via-white to-white pt-16 pb-24">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-amber-200 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                <Globe className="w-3.5 h-3.5" />
                8 Traditions · 20+ Languages · Free Forever
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                A sanctuary for<br />
                <span className="text-amber-600 italic">sacred listening</span>.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                Explore the world's wisdom traditions in a calm, reverent space — 
                every faith honored equally, every voice given the same light.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-8 h-14 text-base">
                  <Link href="/library">
                    <Play className="w-5 h-5 mr-2" /> Start Listening
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-base border-slate-200">
                  <Link href="/traditions">Explore Traditions</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                <StatCounter icon={BookOpen} value="50+" label="Sacred Texts" />
                <StatCounter icon={Globe} value="20+" label="Languages" />
                <StatCounter icon={Headphones} value="10K+" label="Audio Hours" />
                <StatCounter icon={Users} value="5K+" label="Listeners" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Traditions Grid ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Sacred Texts</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Eight paths, one light
            </h2>
            <p className="text-slate-600 text-lg">
              From the Bhagavad Gita to the Tao Te Ching — discover wisdom that transcends borders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {traditions.map((t, i) => (
              <Link key={t.name} href={`/tradition/${t.name.toLowerCase()}`}>
                <TraditionCard {...t} delay={i * 0.05} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Listen, learn, and grow
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose Your Path", desc: "Browse by tradition, scripture, or language. Filter by narrator, length, or theme.", icon: Globe },
              { step: "02", title: "Immerse Yourself", desc: "High-quality audio with synchronized text. Adjust speed, bookmark verses, and take notes.", icon: Headphones },
              { step: "03", title: "Share the Light", desc: "Share verses with friends, create playlists, and join discussions across traditions.", icon: Share2 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="text-6xl font-bold text-amber-100 mb-4">{item.step}</div>
                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-semibold uppercase tracking-wider">Community</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Voices from around the world
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Testimonial {...t} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Download ── */}
      <section id="download" className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-wider">Mobile App</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">
                Sacred wisdom in your pocket
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Download NoorJyoti for iOS or Android. Listen offline, create playlists, 
                and get daily verse notifications — all for free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://apps.apple.com/app/noorjyoti" className="inline-flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors">
                  <Download className="w-6 h-6" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.noorjyoti" className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                  <Download className="w-6 h-6" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-slate-800 rounded-3xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Now Playing</div>
                    <div className="text-xs text-slate-400">Bhagavad Gita · Chapter 2</div>
                  </div>
                </div>
                <div className="h-2 bg-slate-700 rounded-full mb-2">
                  <div className="h-2 bg-amber-500 rounded-full w-1/3" />
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>4:32</span>
                  <span>12:45</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-24 bg-amber-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Mail className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Daily wisdom in your inbox
          </h2>
          <p className="text-slate-600 mb-8">
            Get a verse from a different tradition every morning. No spam, just light.
          </p>

          {!submitted ? (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-l-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button type="submit" className="bg-amber-500 text-white px-6 py-3 rounded-r-xl font-semibold text-sm hover:bg-amber-600 transition-colors">
                Subscribe
              </button>
            </form>
          ) : (
            <div className="bg-white border border-amber-200 text-amber-800 px-6 py-3 rounded-xl inline-block">
              ✨ Welcome to the light! Check your inbox.
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-white">NoorJyoti</span>
              </div>
              <p className="text-sm leading-relaxed">
                A sanctuary for sacred listening. Explore the world's wisdom traditions 
                in a calm, reverent space.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/library" className="hover:text-white transition-colors">Library</Link></li>
                <li><Link href="/traditions" className="hover:text-white transition-colors">Traditions</Link></li>
                <li><Link href="/unity" className="hover:text-white transition-colors">Unity</Link></li>
                <li><Link href="/listen" className="hover:text-white transition-colors">Listen Now</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://instagram.com/noorjyoti" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://youtube.com/noorjyoti" className="hover:text-white transition-colors">YouTube</a></li>
                <li><a href="https://twitter.com/noorjyoti" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="https://tiktok.com/@noorjyoti" className="hover:text-white transition-colors">TikTok</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/early-access" className="hover:text-white transition-colors">Early Access</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs">© 2026 NoorJyoti. All rights reserved.</p>
            <p className="text-xs text-slate-500">Made with 💛 for all seekers of light.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

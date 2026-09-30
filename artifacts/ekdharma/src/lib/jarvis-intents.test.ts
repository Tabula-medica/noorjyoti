import { test } from "node:test";
import assert from "node:assert/strict";
import { normalize, routeCommand, type JarvisCatalog } from "./jarvis-intents.ts";

const catalog: JarvisCatalog = {
  traditions: [
    { slug: "hinduism", name: "Hinduism" },
    { slug: "sikhism", name: "Sikhism" },
    { slug: "buddhism", name: "Buddhism" },
  ],
  scriptures: [
    { id: 1, name: "Bhagavad Gita", originalName: "भगवद्गीता" },
    { id: 2, name: "Guru Granth Sahib" },
    { id: 3, name: "Dhammapada" },
    { id: 4, name: "Gita Govinda" },
  ],
};

test("normalize strips case, punctuation and diacritics", () => {
  assert.equal(normalize("  Play the QURĀN!! "), "play the quran");
  assert.equal(normalize(""), "");
});

test("empty input is unknown", () => {
  assert.deepEqual(routeCommand("   "), { intent: "unknown", href: null });
});

test("keyword intents route to existing screens", () => {
  assert.equal(routeCommand("browse all traditions").href, "/explore");
  assert.equal(routeCommand("continue where I left off").href, "/library");
  assert.equal(routeCommand("show my bookmarks").href, "/library");
  assert.equal(routeCommand("unity quotes").href, "/unity");
  assert.equal(routeCommand("change my voice").href, "/profile");
  assert.equal(routeCommand("go home").href, "/");
});

test("named scripture wins over tradition and keywords", () => {
  const r = routeCommand("play the Bhagavad Gita", catalog);
  assert.deepEqual(r, { intent: "scripture", href: "/scripture/1", match: "Bhagavad Gita" });
});

test("longest scripture name wins", () => {
  assert.equal(routeCommand("gita govinda please", catalog).href, "/scripture/4");
});

test("original-script scripture names match", () => {
  assert.equal(routeCommand("भगवद्गीता", catalog).href, "/scripture/1");
});

test("partial words do not match scripture names", () => {
  // "gita" alone is not the full name of any scripture.
  assert.equal(routeCommand("gita", catalog).intent, "unknown");
});

test("named tradition routes to tradition page", () => {
  assert.deepEqual(routeCommand("explore sikhism", catalog), {
    intent: "tradition",
    href: "/tradition/sikhism",
    match: "Sikhism",
  });
});

test("health questions get a notice, never a route", () => {
  assert.deepEqual(routeCommand("medical advice for my symptoms", catalog), {
    intent: "health",
    href: null,
  });
});

test("unmatched input is unknown", () => {
  assert.equal(routeCommand("what is the weather", catalog).intent, "unknown");
});

test("works without a catalog", () => {
  assert.equal(routeCommand("dhammapada").intent, "unknown");
  assert.equal(routeCommand("library").href, "/library");
});

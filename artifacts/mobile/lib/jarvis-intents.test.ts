import { test } from "node:test";
import assert from "node:assert/strict";
import { normalize, routeCommand, type JarvisCatalog } from "./jarvis-intents.ts";

const catalog: JarvisCatalog = {
  traditions: [
    { slug: "hinduism", name: "Hinduism" },
    { slug: "sikhism", name: "Sikhism" },
  ],
  scriptures: [
    { id: 1, name: "Bhagavad Gita", originalName: "भगवद्गीता" },
    { id: 2, name: "Guru Granth Sahib" },
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

test("keyword intents route to existing mobile screens", () => {
  assert.equal(routeCommand("go home").href, "/");
  assert.equal(routeCommand("choose a path").href, "/paths");
  assert.equal(routeCommand("verses for grief").href, "/paths");
  assert.equal(routeCommand("show all teachings").href, "/all-teachings");
  assert.equal(routeCommand("open the library").href, "/library");
  assert.equal(routeCommand("browse traditions").href, "/explore");
  assert.equal(routeCommand("unity quotes").href, "/unity");
});

test("history and bookmarks go to Profile on mobile", () => {
  assert.equal(routeCommand("continue where I left off").href, "/profile");
  assert.equal(routeCommand("show my bookmarks").href, "/profile");
});

test("named scripture wins over tradition and keywords", () => {
  assert.deepEqual(routeCommand("play the Bhagavad Gita", catalog), {
    intent: "scripture",
    href: "/scripture/1",
    match: "Bhagavad Gita",
  });
});

test("longest scripture name wins", () => {
  assert.equal(routeCommand("gita govinda please", catalog).href, "/scripture/4");
});

test("original-script scripture names match", () => {
  assert.equal(routeCommand("भगवद्गीता", catalog).href, "/scripture/1");
});

test("named tradition routes to tradition screen", () => {
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

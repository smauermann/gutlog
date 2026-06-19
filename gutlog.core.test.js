import { test, expect } from "bun:test";
import Core from "./gutlog.core.js";

const { severity, isFlare, avgPerDay, detectFlare, dailySeries } = Core;

const DAY = 864e5;
const HOUR = 3600e3;
const NOW = 1_700_000_000_000; // fixed reference time so tests are deterministic

// Minimal bowel-movement entry; override only the fields a test cares about.
const bm = (over = {}) => ({
  kind: "bm", ts: NOW, bristol: 4, urgency: "none", blood: "none", mucus: "no", pain: 0, ...over,
});

test("severity: a typical type-4 with no other signs scores 0", () => {
  expect(severity(bm({ bristol: 4 }))).toBe(0);
});

test("severity: hard and loose stool types add their weights", () => {
  expect(severity(bm({ bristol: 1 }))).toBeCloseTo(1);
  expect(severity(bm({ bristol: 6 }))).toBeCloseTo(1.5);
  expect(severity(bm({ bristol: 7 }))).toBeCloseTo(2.2);
});

test("severity: blood, mucus, urgency and pain accumulate", () => {
  expect(severity(bm({ blood: "trace" }))).toBeCloseTo(1);
  expect(severity(bm({ blood: "visible" }))).toBeCloseTo(2.2);
  expect(severity(bm({ mucus: "yes" }))).toBeCloseTo(0.6);
  expect(severity(bm({ urgency: "mild" }))).toBeCloseTo(0.5);
  expect(severity(bm({ urgency: "urgent" }))).toBeCloseTo(1.2);
  expect(severity(bm({ pain: 10 }))).toBeCloseTo(1.6);
});

test("isFlare: visible blood always flags, regardless of score", () => {
  expect(isFlare(bm({ bristol: 4, blood: "visible" }))).toBe(true);
});

test("isFlare: a high enough severity score flags", () => {
  // type 7 (2.2) + urgent (1.2) = 3.4 >= 3.2
  expect(isFlare(bm({ bristol: 7, urgency: "urgent" }))).toBe(true);
});

test("isFlare: a calm entry does not flag", () => {
  expect(isFlare(bm({ bristol: 4 }))).toBe(false);
});

test("isFlare: non-bm entries never flag", () => {
  expect(isFlare({ kind: "recall", blood: "visible" })).toBe(false);
});

test("avgPerDay: returns null below four movements", () => {
  expect(avgPerDay([bm(), bm(), bm()], NOW)).toBeNull();
});

test("avgPerDay: four movements today average over a one-day span", () => {
  const today = [
    bm({ ts: NOW }), bm({ ts: NOW - HOUR }), bm({ ts: NOW - 2 * HOUR }), bm({ ts: NOW - 3 * HOUR }),
  ];
  expect(avgPerDay(today, NOW)).toBe(4);
});

test("detectFlare: returns null with no movements", () => {
  expect(detectFlare([], NOW)).toBeNull();
});

test("detectFlare: flags blood when the latest movement has visible blood", () => {
  expect(detectFlare([bm({ ts: NOW, blood: "visible" })], NOW)).toContain("blood");
});

test("detectFlare: flags looser stools when recent movements are type >= 6", () => {
  const recent = [
    bm({ ts: NOW, bristol: 6 }), bm({ ts: NOW - HOUR, bristol: 6 }), bm({ ts: NOW - 2 * HOUR, bristol: 7 }),
  ];
  expect(detectFlare(recent, NOW)).toContain("looser stools");
});

test("detectFlare: returns null for a calm, spread-out history", () => {
  const calm = [
    bm({ ts: NOW }), bm({ ts: NOW - 2 * DAY }), bm({ ts: NOW - 4 * DAY }), bm({ ts: NOW - 6 * DAY }),
  ];
  expect(detectFlare(calm, NOW)).toBeNull();
});

// Place test entries at midday of the function's own bucket timestamps so the
// assertions hold regardless of the machine's timezone (no midnight/DST edges).
const buckets = (range) => dailySeries([], range, NOW).days;
const noon = (range, i) => buckets(range)[i].ts + 12 * HOUR;

test("dailySeries: empty input yields one 'none' bucket per day, avg 0", () => {
  const r = dailySeries([], 30, NOW);
  expect(r.days.length).toBe(30);
  expect(r.total).toBe(0);
  expect(r.avg).toBe(0);
  expect(r.days.every(d => d.count === 0 && d.status === "none")).toBe(true);
});

test("dailySeries: a day's status is its worst (flare > loose > healthy)", () => {
  const entries = [
    bm({ ts: noon(7, 6), bristol: 4 }),                      // healthy
    bm({ ts: noon(7, 6), bristol: 7 }),                      // loose
    bm({ ts: noon(7, 6), bristol: 7, blood: "visible" }),    // flare
  ];
  const r = dailySeries(entries, 7, NOW);
  expect(r.days[6].count).toBe(3);
  expect(r.days[6].status).toBe("flare");
});

test("dailySeries: healthy vs looser classification by Bristol", () => {
  expect(dailySeries([bm({ ts: noon(7, 3), bristol: 4 })], 7, NOW).days[3].status).toBe("healthy");
  expect(dailySeries([bm({ ts: noon(7, 3), bristol: 6 })], 7, NOW).days[3].status).toBe("loose");
});

test("dailySeries: zero-movement days stay gaps (count 0, status none)", () => {
  const r = dailySeries([bm({ ts: noon(7, 2) }), bm({ ts: noon(7, 5) })], 7, NOW);
  expect(r.days.filter(d => d.count === 0).length).toBe(5);
  expect(r.days[2].count).toBe(1);
  expect(r.days[5].count).toBe(1);
});

test("dailySeries: entries older than the window are excluded", () => {
  const firstBucketStart = buckets(30)[0].ts;
  const inWindow = firstBucketStart + 12 * HOUR;  // oldest visible day
  const before = firstBucketStart - 12 * HOUR;    // half a day before the window
  const r = dailySeries([bm({ ts: inWindow }), bm({ ts: before })], 30, NOW);
  expect(r.total).toBe(1);
  expect(r.days[0].count).toBe(1);
});

test("dailySeries: avg divides by elapsed days, not the full range", () => {
  // 4 movements across the last two days of a 30-day range -> avg 2, not 4/30
  const entries = [
    bm({ ts: noon(30, 28) }), bm({ ts: noon(30, 28) }),
    bm({ ts: noon(30, 29) }), bm({ ts: noon(30, 29) }),
  ];
  const r = dailySeries(entries, 30, NOW);
  expect(r.total).toBe(4);
  expect(r.avg).toBe(2);
});

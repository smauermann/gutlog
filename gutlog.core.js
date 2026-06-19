/* Gutlog core — pure symptom logic, shared by the app and its test suite.
   Plain classic script (no build step, loads from file://): exposes globalThis.GutlogCore.
   Also exported via CommonJS so `bun test` can import the same code. */
(function (root) {
  "use strict";

  /* Severity score for one bowel-movement entry. Higher = worse. */
  function severity(e) {
    let s = 0;
    if (e.bristol <= 2) s += 1;
    if (e.bristol === 6) s += 1.5;
    if (e.bristol === 7) s += 2.2;
    if (e.blood === "trace") s += 1; else if (e.blood === "visible") s += 2.2;
    if (e.mucus === "yes") s += 0.6;
    if (e.urgency === "mild") s += 0.5; else if (e.urgency === "urgent") s += 1.2;
    s += (Number(e.pain) || 0) / 10 * 1.6;
    return s;
  }

  function isFlare(e) {
    return e.kind === "bm" && (e.blood === "visible" || severity(e) >= 3.2);
  }

  /* Baseline movements/day over a trailing ~14d window; null until enough data.
     bms: array of bm entries; now: epoch ms. */
  function avgPerDay(bms, now) {
    if (bms.length < 4) return null;
    const span = Math.min(14, Math.max(1, Math.ceil((now - Math.min(...bms.map(e => e.ts))) / 864e5)));
    const since = now - span * 864e5;
    return bms.filter(e => e.ts >= since).length / span;
  }

  /* Does "right now" look worse than usual, and why? Returns reasons[] or null.
     bms: array of bm entries; now: epoch ms. */
  function detectFlare(bms, now) {
    const b = bms.slice().sort((a, b) => b.ts - a.ts);
    if (!b.length) return null;
    const reasons = [];
    const last24 = b.filter(e => e.ts >= now - 864e5).length;
    const avg = avgPerDay(b, now);
    const freqThresh = avg != null ? Math.max(3, Math.round(avg * 1.8)) : 4;
    if (last24 >= freqThresh) reasons.push("more frequent (" + last24 + " in 24 h)");
    const recent3 = b.slice(0, 3);
    if (recent3.length >= 2 && recent3.filter(e => e.bristol >= 6).length >= 2) reasons.push("looser stools");
    if (b[0].blood === "visible") reasons.push("blood");
    if (b[0].bristol === 7 && last24 >= 2) reasons.push("watery stools");
    return reasons.length ? reasons : null;
  }

  const pad2 = n => String(n).padStart(2, "0");
  const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate()); };

  /* Per-day buckets for the trend chart over the trailing `rangeDays` (today included).
     Returns { days:[{key, ts, count, status}], total, avg }. status is the day's worst:
     "flare" > "loose" (Bristol >= 5) > "healthy" > "none" (no movements -> a gap).
     avg = movements per *elapsed* day (first logged day .. today), not a flat denominator,
     so calm zero-movement days still count but pre-tracking emptiness doesn't drag it down. */
  function dailySeries(entries, rangeDays, now) {
    const RANK = { none: 0, healthy: 1, loose: 2, flare: 3 };
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    const days = [], idx = {};
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(start); d.setDate(start.getDate() - i);
      idx[dayKey(d.getTime())] = days.length;
      days.push({ key: dayKey(d.getTime()), ts: d.getTime(), count: 0, status: "none" });
    }
    for (const e of entries) {
      if (e.kind !== "bm") continue;
      const b = days[idx[dayKey(e.ts)]];
      if (!b) continue;
      b.count++;
      const c = isFlare(e) ? "flare" : (e.bristol >= 5 ? "loose" : "healthy");
      if (RANK[c] > RANK[b.status]) b.status = c;
    }
    const total = days.reduce((s, d) => s + d.count, 0);
    const firstIdx = days.findIndex(d => d.count > 0);
    const elapsed = firstIdx < 0 ? 0 : days.length - firstIdx;
    return { days, total, avg: elapsed > 0 ? total / elapsed : 0 };
  }

  const Core = { severity, isFlare, avgPerDay, detectFlare, dailySeries };

  if (typeof module !== "undefined" && module.exports) module.exports = Core;
  else root.GutlogCore = Core;
})(typeof globalThis !== "undefined" ? globalThis : this);

# Research: how IBD patients actually track symptoms

- **Source:** r/CrohnsDisease — ["How do you actually keep track of your symptoms? (or do you?)"](https://www.reddit.com/r/CrohnsDisease/comments/1u96l5h/)
- **Captured:** 2026-06-20 (24 comments at time of reading)
- **Why it exists:** the thread was our own ask-for-feedback post; this note preserves what came back so the signal outlives the thread. Directly informed PRD 1 (#9) and PRD 2 (#8).

## TL;DR

The dominant theme is **friction → abandonment**: every tool people quit, they quit because it was too much work. The tools people keep share three traits — fast to log in the moment (on the toilet), forgiving about gaps, and producing a **graph they can show their care team**. People are also skeptical that tracking reveals food triggers, because triggers are context-dependent and partly random — so a tool should frame food correlations as *suspects, not verdicts*.

## Findings

### 1. Friction is the #1 reason people abandon tracking
- **tuubesoxx** — Guava "was exhausting (also I have ADHD so hard to get any system to work right)"; dropped logging, kept it only for med reminders.
- OP (us) — "I always mean to do it in the moment and then forget."
- **PuzzleheadedGoal8234** — MYIBS stuck *because* "since it was on my phone I can input the data while I was sitting on the toilet."

→ Validates **PRD 2 (#8)**: minimise fields, log in one or two taps, optimise for one-handed/in-the-moment.

### 2. The graph is the payoff — and it's for the doctor
- **PuzzleheadedGoal8234** — MYIBS "makes graphs of that data to show patterns for you over a week, a month, three months… The graphing option was extremely helpful, so if you are designing for that I'd highly recommend it. I can show my team a quick visual in an appointment with patterns."
- **Romeo_Jordan** (mysymptoms, 6 yrs) — "It gives me a bit of control and I can use it when speaking to my medical team."
- **blueboy714** (notebook) — logs wake/sleep, meals, BM time + appearance, feelings; "really helpful trying to figure out what foods my gut tolerates."

→ Validates **PRD 1 (#9)** trend chart, and specifically the **Week / Month / 3-month** ranges (MYIBS uses the same and users praised it). Printable summary for appointments is on-target.

### 3. "Only track when you're off-baseline" — a recurring philosophy
- **Iylivarae** — "I don't [track]. When I'm flaring I clearly notice, and if I'm not, I want to spend as little time as possible on the disease."
- **Nice_Whereas_9273** (fathom) — "I usually just record anything that is above my baseline" — fatigue/pain worse than the everyday, symptoms before/after a Tremfya shot.
- OP reply — "you don't need to track all the time, just when you're not feeling well. Maybe that takes some pressure off."

→ **Not yet exploited.** Gutlog has a "your usual" baseline band and a "rough patch → log what you ate" entry point, but the *logging model* could lean into "log deviations, not everything." Candidate for a future PRD.

### 4. Guilt-free / partial logging keeps people in
- **Nice_Whereas_9273** — "I'm also nice to myself if I don't track stuff because life is hard 😂"
- OP reply — "Missing a day or three is no reason to drop the tracking entirely. Perfect is the enemy of done."

→ Already reflected in PRD 2's framing (partial logging is normal, not an error).

### 5. The regular/urgent split comes from a real low-tech system
- **Kind_Yesterday1739** — "Two golf clickers. One for the regular movements, and one for the urgent movements."

→ Origin of the Normal/Urgent distinction shipped in #8.

### 6. Be honest about food triggers — don't over-promise
- **Iylivarae** — triggers are context-dependent (fiber tolerance shifts with flares) and for some things "there's just a random element involved and that no amount of tracking leads to a clear cause."
- **Unhappy-Pace-2393** — "the stuff that makes the most gas also inflames me the most"; carrots, oily foods, veggies as personal triggers.
- **ForsakenCan3317** (OP) — wants to "identify triggers asap," but the thread tempers how reliably that's possible.

→ Backs Gutlog's existing **"suspects, not verdicts / memory aid, not proof"** framing on the foods view. Resist any UI that implies a confirmed cause.

## Apps & methods people mentioned

| Tool | Mentioned by | Note |
|---|---|---|
| MYIBS | PuzzleheadedGoal8234 | Free; bowel/meds/symptoms/mental health/notes; **graphs over W/M/3M** — strongest praise |
| mysymptoms | Romeo_Jordan | General (not IBD-specific); 6 years of use; good for medical team |
| fathom | Nice_Whereas_9273 | Baseline-deviation logging; tracks around biologic shots |
| Bowelle | dar512 | iPhone; BM + food pattern spotting |
| Guava | tuubesoxx | "Exhausting"; abandoned for logging, kept for med reminders |
| remissia | littleGreenMeanie | Collaborator; Google Play; transparent about security |
| Notebook (analog) | blueboy714, Unhappy-Pace-2393 | Still common; high consistency for some |
| Two golf clickers | Kind_Yesterday1739 | Regular vs urgent movements |

## Opportunities not yet in a PRD

1. **Baseline-deviation logging mode** — surface logging primarily when something is worse than usual (theme #3). Could cut the everyday-chore feeling.
2. **Medication logging + injection cycles** — meds/reminders recur (tuubesoxx, Romeo_Jordan), and tracking symptoms before/after a biologic shot (Nice_Whereas_9273) is a concrete pattern. Currently out of scope in #8.

## Caveats

- n ≈ 1 thread, self-selected responders, small sample. Treat as directional, not representative.
- Our own post seeded the thread, so there's some framing bias toward the problems Gutlog already targets.

# MentraFlow — Marketing & UI Recommendations

## 1. Writeup & copy

### Hero
- **Current:** "MentraFlow" + "From training to demonstrated capability" + one long line.
- **Suggestions:**
  - Lead with the **stakes**: e.g. *"When the wrong decision has real consequences."* or *"Training completed. But can they decide?"*
  - Keep the payoff line short: *"From training completion to demonstrated decision capability."*
  - Add a **single proof point** if you have it: e.g. *"Pilots in financial services compliance."* or *"8–12 week pilots from $75/learner."*

### Problem (“The moment that matters”)
- Make the **moment** concrete. Instead of only abstract “failure point,” add a one-liner that paints the scene:
  - *"A flagged wire. A borderline case. An auditor asking why."*
- Shorten the second paragraph; end on the shift: *"We focus on that moment—realistic scenarios, real decisions, real reasoning."*

### Solution
- Headline is good; consider tightening to: *"Decision-ready, not just trained."*
- One clear **before/after**: e.g. *"Not ‘Did they complete the module?’ but ‘Can they make the right call when it matters?’"*

### Outcomes
- If you have **numbers** (e.g. % improvement, time to competency), lead with one in a big stat.
- If no numbers yet, keep outcome cards but add a line: *"Pilots in AML and transaction monitoring—where decisions are frequent and measurable."*

### CTAs
- Replace generic *"Get started"* with intent-based options where possible:
  - Primary: *"See how it works"* or *"Book a pilot"* (if you have a contact/demo flow).
  - Secondary: *"Read the FAQ"* or *"Who it’s for."*
- Final CTA section: one clear ask (e.g. *"Talk to us about a pilot"*) and one short line on who it’s for.

### FAQ
- Add a short intro: *"For compliance and risk teams, leadership, and implementation partners."*
- Consider grouping: **What it is** | **Who it’s for** | **How it works** | **Pricing & pilots**.

---

## 2. UI & visual impact

### What’s working
- Clear section structure (hero → about → problem → solution → outcomes → CTA).
- Brand colors and theme constants are in place.
- Responsive behavior and carousels on mobile.

### What’s hurting impact
1. **Hero feels generic** — Gradient + dot grid + floating icons reads like a standard SaaS template; it doesn’t convey “regulated,” “consequences,” or “decision moment.”
2. **Everything looks the same** — Gray-50 cards, same border, same padding. No clear visual hierarchy or “hero” block inside the page.
3. **Typography is flat** — One weight and similar sizes; no strong display treatment for the one line that should stick.
4. **Outcomes blend in** — Same card style as features; outcomes should feel like proof (bolder, or with a stat).
5. **No clear “anchor”** — One section could be full-bleed or use a strong accent (e.g. dark bar, or a single bold stat) to break the rhythm.

### High-impact changes (in order)

| Priority | Change | Why |
|----------|--------|-----|
| 1 | **Hero:** One sharp headline (stakes) + one short payoff line. Remove or simplify floating icons; optional: darker, calmer gradient or solid dark bar. | First 3 seconds set tone; “decision/consequences” should land before the product name. |
| 2 | **One “statement” section** — e.g. a full-width bar (dark teal/indigo) with a single sentence: *"The failure point isn’t training. It’s the moment of decision."* | Gives the page a clear beat and a quotable line. |
| 3 | **Outcomes ≠ Features** — Different layout or treatment: e.g. 3 columns with a number or icon emphasis, or a single row with larger type. | Outcomes should feel like proof, not another feature list. |
| 4 | **Cards:** Slightly more contrast — e.g. white cards on a very light gray/teal tint, or one accent card (e.g. “Why not LLM?”) with a stronger border/background. | Reduces “wall of gray” and adds hierarchy. |
| 5 | **Footer CTA:** If the main CTA is “Contact us” or “Book a pilot,” repeat it in the footer with a short line. | One more conversion point without clutter. |

### Typography
- **Headlines:** Consider a slightly bolder or more distinct font for H1 and key H2s (e.g. one weight heavier, or a single display font for the hero only).
- **Line length:** Cap body copy around 65–75 characters where possible (you’re close; a bit more `max-w-2xl` on paragraphs helps).

### Accessibility & polish
- Ensure focus states are visible on “Get started” and nav (keyboard users).
- Carousel dots: ensure they have clear labels/aria for screen readers.

---

## 3. Quick wins you can do now

1. **index.html** — Update `<title>` and meta description to the new positioning (decision-readiness, not “Retain, Recall, Reuse”).
2. **Hero** — Shorten the subhead to one sentence; add a concrete CTA label (e.g. “See how it works”).
3. **Problem section** — Add one short, concrete line (e.g. “A flagged wire. A borderline case. An auditor asking why.”) at the top of the copy.
4. **One statement bar** — Add a full-width strip with one bold sentence between problem and solution.
5. **Outcomes** — Visually separate from feature cards (e.g. different background tint or a “Proof” mini-heading).

---

## 4. Summary

- **Copy:** Lead with stakes and the “moment of decision”; make the moment concrete; tighten CTAs and add one proof point if available.
- **UI:** Differentiate hero (stakes + calm authority), add one strong visual beat (statement bar), and make outcomes look like proof, not another feature grid.
- **Next steps:** Implement the quick wins above, then iterate on hero and statement section based on feedback.

export const STATUSES = ['Exploring', 'Designing', 'Building', 'Shipped', 'Paused'];
export const PILLARS = ['Better Sleep', 'Confidence & Reliability', 'Enduring Value'];

export const initialFeatures = [
  {
    id: 'wind-down',
    title: 'Wind-Down Experience',
    summary: 'Pre-sleep audio journey that eases the transition from wakefulness to sleep, using brain-responsive soundscapes.',
    pillar: 'Better Sleep',
    status: 'Building',
    targetDate: 'Q2 2026',
    vision: `<p>Wind-Down is about bridging the gap between "I got into bed" and "I fell asleep." Most people's sleep problems start before they even close their eyes — racing thoughts, residual stress, screen-induced alertness.</p>
<p>The initial scope is 1–2 audio tracks surfaced under Sleep in the Soundscapes section as a lightweight interim solution. The fuller modular Wind-Down Experience — where users choose relaxation building blocks (breathwork, body scan, soundscape, narrative) — remains on the longer-term roadmap.</p>
<p>Robert Thomas is developing the audio content. The key design constraint: it must feel like a natural extension of the sleep session, not a separate "feature" users have to discover and configure.</p>`,
    prototypes: [
      { type: 'placeholder', label: 'Audio Flow', content: 'Wind-Down audio flow prototype coming soon' },
    ],
    defaultNotes: [
      { date: '2026-03-10', author: 'Caitlin', text: 'Scoped interim version: 1–2 tracks under Sleep > Soundscapes.', tickets: [] },
      { date: '2026-02-28', author: 'Caitlin', text: 'Robert delivered first draft audio tracks for review.', tickets: [] },
      { date: '2026-02-15', author: 'Caitlin', text: 'Full modular experience moved to H2 roadmap; shipping lightweight version first.', tickets: [] },
    ],
  },
  {
    id: 'morning-pullup',
    title: 'Morning Pull-Up Screen',
    summary: 'Full-screen post-sleep summary surfacing slow-wave count as the hero stat, replacing the current minimal wake screen.',
    pillar: 'Confidence & Reliability',
    status: 'Building',
    targetDate: 'Q1 2026',
    vision: `<p>The morning moment is the single highest-intent touchpoint we have. When someone takes out their Smartbuds, they want one thing: did it work?</p>
<p>The Morning Pull-Up is a full-screen post-sleep summary that leads with slow-wave count as the hero metric — the one number that distinguishes us from every other tracker. Supporting stats (sleep time, efficiency, latency) sit below, providing context without competing for attention.</p>
<p>Design principle: this screen should feel like a confident answer, not a data dump. Think weather app, not spreadsheet.</p>`,
    prototypes: [
      { type: 'figma', label: 'Mockup', url: 'https://www.figma.com/design/FldWyRNBLRJoDY0lWetmnN/Caitlin-s-Scratch-pad-March--26?node-id=121-3165&t=gKCYpmWjoq3rowD2-1' },
    ],
    defaultNotes: [
      { date: '2026-03-05', author: 'Caitlin', text: 'UX copy finalized. Hero stat: slow-wave count with delta indicator.', tickets: [] },
      { date: '2026-02-20', author: 'Caitlin', text: 'Devo delivered V2 design with simplified stat hierarchy.', tickets: [] },
    ],
  },
  {
    id: 'trends-benchmarking',
    title: 'Trends & Benchmarking 2.0',
    summary: 'Population benchmarks, HealthKit before/after comparisons, and orthosomnia guardrails for longitudinal sleep data.',
    pillar: 'Confidence & Reliability',
    status: 'Designing',
    targetDate: 'Q2 2026',
    vision: `<p>Users consistently ask "is my sleep good?" — and right now we don't have a satisfying answer. Trends 2.0 introduces population-level benchmarking so users can contextualize their data against people of similar age, gender, and activity level.</p>
<p>The HealthKit integration enables before/after comparison: show how sleep metrics have shifted since starting Smartbuds, using the user's own pre-existing Apple Health data as a baseline.</p>
<p>Critical guardrail: orthosomnia risk. We must frame benchmarks as context, not competition. No leaderboards, no "you're in the bottom 20%." Language like "your slow-wave activity is within a healthy range" rather than percentile rankings.</p>`,
    prototypes: [
      { type: 'figma', label: 'Wireframes', url: 'https://www.figma.com/design/FldWyRNBLRJoDY0lWetmnN/Caitlin-s-Scratch-pad-March--26?node-id=2-7313&t=gKCYpmWjoq3rowD2-1' },
    ],
    defaultNotes: [
      { date: '2026-03-08', author: 'Caitlin', text: 'PRD v2 complete. Includes orthosomnia guardrail language guidelines.', tickets: [] },
      { date: '2026-02-25', author: 'Caitlin', text: 'Nivi pulling baseline HealthKit comparison feasibility data.', tickets: [] },
    ],
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    summary: 'Personalized daily sleep insights powered by longitudinal EEG data, delivered in a daily home screen slot.',
    pillar: 'Enduring Value',
    status: 'Exploring',
    targetDate: 'H2 2026',
    vision: `<p>AI Insights is the long-term play for making Smartbuds feel like they understand you — not just your last night, but your sleep patterns, your trends, your body's response to behavior changes.</p>
<p>Three-phase delivery model:</p>
<ul>
<li><strong>Phase 1:</strong> Template-based insights (rule-driven, "You had 20% more slow waves after your earlier bedtime")</li>
<li><strong>Phase 2:</strong> Pattern recognition insights (ML-driven, correlating multi-night trends)</li>
<li><strong>Phase 3:</strong> Conversational insights (natural language Q&A about your sleep)</li>
</ul>
<p>Architecture: daily home screen slot that rotates one insight per day. Not a feed, not a notification — a single, high-signal card.</p>`,
    prototypes: [
      { type: 'placeholder', label: 'Insight Card', content: 'Insight card prototype TBD' },
    ],
    defaultNotes: [
      { date: '2026-03-01', author: 'Caitlin', text: 'Defined three-phase delivery model and daily slot architecture.', tickets: [] },
    ],
  },
  {
    id: 'focus-pomodoro',
    title: 'Focus Session (Pomodoro Mode)',
    summary: 'Pomodoro-style timed focus with alternating work/break phases, brain-responsive soundscapes, and a post-session EEG activity report.',
    pillar: 'Enduring Value',
    status: 'Exploring',
    targetDate: 'Q2 2026',
    vision: `<p>Focus Session is the first daytime use case for Smartbuds — a Pomodoro-style structured focus mode that shifts the product identity from <em>sleep device you wear at night</em> to <em>brain-sensing platform you use throughout the day</em>.</p>
<p>The strategic driver: users who hit comfort friction at night are churning before discovering the full value of brain-sensing earbuds. Focus Session creates a compelling daytime reason to keep the product, changing the retention equation even when nighttime comfort is still a work in progress.</p>
<p>The feature layers on top of the existing session infrastructure (timer + soundscapes + post-session summary) and adds three things:</p>
<ul>
<li><strong>Pomodoro phase logic</strong> — alternating focus and break intervals (default: 25min focus / 5min break) with configurable durations and cycles</li>
<li><strong>Audio transitions</strong> — dedicated focus vs. break soundscapes with a transition cue between phases</li>
<li><strong>Post-session brain activity report</strong> — a 5-minute-increment EEG summary showing relative engagement across the session, derived from band power ratios (beta/alpha)</li>
</ul>
<p>Key framing principle: <em>brain-aware, not brain-optimized</em>. We show what happened — "see what your brain does during focused work" — not "boost your productivity." The value is self-awareness and curiosity, not performance claims.</p>
<p>Two-phase rollout: React prototype first for internal validation, then SwiftUI translation into the existing session shell.</p>`,
    prototypes: [
      { type: 'figma', label: 'Prototype', url: 'https://www.figma.com/make/zGFhN2u6Jpe6gjwuHgn8cT/Focus-Session-Design?t=KY6ESHCtnxdpQ7si-1&preview-route=%2Fconfigure' },
    ],
    defaultNotes: [
      { date: '2026-03-12', author: 'Caitlin', text: 'Feature brief complete. Two-phase plan: React prototype → SwiftUI. Dependencies: session shell (Duy), EEG engagement heuristic (algorithms), focus/break soundscapes (Robert Thomas).', tickets: [] },
    ],
  },
  {
    id: 'live-brainwaves',
    title: 'Live Brainwaves (Signal Visualizer)',
    summary: 'Real-time EEG visualization for user confidence and engagement — renamed from "Signal Visualizer" for consumer clarity.',
    pillar: 'Confidence & Reliability',
    status: 'Shipped',
    targetDate: 'Q1 2026',
    vision: `<p>"Live Brainwaves" serves a trust-building function more than a data function. When users can see their brain activity moving in real time, it answers the fundamental question: "is this thing actually working?"</p>
<p>Renamed from "Signal Visualizer" because consumer users don't think in terms of "signal" — they think in terms of "my brain." The visualization is intentionally simplified: smooth waveforms, not raw EEG noise. Designed to inspire confidence, not anxiety.</p>`,
    prototypes: [
      { type: 'iframe', label: 'Interactive Prototype', url: '/prototypes/live-brainwaves.html' },
    ],
    defaultNotes: [
      { date: '2026-01-20', author: 'Caitlin', text: 'Renamed from Signal Visualizer. Shipped in v1.4.', tickets: [] },
    ],
  },
];

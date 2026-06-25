# TalentIQ — Intelligent Candidate Ranking System
### Redrob AI Challenge Submission

> "Don't ask if the candidate has the keyword. Ask who is most likely to succeed in this role."

---

## What This Is

TalentIQ is an AI-powered candidate ranking system that thinks like a great recruiter — not like a keyword filter.

Traditional ATS systems match resumes to job descriptions by counting keywords. TalentIQ evaluates candidates across multiple dimensions: technical depth, career trajectory, behavioral signals, platform activity, and contextual fit — then fuses these signals into a single intelligent score.

---

## The Problem We're Solving

A standard ATS does this:

```
JD requires: Python, AWS, Kubernetes
Resume has:  Python, AWS
Score:       66%
```

It cannot tell the difference between:
- A candidate who built AI systems in production for 5 years
- A candidate who added "Python" to their resume 5 years ago and never used it since

TalentIQ can.

---

## Our Approach

### Step 1 — Deep JD Understanding

We parse the job description into three layers:

| Layer | Example |
|---|---|
| Hard Requirements | Embeddings, Vector DB, Python, Ranking systems |
| Soft Signals | Startup mindset, async communication, ownership |
| Hidden Needs | "Fast-paced startup" → Adaptability + Bias for action |

### Step 2 — Multi-Dimensional Candidate Scoring

Every candidate is scored across 4 dimensions:

| Dimension | Weight | What We Measure |
|---|---|---|
| Technical Fit | 35% | AI skill depth, proficiency, endorsements, assessment scores |
| Career Trajectory | 25% | Company type, role relevance, growth velocity, GitHub activity |
| Platform Signals | 20% | Activity recency, response rate, notice period, profile completeness |
| Education | 10% | Institution tier, degree level, field relevance |

### Step 3 — Contextual Disqualifier System

Based on explicit JD signals, we apply penalties for:

- Entire career spent at consulting firms (TCS, Infosys, Wipro etc.)
- Non-technical titles with insufficient AI skill depth
- Candidates inactive on platform for 6+ months
- Long notice periods combined with not-open-to-work flag

This ensures a Marketing Manager with AI keywords does not outrank an ML Engineer with production experience.

### Step 4 — Signal Fusion

```
Final Score =
  (Technical Fit × 0.35) +
  (Career Trajectory × 0.25) +
  (Platform Signals × 0.20) +
  (Education × 0.10) −
  (Disqualifier Penalties)
```

### Step 5 — Ranked Output

Candidates are sorted by final score and output in the required CSV format with reasoning.

---

## Project Structure

```
TalentIQ-Redrob-Challenge/
│
├── rank_candidates.py        # Main ranking script
├── ranked_output.csv         # Final ranked output
├── README.md                 # This file
│
└── ui/                       # TalentIQ Web Interface (bonus)
    ├── src/
    │   ├── App.tsx          # Main app + Claude API call
    │   ├── components/      # All UI components
    │   └── lib/             # Ranking types
    ├── package.json
    └── README_UI.md         # How to run locally
```

---

## How to Run

### Requirements
```
Python 3.8+
No external libraries required (uses standard library only)
```

### Run on Sample Dataset
```bash
python rank_candidates.py sample_candidates.json ranked_output.csv
```

### Run on Full Dataset
```bash
python rank_candidates.py candidates.jsonl ranked_output.csv
```

### Validate Output
```bash
python validate_submission.py ranked_output.csv
```

---

## Output Format

```csv
candidate_id,rank,score,reasoning
CAND_0000031,1,0.7014,Recommendation Systems Engineer with 6.0 yrs; 12 AI core skills; response rate 0.91.
CAND_0000001,2,0.6205,Backend Engineer with 6.9 yrs; 12 AI core skills; response rate 0.34.
```

---

## Key Design Decisions

### Why We Down-weight Inactive Candidates
A perfect-on-paper candidate who hasn't logged in for 6 months and has a 5% recruiter response rate is not actually available. We penalize these candidates regardless of their technical score — because hiring is about finding people who can actually join.

### Why Consulting Background Is Penalized
The JD explicitly states candidates whose entire career is at TCS, Infosys, Wipro etc. are not a fit. We detect this pattern and apply a significant penalty — while still allowing candidates who have product company experience alongside consulting stints.

### Why Title Alone Does Not Disqualify
A Marketing Manager who has built LLM systems in production is different from one who just experimented with ChatGPT. We check skill depth and assessment scores before applying title-based penalties.

### Why We Use Platform Signals
Redrob's behavioral signals (response rate, last active date, saved by recruiters) are uniquely valuable data that traditional ATS systems don't have. We treat these as first-class signals — not afterthoughts.

---

## The TalentIQ UI (Bonus)

Beyond the ranking script, we built a full recruiter-facing web interface:

- **JD Analyzer** — Decomposes any job description into Hard / Soft / Hidden signals with a quality score
- **Intelligent Ranking** — Shows ranked candidates with signal bars, match tags, success probability
- **JD Optimizer** — Flags biased or exclusionary language with specific rewrite suggestions
- **Dark Horse Detection** — Surfaces underrated candidates with breakout potential
- **Talent Intelligence Report** — Personalized feedback for each candidate: why they ranked where they did, specific gaps, and better-fit role suggestions

Live Demo: https://talentiq-ai-recruite-m7zf.bolt.host

---

## What Makes This Different

| Feature | Traditional ATS | TalentIQ |
|---|---|---|
| Matching method | Keyword count | Multi-signal semantic scoring |
| Experience weighting | Years = seniority | Relevance > tenure |
| Behavioral signals | None | Platform activity, response rate |
| Disqualifiers | None | Explicit JD-based penalties |
| Candidate feedback | None | Personalized talent report |
| Bias detection | None | JD language optimizer |

---

## Team

Built for the Redrob India Runs Data & AI Challenge 2026.

---

*TalentIQ — Because great hiring is about understanding people, not counting keywords.*

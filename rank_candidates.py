"""
TalentIQ — Intelligent Candidate Ranking System
Redrob AI Challenge Submission

Approach:
- Multi-signal scoring (technical, behavioral, platform signals)
- Contextual re-ranking based on JD's explicit disqualifiers
- Signal fusion with weighted scoring
- Output: ranked CSV in required format
"""

import json
import csv
import math
import sys
from pathlib import Path

# ─── JD SIGNALS (extracted from job_description.docx) ────────────────────────

HARD_REQUIRED_SKILLS = [
    "embeddings", "sentence-transformers", "vector database", "pinecone",
    "weaviate", "qdrant", "milvus", "faiss", "opensearch", "elasticsearch",
    "python", "ranking", "retrieval", "ndcg", "mrr", "a/b test",
    "hybrid search", "bm25", "re-ranking", "nlp", "information retrieval",
    "recommendation", "search", "llm", "fine-tuning", "lora", "qlora",
    "transformer", "bert", "semantic search", "dense retrieval",
    "feature engineering", "xgboost", "learning to rank", "rag",
    "langchain", "openai", "huggingface", "pytorch", "tensorflow",
    "spark", "kafka", "airflow", "data pipelines", "ml pipeline",
    "model deployment", "inference", "production ml", "mlops",
    "weights & biases", "wandb", "peft", "gpt", "claude", "gemini",
    "tts", "speech recognition", "image classification", "gans",
    "milvus", "apache beam", "bentoml", "statistical modeling",
    "grpc", "data science", "machine learning", "deep learning",
    "natural language processing", "computer vision", "ai engineer",
    "ml engineer", "data engineer", "backend engineer", "software engineer"
]

# Explicit disqualifiers from JD
DISQUALIFIER_COMPANIES = [
    "tcs", "infosys", "wipro", "accenture", "cognizant", "capgemini",
    "tech mahindra", "hcl", "mindtree", "mphasis"
]

DISQUALIFIER_TITLES = [
    "marketing manager", "operations manager", "hr manager",
    "accountant", "civil engineer", "mechanical engineer",
    "graphic designer", "content writer", "sales executive",
    "customer support", "business analyst", "project manager"
]

AI_CORE_SKILLS = [
    "embeddings", "vector", "llm", "transformer", "bert", "gpt",
    "fine-tuning", "lora", "qlora", "rag", "retrieval", "ranking",
    "recommendation", "nlp", "machine learning", "deep learning",
    "pytorch", "tensorflow", "huggingface", "semantic search",
    "milvus", "faiss", "pinecone", "weaviate", "qdrant", "opensearch",
    "elasticsearch", "ndcg", "mrr", "a/b test", "mlops", "peft",
    "sentence-transformers", "bm25", "hybrid search", "learning to rank",
    "xgboost", "feature engineering", "statistical modeling",
    "tts", "speech recognition", "image classification", "gans",
    "weights & biases", "wandb", "bentoml", "apache beam",
    "data pipelines", "spark", "kafka", "airflow"
]

# ─── SCORING FUNCTIONS ────────────────────────────────────────────────────────

def score_technical_fit(candidate):
    """Score based on skills matching JD requirements"""
    score = 0.0
    skills = candidate.get("skills", [])
    skill_names = [s["name"].lower() for s in skills]
    skill_text = " ".join(skill_names)

    # Count AI core skills
    ai_skill_count = 0
    for ai_skill in AI_CORE_SKILLS:
        if ai_skill in skill_text:
            ai_skill_count += 1

    # Base score from AI skill count (max 40 points)
    score += min(ai_skill_count * 3.5, 40)

    # Bonus for advanced proficiency in key skills
    for skill in skills:
        name = skill["name"].lower()
        proficiency = skill.get("proficiency", "")
        endorsements = skill.get("endorsements", 0)
        duration = skill.get("duration_months", 0)

        if any(ai in name for ai in AI_CORE_SKILLS):
            if proficiency == "advanced":
                score += 3
            elif proficiency == "intermediate":
                score += 1.5

            # Endorsements signal (max 5 points per skill)
            score += min(endorsements * 0.1, 5)

            # Duration signal — longer usage = deeper experience
            score += min(duration * 0.05, 3)

    # Skill assessment scores (if available)
    assessments = candidate.get("redrob_signals", {}).get("skill_assessment_scores", {})
    if assessments:
        avg_assessment = sum(assessments.values()) / len(assessments)
        score += min(avg_assessment * 0.2, 10)

    return min(score, 100)


def score_career_trajectory(candidate):
    """Score based on career growth, company type, role relevance"""
    score = 0.0
    profile = candidate.get("profile", {})
    career = candidate.get("career_history", [])

    years_exp = profile.get("years_of_experience", 0)
    current_title = profile.get("current_title", "").lower()
    current_company = profile.get("current_company", "").lower()
    current_industry = profile.get("current_industry", "").lower()

    # Experience range bonus (5-9 years is sweet spot per JD)
    if 5 <= years_exp <= 9:
        score += 25
    elif 4 <= years_exp < 5 or 9 < years_exp <= 12:
        score += 15
    elif years_exp > 12:
        score += 8
    else:
        score += 5

    # Current role relevance
    ai_roles = ["ai", "ml", "machine learning", "data scientist", "engineer",
                "nlp", "research", "backend", "software", "platform", "founding"]
    if any(role in current_title for role in ai_roles):
        score += 20

    # Penalize if current title is disqualifier title
    if any(dt in current_title for dt in DISQUALIFIER_TITLES):
        score -= 25

    # Company type signals
    # Penalize pure consulting background
    consulting_count = sum(
        1 for job in career
        if any(dc in job.get("company", "").lower() for dc in DISQUALIFIER_COMPANIES)
    )
    total_jobs = len(career)
    if total_jobs > 0 and consulting_count == total_jobs:
        score -= 30  # Entire career at consulting firms = explicit disqualifier
    elif consulting_count > 0:
        score -= consulting_count * 5

    # Product company bonus
    product_industries = ["software", "technology", "saas", "ai", "fintech",
                         "startup", "internet", "e-commerce"]
    for job in career:
        industry = job.get("industry", "").lower()
        if any(pi in industry for pi in product_industries):
            score += 5

    # Career velocity — promotions within reasonable time
    if len(career) >= 2:
        recent_duration = career[0].get("duration_months", 0)
        if recent_duration > 6:  # Stable in current role
            score += 5

    # GitHub activity (open source signal)
    github_score = candidate.get("redrob_signals", {}).get("github_activity_score", -1)
    if github_score > 0:
        score += min(github_score * 0.3, 15)

    return max(min(score, 100), 0)


def score_platform_signals(candidate):
    """Score based on Redrob platform behavioral signals"""
    score = 0.0
    signals = candidate.get("redrob_signals", {})

    # Profile completeness (max 15 points)
    completeness = signals.get("profile_completeness_score", 0)
    score += completeness * 0.15

    # Open to work flag — critical for availability
    if signals.get("open_to_work_flag", False):
        score += 15

    # Recent activity — last active date matters
    last_active = signals.get("last_active_date", "")
    if last_active:
        from datetime import datetime
        try:
            last_dt = datetime.strptime(last_active, "%Y-%m-%d")
            today = datetime(2026, 6, 24)
            days_inactive = (today - last_dt).days
            if days_inactive <= 30:
                score += 20
            elif days_inactive <= 60:
                score += 15
            elif days_inactive <= 90:
                score += 10
            elif days_inactive <= 180:
                score += 5
            else:
                score -= 10  # Inactive 6+ months = not really available
        except:
            pass

    # Recruiter response rate (availability signal)
    response_rate = signals.get("recruiter_response_rate", 0)
    if response_rate > 0:
        score += response_rate * 20

    # Notice period (JD prefers sub-30 days)
    notice = signals.get("notice_period_days", 90)
    if notice <= 15:
        score += 15
    elif notice <= 30:
        score += 10
    elif notice <= 60:
        score += 5
    elif notice > 90:
        score -= 5

    # Profile views and saves — market validation
    views = signals.get("profile_views_received_30d", 0)
    saved = signals.get("saved_by_recruiters_30d", 0)
    score += min(views * 0.05, 5)
    score += min(saved * 1.5, 10)

    # Interview completion rate
    icr = signals.get("interview_completion_rate", 0)
    if icr > 0:
        score += icr * 5

    return max(min(score, 100), 0)


def score_education(candidate):
    """Score education signals"""
    score = 0.0
    education = candidate.get("education", [])

    for edu in education:
        tier = edu.get("tier", "")
        degree = edu.get("degree", "").lower()
        field = edu.get("field_of_study", "").lower()

        # Tier bonus
        if tier == "tier_1":
            score += 20
        elif tier == "tier_2":
            score += 12
        elif tier == "tier_3":
            score += 5

        # Degree level
        if "ph.d" in degree or "phd" in degree:
            score += 15
        elif "m.tech" in degree or "m.e" in degree or "m.sc" in degree or "mba" in degree:
            score += 10
        elif "b.tech" in degree or "b.e" in degree or "b.sc" in degree:
            score += 5

        # Relevant field
        relevant_fields = ["computer science", "artificial intelligence",
                          "machine learning", "data science", "information technology",
                          "electronics", "mathematics", "statistics"]
        if any(rf in field for rf in relevant_fields):
            score += 10

    return min(score, 100)


def check_disqualifiers(candidate):
    """Check explicit JD disqualifiers — returns penalty score"""
    penalty = 0
    profile = candidate.get("profile", {})
    career = candidate.get("career_history", [])
    signals = candidate.get("redrob_signals", {})

    current_title = profile.get("current_title", "").lower()
    current_company = profile.get("current_company", "").lower()

    # Disqualifier 1: Entire career at consulting firms
    all_consulting = all(
        any(dc in job.get("company", "").lower() for dc in DISQUALIFIER_COMPANIES)
        for job in career
    ) if career else False
    if all_consulting and len(career) > 0:
        penalty += 40

    # Disqualifier 2: Non-technical title with no real AI work
    if any(dt in current_title for dt in DISQUALIFIER_TITLES):
        # Check if they have actual AI skills despite title
        skills = [s["name"].lower() for s in candidate.get("skills", [])]
        ai_skill_count = sum(1 for s in skills if any(ai in s for ai in AI_CORE_SKILLS))
        if ai_skill_count < 3:
            penalty += 35

    # Disqualifier 3: Inactive on platform (available but not really)
    last_active = signals.get("last_active_date", "")
    if last_active:
        from datetime import datetime
        try:
            last_dt = datetime.strptime(last_active, "%Y-%m-%d")
            today = datetime(2026, 6, 24)
            days_inactive = (today - last_dt).days
            if days_inactive > 180:
                penalty += 20
        except:
            pass

    # Disqualifier 4: Not open to work + very long notice
    open_to_work = signals.get("open_to_work_flag", False)
    notice = signals.get("notice_period_days", 90)
    if not open_to_work and notice > 90:
        penalty += 15

    return penalty


def compute_final_score(candidate):
    """
    Signal Fusion Formula:
    35% Technical Fit
    25% Career Trajectory
    20% Platform/Behavioral Signals
    10% Education
    10% Contextual Disqualifier Penalty
    """
    tech = score_technical_fit(candidate)
    career = score_career_trajectory(candidate)
    platform = score_platform_signals(candidate)
    education = score_education(candidate)
    penalty = check_disqualifiers(candidate)

    raw_score = (
        tech * 0.35 +
        career * 0.25 +
        platform * 0.20 +
        education * 0.10
    )

    final = max(raw_score - penalty, 0)
    return round(final / 100, 4)  # Normalize to 0-1


def build_reasoning(candidate, score):
    """Generate human-readable reasoning like sample_submission.csv"""
    profile = candidate.get("profile", {})
    signals = candidate.get("redrob_signals", {})
    skills = candidate.get("skills", [])

    title = profile.get("current_title", "Unknown")
    years = profile.get("years_of_experience", 0)
    response_rate = signals.get("recruiter_response_rate", 0)

    # Count AI core skills
    skill_names = [s["name"].lower() for s in skills]
    ai_count = sum(1 for s in skill_names if any(ai in s for ai in AI_CORE_SKILLS))

    return f"{title} with {years} yrs; {ai_count} AI core skills; response rate {response_rate:.2f}."


# ─── MAIN PIPELINE ────────────────────────────────────────────────────────────

def rank_candidates(input_file, output_file, limit=None):
    print(f"Loading candidates from {input_file}...")

    candidates = []

    # Handle both .json and .jsonl formats
    with open(input_file, "r", encoding="utf-8") as f:
        content = f.read().strip()
        if content.startswith("["):
            # JSON array
            candidates = json.loads(content)
        else:
            # JSONL — one candidate per line
            for line in content.split("\n"):
                line = line.strip()
                if line:
                    try:
                        candidates.append(json.loads(line))
                    except:
                        pass

    if limit:
        candidates = candidates[:limit]

    print(f"Loaded {len(candidates)} candidates. Scoring...")

    # Score all candidates
    scored = []
    for i, cand in enumerate(candidates):
        if i % 100 == 0:
            print(f"  Scored {i}/{len(candidates)}...")
        try:
            score = compute_final_score(cand)
            reasoning = build_reasoning(cand, score)
            scored.append({
                "candidate_id": cand["candidate_id"],
                "score": score,
                "reasoning": reasoning
            })
        except Exception as e:
            print(f"  Error on {cand.get('candidate_id', '?')}: {e}")

    # Sort by score descending
    scored.sort(key=lambda x: x["score"], reverse=True)

    # Assign ranks
    for i, item in enumerate(scored):
        item["rank"] = i + 1

    # Write CSV output
    print(f"Writing {len(scored)} ranked candidates to {output_file}...")
    with open(output_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["candidate_id", "rank", "score", "reasoning"])
        writer.writeheader()
        for item in scored:
            writer.writerow(item)

    print(f"\nDone! Top 10 candidates:")
    print(f"{'Rank':<6} {'ID':<15} {'Score':<8} Reasoning")
    print("-" * 80)
    for item in scored[:10]:
        print(f"{item['rank']:<6} {item['candidate_id']:<15} {item['score']:<8} {item['reasoning'][:50]}")

    return scored


# ─── RUN ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Use sample for testing, full dataset for submission
    input_file = sys.argv[1] if len(sys.argv) > 1 else "sample_candidates.json"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "ranked_output.csv"

    results = rank_candidates(input_file, output_file)
    print(f"\nTotal candidates ranked: {len(results)}")
    print(f"Output saved to: {output_file}")

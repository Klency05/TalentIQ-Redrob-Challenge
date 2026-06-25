import { useState } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { JDAnalysisPanel } from './components/JDAnalysisPanel';
import { RankedResults } from './components/RankedResults';
import { BiasAudit } from './components/BiasAudit';
import { DarkHorseSpotlight } from './components/DarkHorseSpotlight';
import { IntelligenceReport } from './components/IntelligenceReport';
import { Candidate, RankingResult } from './lib/ranking';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RankingResult | null>(null);

  async function handleRank(jd: string, candidates: Candidate[]) {
    setLoading(true);
    setResult(null);

    const prompt = `
You are an expert AI recruiter. Analyze this job
description and rank these candidates intelligently.

JOB DESCRIPTION:
${jd}

CANDIDATES:
${candidates.map((c, i) =>
  `${i + 1}. ${c.name}: ${c.profile}`
).join('\n')}

Return ONLY valid JSON with this exact structure:
{
  "jdAnalysis": {
    "hardRequirements": ["React", "Node.js"],
    "softSignals": ["startup mentality"],
    "hiddenNeeds": ["comfort with ambiguity"],
    "qualityScore": 62,
    "biasFlags": [
      {
        "phrase": "rockstar engineer",
        "reason": "Gendered language that may deter applicants",
        "suggestion": "Try: experienced engineer who ships production code"
      }
    ]
  },
  "ranked": [
    {
      "rank": 1,
      "name": "Candidate Name",
      "roleLabel": "Senior Full-Stack Engineer",
      "score": 91,
      "successProbability": 89,
      "signalScores": {
        "technicalFit": 95,
        "startupFit": 85,
        "growthTrajectory": 88,
        "communication": 80,
        "aiRelevance": 67
      },
      "matchedSignals": ["Technical Fit", "Startup Fit"],
      "gaps": ["No CS degree"],
      "reasoning": "2-3 sentence specific explanation based on their actual profile"
    }
  ],
  "darkHorse": {
    "name": "Candidate Name",
    "reasoning": "Why this specific person is underrated based on their profile",
    "strengths": ["strength1", "strength2"]
  },
  "talentReports": [
    {
      "name": "Candidate Name",
      "rank": 2,
      "whyOthersRankedAbove": [
        "specific reason tied to THIS candidate's actual profile",
        "another specific reason for THIS candidate only"
      ],
      "gaps": {
        "hardGap": {
          "description": "specific missing skill for THIS candidate",
          "timeline": "realistic timeline to close"
        },
        "signalGap": {
          "description": "what THIS candidate has but didn't demonstrate",
          "timeline": "how quickly they can show it"
        },
        "contextGap": {
          "description": "environment mismatch specific to THIS candidate",
          "timeline": "how to bridge it"
        }
      },
      "betterFitRoles": [
        {
          "title": "Role Title",
          "reason": "Why this fits THIS candidate's specific strengths"
        }
      ]
    }
  ]
}

CRITICAL RULES:
- talentReports must be completely unique per candidate
- Base every insight on their actual profile data
- No copy-paste content between candidates
- All candidates must appear in ranked array
- Candidates ranked 2-5 must each have their own talentReport
- Be specific, not generic
`;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            max_tokens: 4000,
            messages: [
              {
                role: "system",
                content: "You are an expert AI recruiter. Always respond with valid JSON only. No markdown, no explanation, just raw JSON."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          })
        }
      );
      const data = await response.json();
      const rawText = data.choices[0].message.content;
      const cleaned = rawText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);

    } catch (error) {
      console.error('API Error:', error);
      alert('Something went wrong. Please try again.');
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Header />
      <InputSection onRank={handleRank} loading={loading} />
      {result && (
        <>
          <JDAnalysisPanel analysis={result.jdAnalysis} />
          <RankedResults ranked={result.ranked} />
          <BiasAudit analysis={result.jdAnalysis} />
          <DarkHorseSpotlight candidate={result.darkHorse} />
          <IntelligenceReport ranked={result.ranked}
            talentReports={result.talentReports} />
        </>
      )}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        TalentIQ — AI-Powered Talent Intelligence Platform
      </footer>
    </div>
  );
}

export default App;

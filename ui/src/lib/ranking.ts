export type Candidate = {
  name: string;
  profile: string;
};

export type SignalScores = {
  technicalFit: number;
  startupFit: number;
  growthTrajectory: number;
  communication: number;
  aiRelevance: number;
};

export type RankedCandidate = {
  rank: number;
  name: string;
  roleLabel: string;
  score: number;
  successProbability: number;
  signalScores: SignalScores;
  matchedSignals: string[];
  gaps: string[];
  reasoning: string;
  isDarkHorse?: boolean;
};

export type JDAnalysis = {
  hardRequirements: string[];
  softSignals: string[];
  hiddenNeeds: string[];
  qualityScore: number;
  biasFlags: { phrase: string; reason: string; suggestion: string }[];
};

export type TalentReport = {
  name: string;
  rank: number;
  whyOthersRankedAbove: string[];
  gaps: {
    hardGap: { description: string; timeline: string };
    signalGap: { description: string; timeline: string };
    contextGap: { description: string; timeline: string };
  };
  betterFitRoles: { title: string; reason: string }[];
};

export type DarkHorseCandidate = {
  name: string;
  reasoning: string;
  strengths: string[];
};

export type RankingResult = {
  jdAnalysis: JDAnalysis;
  ranked: RankedCandidate[];
  darkHorse: DarkHorseCandidate;
  talentReports: TalentReport[];
};

export const DEFAULT_JD = `Senior Full-Stack Engineer — Platform Team

We're looking for a rockstar engineer to join our fast-growing startup. You'll own features end-to-end, from design to deployment. Requirements:
- 5+ years React, Node.js, TypeScript
- Experience with AWS / serverless architecture
- Startup mentality, scrappy and self-driven
- Strong communicator, team player
- Native English speaker preferred
- Computer Science degree from top university

You'll work directly with the founders and ship daily. Equity + competitive salary. We move fast and break things — only serious candidates please.`;

export const DEFAULT_CANDIDATES: Candidate[] = [
  {
    name: 'Maya Chen',
    profile:
      '6 years full-stack at Stripe + Airbnb. React/TypeScript expert, built serverless platforms on AWS. CS degree from Stanford. Led mentorship programs. Speaks at conferences.',
  },
  {
    name: 'Devon Brooks',
    profile:
      '8 years experience, self-taught. Built and sold two micro-SaaS products. Python/React. No degree. Currently freelancing. Strong product instincts, less enterprise exposure.',
  },
  {
    name: 'Aisha Patel',
    profile:
      '5 years at Google Cloud. Specialized in serverless infrastructure. Recently pivoted to full-stack React. Bootcamp graduate. Excellent written communication, multilingual.',
  },
  {
    name: 'Jordan Reyes',
    profile:
      '7 years mixed agency + startup work. Strong React, Node, TypeScript. Built payment systems. MBA besides CS degree. Takes initiative, led open source projects.',
  },
  {
    name: 'Sana Okafor',
    profile:
      '4 years experience, all at early-stage startups. Wore many hats — frontend, backend, DevOps. Shipped 3 products from zero to one. No formal degree but strong portfolio. Community organizer.',
  },
];

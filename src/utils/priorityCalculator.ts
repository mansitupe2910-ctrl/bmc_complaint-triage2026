export interface PriorityScoreBreakdown {
  visualSeverityWeight: number; // 50%
  visualSeverityPoints: number;
  upvotesWeight: number; // 50%
  upvotesPoints: number;
  categoryMultiplier: number;
  finalScore: number;
  urgencyLabel: 'Critical' | 'High' | 'Medium' | 'Low';
}

export function calculatePriorityScore(
  complaint: {
    visualSeverity: number;
    upvotes: number;
    category: string;
  }
): PriorityScoreBreakdown {
  // 1. Visual Severity (0 - 100) -> 50% weight
  const visualPoints = (complaint.visualSeverity * 0.50);

  // 2. Community Upvotes (+1 Me Too) -> 50% weight
  const normalizedUpvotes = Math.min(100, complaint.upvotes * 5);
  const upvotePoints = (normalizedUpvotes * 0.50);

  let categoryMultiplier = 1.0;
  if (complaint.category === 'manhole' || complaint.category === 'waterlogging') {
    categoryMultiplier = 1.2;
  } else if (complaint.category === 'wire') {
    categoryMultiplier = 1.25;
  }

  // Combined score capped between 10 and 100
  const rawScore = (visualPoints + upvotePoints) * categoryMultiplier;
  const finalScore = Math.min(100, Math.max(12, Math.round(rawScore)));

  let urgencyLabel: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low';
  if (finalScore >= 80) urgencyLabel = 'Critical';
  else if (finalScore >= 65) urgencyLabel = 'High';
  else if (finalScore >= 45) urgencyLabel = 'Medium';

  return {
    visualSeverityWeight: 50,
    visualSeverityPoints: Math.round(visualPoints),
    upvotesWeight: 50,
    upvotesPoints: Math.round(upvotePoints),
    categoryMultiplier,
    finalScore,
    urgencyLabel
  };
}

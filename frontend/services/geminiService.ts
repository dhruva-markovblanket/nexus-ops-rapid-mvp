import { TicketPriority } from "../types";

interface AnalysisResult {
  priority: TicketPriority;
  category: string;
  summary: string;
  suggestedAction?: string;
}

// Lightweight local heuristic-based analysis as a fallback
export const analyzeTicketDescription = async (
  description: string,
  location: string,
  issueType: string = 'Infrastructure'
): Promise<AnalysisResult> => {
  const text = (description || '').toLowerCase();

  // Very simple heuristics — rules can be expanded later
  let priority = TicketPriority.MEDIUM;
  if (/(urgent|immediately|asap|emergency|critical)/.test(text)) priority = TicketPriority.HIGH;
  if (/(broken|leak|fire|danger|collapse)/.test(text)) priority = TicketPriority.HIGH;
  if (/(slow|low|minor|cosmetic)/.test(text)) priority = TicketPriority.LOW;

  let category = issueType;
  if (/(wifi|internet|network|connectivity)/.test(text)) category = 'Network';
  if (/(marks|grades|exam|submission)/.test(text)) category = 'Academic Records';
  if (/(fee|payment|billing)/.test(text)) category = 'Billing';

  const summary = text.length > 0 ? description.trim().split('\n')[0].slice(0, 200) : 'No description provided.';

  return {
    priority,
    category,
    summary,
    suggestedAction: 'Review and triage manually.'
  };
};
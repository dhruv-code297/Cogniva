export type AgentTemplate = {
  id: string;
  name: string;
  category: "Productivity" | "Research" | "Sales" | "Engineering";
  description: string;
  prompt: string;
  cadence: string;
  tools: string[];
};

export const agentTemplates: AgentTemplate[] = [
  { id: "inbox-brief", name: "Inbox briefing", category: "Productivity", description: "Start your day with the emails that need a decision, a reply, or a follow-up.", prompt: "Create an agent that checks my inbox each weekday morning, groups important emails by priority, highlights anything that needs my reply, and sends me a concise briefing with suggested next actions.", cadence: "Weekdays", tools: ["Gmail"] },
  { id: "meeting-prep", name: "Meeting prep", category: "Productivity", description: "Turn your calendar and recent context into a focused pre-meeting brief.", prompt: "Create an agent that reviews my upcoming calendar meetings, gathers relevant context from connected tools, and prepares a short briefing with attendees, agenda, open questions, and recommended preparation.", cadence: "Daily", tools: ["Calendar", "Gmail"] },
  { id: "research-brief", name: "Research brief", category: "Research", description: "Track a topic across the web and get a clear, source-aware summary.", prompt: "Create an agent that researches a topic I choose across credible web sources, compares the findings, notes uncertainties, and produces a concise briefing with source links and key takeaways.", cadence: "On demand", tools: ["Web research"] },
  { id: "competitor-watch", name: "Competitor watch", category: "Research", description: "Monitor competitor changes and surface only meaningful updates.", prompt: "Create an agent that checks competitor websites weekly for changes in pricing, products, and positioning, then summarizes meaningful changes with links and potential implications for my team.", cadence: "Weekly", tools: ["Web research"] },
  { id: "lead-research", name: "Lead research", category: "Sales", description: "Prepare useful company context before a sales conversation.", prompt: "Create an agent that researches new leads, summarizes company context and recent news, identifies likely needs, and creates a concise preparation note for outreach. Ask me which CRM to use if needed.", cadence: "On demand", tools: ["Web research", "CRM"] },
  { id: "pr-digest", name: "Pull request digest", category: "Engineering", description: "Summarize code review activity and what the team should watch.", prompt: "Create an agent that reviews recent GitHub pull requests, summarizes changes and review blockers, flags risky areas that need human attention, and sends a short engineering digest.", cadence: "Daily", tools: ["GitHub"] },
];

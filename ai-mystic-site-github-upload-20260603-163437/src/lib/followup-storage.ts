export type FollowupMessage = {
  id: string;
  reportId: string;
  question: string;
  answer: string;
  mode: "ai" | "demo";
  statusMessage: string;
  createdAt: string;
};

const FOLLOWUP_KEY = "ai-mystic-site:report-followups";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getAllFollowups() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(FOLLOWUP_KEY);
    const items = raw ? (JSON.parse(raw) as FollowupMessage[]) : [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function getReportFollowups(reportId: string) {
  return getAllFollowups()
    .filter((item) => item.reportId === reportId)
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

export function saveReportFollowup(
  message: Omit<FollowupMessage, "id" | "createdAt">,
) {
  const saved: FollowupMessage = {
    ...message,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const rest = getAllFollowups().filter((item) => item.reportId !== message.reportId);
  const current = [...getReportFollowups(message.reportId), saved].slice(-12);
  window.localStorage.setItem(FOLLOWUP_KEY, JSON.stringify([...current, ...rest]));
  return saved;
}

export function clearReportFollowups(reportId: string) {
  const next = getAllFollowups().filter((item) => item.reportId !== reportId);
  window.localStorage.setItem(FOLLOWUP_KEY, JSON.stringify(next));
}

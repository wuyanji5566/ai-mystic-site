export type LocalAccount = {
  name: string;
  email: string;
  createdAt: string;
};

const ACCOUNT_KEY = "ai-mystic-site:account";
const UNLOCK_KEY = "ai-mystic-site:unlocked-reports";
const FREE_USAGE_KEY = "ai-mystic-site:free-report-usage";

export type FreeReportUsage = {
  count: number;
  updatedAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getLocalAccount() {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount) : null;
  } catch {
    return null;
  }
}

export function saveLocalAccount(account: Omit<LocalAccount, "createdAt">) {
  const saved: LocalAccount = {
    ...account,
    createdAt: new Date().toISOString(),
  };
  window.localStorage.setItem(ACCOUNT_KEY, JSON.stringify(saved));
  return saved;
}

export function clearLocalAccount() {
  window.localStorage.removeItem(ACCOUNT_KEY);
}

export function getUnlockedReportIds() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(UNLOCK_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(ids) ? ids : [];
  } catch {
    return [];
  }
}

export function isReportUnlocked(id: string) {
  return getUnlockedReportIds().includes(id);
}

export function unlockReport(id: string) {
  const ids = Array.from(new Set([id, ...getUnlockedReportIds()]));
  window.localStorage.setItem(UNLOCK_KEY, JSON.stringify(ids));
}

export function getFreeReportUsage(): FreeReportUsage {
  if (!canUseStorage()) return { count: 0, updatedAt: "" };

  try {
    const raw = window.localStorage.getItem(FREE_USAGE_KEY);
    if (!raw) return { count: 0, updatedAt: "" };
    const usage = JSON.parse(raw) as FreeReportUsage;
    return {
      count: Number.isFinite(usage.count) ? usage.count : 0,
      updatedAt: usage.updatedAt || "",
    };
  } catch {
    return { count: 0, updatedAt: "" };
  }
}

export function markFreeReportGenerated() {
  const current = getFreeReportUsage();
  const next: FreeReportUsage = {
    count: current.count + 1,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(FREE_USAGE_KEY, JSON.stringify(next));
  return next;
}

export function resetFreeReportUsageForDemo() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(FREE_USAGE_KEY);
}

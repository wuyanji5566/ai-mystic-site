import type { MysticInput, MysticProfile } from "@/lib/mystic";
export { isReportUnlocked, unlockReport } from "@/lib/account-storage";

export type SavedMysticReport = {
  id: string;
  title: string;
  createdAt: string;
  input: MysticInput;
  profile: MysticProfile;
  report: string;
  mode: "ai" | "demo";
  statusMessage: string;
};

export type ReportStorageMode = "cloud" | "local";

const STORAGE_KEY = "ai-mystic-site:reports";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getSavedReports() {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const reports = JSON.parse(raw) as SavedMysticReport[];
    return Array.isArray(reports) ? reports : [];
  } catch {
    return [];
  }
}

export function getSavedReport(id: string) {
  return getSavedReports().find((report) => report.id === id) || null;
}

export function saveMysticReport(report: Omit<SavedMysticReport, "id" | "createdAt" | "title">) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const savedReport: SavedMysticReport = {
    ...report,
    id,
    title: `${report.input.name || "匿名用户"}的四维融合分析报告`,
    createdAt: new Date().toISOString(),
  };

  const reports = [savedReport, ...getSavedReports()].slice(0, 20);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return savedReport;
}

export function cacheSavedReport(report: SavedMysticReport) {
  const reports = [report, ...getSavedReports().filter((item) => item.id !== report.id)].slice(0, 20);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return report;
}

export async function saveReportWithCloudFallback(
  report: Omit<SavedMysticReport, "id" | "createdAt" | "title">,
): Promise<{ report: SavedMysticReport; storage: ReportStorageMode }> {
  try {
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });

    if (response.ok) {
      const data = (await response.json()) as {
        report: SavedMysticReport;
        storage: ReportStorageMode;
      };
      return {
        report: cacheSavedReport(data.report),
        storage: data.storage,
      };
    }
  } catch {
    // Local storage fallback keeps the MVP usable before Supabase is configured.
  }

  return {
    report: saveMysticReport(report),
    storage: "local",
  };
}

export async function getReportWithCloudFallback(id: string) {
  try {
    const response = await fetch(`/api/reports/${id}`);

    if (response.ok) {
      const data = (await response.json()) as {
        report: SavedMysticReport;
        storage: ReportStorageMode;
      };
      return {
        report: cacheSavedReport(data.report),
        storage: data.storage,
      };
    }
  } catch {
    // Fall back to local storage below.
  }

  const report = getSavedReport(id);
  return report ? { report, storage: "local" as const } : null;
}

export async function getReportsWithCloudFallback() {
  try {
    const response = await fetch("/api/reports");

    if (response.ok) {
      const data = (await response.json()) as {
        reports: SavedMysticReport[];
        storage: ReportStorageMode;
      };
      data.reports.forEach(cacheSavedReport);
      return {
        reports: data.reports,
        storage: data.storage,
      };
    }
  } catch {
    // Fall back to local storage below.
  }

  return {
    reports: getSavedReports(),
    storage: "local" as const,
  };
}

export async function deleteReportWithCloudFallback(id: string, storage: ReportStorageMode) {
  if (storage === "cloud") {
    try {
      await fetch(`/api/reports/${id}`, { method: "DELETE" });
    } catch {
      // Still remove the local cached copy so the UI reflects the user's action.
    }
  }

  deleteSavedReport(id);
}

export function deleteSavedReport(id: string) {
  const reports = getSavedReports().filter((report) => report.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

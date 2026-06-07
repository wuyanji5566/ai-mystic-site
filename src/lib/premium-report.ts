import "server-only";

import {
  generateMysticReport,
  isPremiumReportReady,
} from "@/lib/report-engine";
import {
  getStoredReport,
  updateStoredReportContent,
  type StoredReport,
} from "@/lib/mvp-store";

const activeGenerations = new Map<string, Promise<StoredReport | null>>();

export async function ensurePremiumStoredReport(reportId: string) {
  const current = await getStoredReport(reportId);
  if (!current) return null;
  if (isPremiumReportReady(current.fullReport, current.mode)) return current;
  if (current.statusMessage.includes("深度报告生成已尝试")) return current;

  const existingTask = activeGenerations.get(reportId);
  if (existingTask) return existingTask;

  const task = generateMysticReport(current.input)
    .then(async (generated) => {
      if (!isPremiumReportReady(generated.fullReport, generated.mode)) {
        return updateStoredReportContent(reportId, {
          statusMessage: "深度报告生成已尝试，当前展示结构化专属版本。",
        });
      }
      return updateStoredReportContent(reportId, {
        fullReport: generated.fullReport,
        mode: generated.mode,
        statusMessage: "专属深度报告已完成生成。",
      });
    })
    .catch((error) => {
      console.error("Premium report generation failed:", error);
      return updateStoredReportContent(reportId, {
        statusMessage: "深度报告生成已尝试，当前展示结构化专属版本。",
      });
    })
    .finally(() => {
      activeGenerations.delete(reportId);
    });

  activeGenerations.set(reportId, task);
  return task;
}

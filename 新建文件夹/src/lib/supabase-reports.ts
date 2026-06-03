import type { SavedMysticReport } from "@/lib/report-storage";

type SupabaseReportRow = {
  id: string;
  title: string;
  input: SavedMysticReport["input"];
  profile: SavedMysticReport["profile"];
  report: string;
  mode: SavedMysticReport["mode"];
  status_message: string;
  created_at: string;
};

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}

function getRestUrl(path: string) {
  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL is not configured");
  }

  return `${supabaseUrl}/rest/v1/${path}`;
}

function getHeaders(extra?: HeadersInit) {
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

function toSavedReport(row: SupabaseReportRow): SavedMysticReport {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    input: row.input,
    profile: row.profile,
    report: row.report,
    mode: row.mode,
    statusMessage: row.status_message,
  };
}

export async function createCloudReport(
  report: Omit<SavedMysticReport, "id" | "createdAt" | "title">,
) {
  const title = `${report.input.name || "匿名用户"}的四维融合分析报告`;

  const response = await fetch(getRestUrl("mystic_reports"), {
    method: "POST",
    headers: getHeaders({ Prefer: "return=representation" }),
    body: JSON.stringify({
      title,
      input: report.input,
      profile: report.profile,
      report: report.report,
      mode: report.mode,
      status_message: report.statusMessage,
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase create report failed: ${response.status}`);
  }

  const rows = (await response.json()) as SupabaseReportRow[];
  return toSavedReport(rows[0]);
}

export async function listCloudReports() {
  const response = await fetch(
    getRestUrl("mystic_reports?select=*&order=created_at.desc&limit=20"),
    {
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase list reports failed: ${response.status}`);
  }

  const rows = (await response.json()) as SupabaseReportRow[];
  return rows.map(toSavedReport);
}

export async function getCloudReport(id: string) {
  const response = await fetch(
    getRestUrl(`mystic_reports?select=*&id=eq.${encodeURIComponent(id)}&limit=1`),
    {
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase get report failed: ${response.status}`);
  }

  const rows = (await response.json()) as SupabaseReportRow[];
  return rows[0] ? toSavedReport(rows[0]) : null;
}

export async function deleteCloudReport(id: string) {
  const response = await fetch(
    getRestUrl(`mystic_reports?id=eq.${encodeURIComponent(id)}`),
    {
      method: "DELETE",
      headers: getHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Supabase delete report failed: ${response.status}`);
  }
}

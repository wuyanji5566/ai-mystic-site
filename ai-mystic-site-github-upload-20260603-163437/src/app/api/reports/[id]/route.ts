import { deleteCloudReport, getCloudReport, isSupabaseConfigured } from "@/lib/supabase-reports";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase 未配置，当前只能使用浏览器本地保存。" },
      { status: 503 },
    );
  }

  const { id } = await params;

  try {
    const report = await getCloudReport(id);

    if (!report) {
      return Response.json({ error: "未找到报告。" }, { status: 404 });
    }

    return Response.json({ report, storage: "cloud" });
  } catch (error) {
    console.error("Get cloud report failed:", error);
    return Response.json(
      { error: "读取云端报告失败，已尝试回退到本地报告。" },
      { status: 502 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured()) {
    return Response.json(
      { error: "Supabase 未配置，当前只能使用浏览器本地保存。" },
      { status: 503 },
    );
  }

  const { id } = await params;

  try {
    await deleteCloudReport(id);
    return Response.json({ ok: true, storage: "cloud" });
  } catch (error) {
    console.error("Delete cloud report failed:", error);
    return Response.json(
      { error: "删除云端报告失败。" },
      { status: 502 },
    );
  }
}

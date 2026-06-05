import { ReportDetail } from "@/components/report-detail";

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { id } = await params;
  const { orderId = "" } = await searchParams;
  return <ReportDetail reportId={id} initialOrderId={orderId} />;
}

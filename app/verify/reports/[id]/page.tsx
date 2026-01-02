// app/verify/reports/[id]/page.tsx
import { notFound } from "next/navigation";
import ExecutiveDashboard from "@/components/reports/ExecutiveDashboard";
import { getVerification } from "@/lib/storage/db";

// Force dynamic rendering as we rely on ID params
export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ReportPage({ params }: PageProps) {
  // 1. Fetch the immutable record from DB
  const record = await getVerification(params.id);

  if (!record) {
    return notFound();
  }

  // 2. Pass the stored result to the client dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <ExecutiveDashboard 
        result={record.result} 
        reportId={record.id} 
      />
    </div>
  );
}
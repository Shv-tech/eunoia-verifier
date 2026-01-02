// app/dashboard/layout.tsx
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-white p-6 space-y-4">
        <h2 className="font-semibold">Dashboard</h2>
        <nav className="space-y-2 text-sm">
          <Link href="/dashboard/founder">Founder</Link><br />
          <Link href="/dashboard/researcher">Researcher</Link><br />
          <Link href="/dashboard/analyst">Analyst</Link><br />
          <Link href="/dashboard/legal">Legal</Link><br />
          <Link href="/dashboard/student">Student</Link>
        </nav>
      </aside>

      <main className="p-8 bg-neutral-50">{children}</main>
    </div>
  );
}

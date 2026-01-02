import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="font-semibold text-lg">
          EUNOIA VERIFY
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm text-neutral-700">
          <Link href="/verify">Verify</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/docs">Docs</Link>
          <Link
            href="/login"
            className="border px-3 py-1.5 rounded-md hover:bg-neutral-50"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}

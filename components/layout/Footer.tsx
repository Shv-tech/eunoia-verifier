export default function Footer() {
  return (
    <footer className="w-full border-t bg-neutral-50 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-neutral-600 flex justify-between">
        <span>© {new Date().getFullYear()} SHV Groups Pvt. Ltd.</span>
        <span>EUNOIA VERIFY</span>
      </div>
    </footer>
  );
}

"use client";
import Button from "../common/Button";

export default function InputPanel({
  onSubmit,
}: {
  onSubmit: (text: string) => void;
}) {
  return (
    <div>
      <textarea
        rows={12}
        className="w-full border p-3 rounded-md font-mono text-sm"
        placeholder="Paste content to verify…"
      />
      <Button className="mt-4">Run Verification</Button>
    </div>
  );
}

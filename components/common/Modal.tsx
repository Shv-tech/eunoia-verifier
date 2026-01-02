import React from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {children}
        <button
          onClick={onClose}
          className="mt-4 text-sm underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}

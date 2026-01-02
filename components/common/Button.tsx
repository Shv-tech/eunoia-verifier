import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({
  variant = "primary",
  className,
  ...props
}: Props) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-neutral-800"
      : "border bg-white hover:bg-neutral-50";

  return (
    <button
      {...props}
      className={`${base} ${styles} ${className || ""}`}
    />
  );
}

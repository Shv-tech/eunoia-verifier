export default function Tooltip({
  label,
}: {
  label: string;
}) {
  return (
    <span className="text-xs text-neutral-500 ml-1 cursor-help">
      ⓘ {label}
    </span>
  );
}

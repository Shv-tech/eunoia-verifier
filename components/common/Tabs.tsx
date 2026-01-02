export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex gap-4 border-b">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`pb-2 text-sm ${
            active === t
              ? "border-b-2 border-black"
              : "text-neutral-500"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

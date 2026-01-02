export default function TrustScoreMeter({ score }: { score: number }) {
  return (
    <div>
      <div className="text-4xl font-semibold">{score}</div>
      <div className="text-sm text-neutral-500">
        EUNOIA Trust Score
      </div>
    </div>
  );
}

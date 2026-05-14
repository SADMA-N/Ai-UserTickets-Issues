export function FallbackBanner() {
  return (
    <div className="rounded-md border border-amber-700 bg-amber-950/30 px-4 py-3 text-amber-200 text-sm">
      <strong className="font-semibold">AI fallback used.</strong> Phase 2
      could not fully complete; the response below was generated via fallback
      logic and may need agent review.
    </div>
  );
}

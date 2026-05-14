interface LoaderProps {
  message?: string;
  attempt?: number;
}

export function Loader({
  message = "Processing your ticket…",
  attempt,
}: LoaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="w-12 h-12 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-slate-300">{message}</p>
      {attempt !== undefined && attempt > 1 && (
        <p className="text-xs text-slate-500">Checking status… ({attempt})</p>
      )}
    </div>
  );
}

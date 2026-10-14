export default function Alert({ type = 'error', message }) {
  if (!message) return null;

  const isError = type === 'error';

  return (
    <div
      role="alert"
      className={`p-3.5 mb-5 text-sm rounded-xl border flex items-start gap-3 transition-all animate-fadeIn ${
        isError
          ? 'bg-rose-50 border-rose-200/80 text-rose-800'
          : 'bg-emerald-50 border-emerald-200/80 text-emerald-800'
      }`}
    >
      <div className="shrink-0 mt-0.5">
        {isError ? (
          <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <div className="flex-1 font-medium leading-relaxed">{message}</div>
    </div>
  );
}

export default function SplitLayout({ children, rightContent }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background ambient subtle glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl"></div>
      </div>

      <div className="bg-white shadow-card hover:shadow-card-hover rounded-2xl overflow-hidden flex flex-col md:flex-row max-w-4xl w-full min-h-[580px] border border-slate-200/80 transition-shadow duration-300">
        {/* Form Panel (Left) */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative">
          {children}
        </div>

        {/* Brand / Hero Panel (Right) */}
        <div className="hidden md:flex w-1/2 bg-slate-900 p-8 lg:p-12 flex-col justify-between relative overflow-hidden text-white">
          {/* Subtle gradient pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-slate-950/80 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            {rightContent}
          </div>
        </div>
      </div>
    </div>
  );
}

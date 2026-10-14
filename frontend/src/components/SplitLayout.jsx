export default function SplitLayout({ children, rightContent }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-panel-left shadow-lg rounded-2xl overflow-hidden flex max-w-4xl w-full h-[600px]">
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative bg-panel-left">
          {children}
        </div>
        <div className="hidden md:flex w-1/2 bg-panel-right p-12 flex-col justify-center items-center text-center">
          {rightContent}
        </div>
      </div>
    </div>
  );
}

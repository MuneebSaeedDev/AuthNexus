import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  // Format dates securely
  const formatDate = (timestamp) => {
    if (timestamp === null || timestamp === undefined || timestamp === '') return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen p-8 bg-background flex flex-col items-center">
      <div className="w-full max-w-2xl bg-panel-left rounded-xl shadow-sm border border-gray-200 p-8">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            Log Out
          </button>
        </header>

        {/* Dashboard Card */}
        <div className="bg-panel-right rounded-lg p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Welcome back, <span className="text-primary">{user?.name}</span>
          </h2>

          <div className="space-y-4">

            {/* ID & Email Info */}
            <div className="bg-white p-4 rounded border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <p className="text-sm text-gray-500 font-medium">User ID</p>
                 <p className="text-gray-900 font-mono text-sm mt-1">{user?.id}</p>
               </div>
               <div>
                 <p className="text-sm text-gray-500 font-medium">Email Address</p>
                 <p className="text-gray-900 text-sm mt-1">{user?.email}</p>
               </div>
            </div>

            {/* Session Information */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                Active Session Token
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Generated On (Login Time)</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(user?.session?.issuedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Valid Until (Expiry Time)</p>
                  <p className="text-sm focus-accent text-primary mt-1 font-medium">
                    {formatDate(user?.session?.expiresAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Session Duration</p>
                  <p className="text-sm text-gray-900 mt-1 bg-gray-100 inline-block px-2 py-0.5 rounded">
                    {user?.session?.duration || '7 Days'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Token State</p>
                  <p className="text-sm text-green-600 mt-1 font-medium flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    Valid & Secure
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

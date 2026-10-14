import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout, AllUsersFetch, deleteUserById } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState('');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const isAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (isAdmin) {
      setLoadingUsers(true);
      setUsersError('');

      AllUsersFetch()
        .then((res) => {
          setUsersList(res.data || []);
        })
        .catch((error) => {
          setUsersError(
            error.response?.data?.message || 'Failed to load users list'
          );
        })
        .finally(() => {
          setLoadingUsers(false);
        });
    }
  }, [isAdmin, AllUsersFetch]);

  // Handle Delete User
  const handleDeleteUser = async (targetUser) => {
    if (targetUser.role === 'super_admin') {
      setActionMessage({ type: 'error', text: 'Super Admin cannot be deleted!' });
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${targetUser.name}" (${targetUser.email})?`
    );
    if (!confirmed) return;

    try {
      setDeletingId(targetUser._id);
      setActionMessage({ type: '', text: '' });
      await deleteUserById(targetUser._id);

      setUsersList((prev) => prev.filter((u) => u._id !== targetUser._id));
      if (expandedUserId === targetUser._id) {
        setExpandedUserId(null);
      }
      setActionMessage({ type: 'success', text: `User "${targetUser.name}" successfully deleted.` });
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete user.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle View / Details Dropdown
  const toggleViewUser = (id) => {
    setExpandedUserId((prev) => (prev === id ? null : id));
  };

  // Format dates securely
  const formatDate = (timestamp) => {
    if (timestamp === null || timestamp === undefined || timestamp === '') return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-10 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-8">

        {/* Top Navbar Header */}
        <header className="bg-white rounded-2xl shadow-card border border-slate-200/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  AuthNexus
                </h1>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">{user?.name}</span>
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">{user?.email}</span>
            </div>

            <button
              onClick={logout}
              type="button"
              className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/90 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 hover:border-rose-200 px-3.5 py-2 rounded-xl transition-all duration-150 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Account Overview Card */}
        <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-200/60 text-blue-600 font-bold flex items-center justify-center text-lg shadow-xs uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Welcome, {user?.name}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-500">Verified User Account</span>
                  <span className="text-slate-300">•</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                    isAdmin ? 'bg-purple-50 text-purple-700 border border-purple-200/60' : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                  }`}>
                    {isAdmin ? 'Super Admin' : 'Standard User'}
                  </span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Session Authenticated & Active
            </div>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Unique Identity (ID)</span>
              <p className="text-slate-900 font-mono text-xs sm:text-sm mt-1 break-all select-all font-medium">
                {user?.id}
              </p>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/70 flex flex-col justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Email</span>
              <p className="text-slate-900 text-sm font-medium mt-1 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Active Session Token */}
          <div className="rounded-xl border border-slate-200/80 p-5 bg-gradient-to-b from-white to-slate-50/50 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Session Token Metadata
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Stateless JWT Bearer
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-medium">Issued At (Login)</p>
                <p className="text-sm text-slate-800 font-medium mt-1">
                  {formatDate(user?.session?.issuedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Valid Until (Expiry)</p>
                <p className="text-sm text-blue-600 font-semibold mt-1">
                  {formatDate(user?.session?.expiresAt)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-medium">Session Duration</p>
                <div className="mt-1">
                  <span className="text-xs text-slate-700 font-semibold bg-white border border-slate-200 px-2.5 py-0.5 rounded-md inline-block shadow-xs">
                    {user?.session?.duration || '7 Days'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Super Admin Section */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow-card border border-slate-200/80 p-6 sm:p-8 space-y-6">
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Registered System Accounts</h2>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                    Administrator Scope
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Read, inspect, and manage system accounts via authorized backend endpoints.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
                Total Users: {usersList.length}
              </span>
            </div>

            {/* Alerts */}
            {actionMessage.text && (
              <div
                className={`p-3.5 text-sm rounded-xl border flex items-center gap-2.5 transition-all ${
                  actionMessage.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <span className="font-bold">{actionMessage.type === 'error' ? 'Error:' : 'Success:'}</span>
                <span>{actionMessage.text}</span>
              </div>
            )}

            {/* Loading */}
            {loadingUsers && (
              <div className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-slate-200/70">
                <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-blue-600 border-t-transparent mb-2"></div>
                <p className="text-sm font-medium">Querying users from database...</p>
              </div>
            )}

            {/* Error */}
            {!loadingUsers && usersError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                <p className="font-semibold">Failed to fetch users</p>
                <p className="text-xs mt-1 text-rose-600">{usersError}</p>
              </div>
            )}

            {/* Empty */}
            {!loadingUsers && !usersError && usersList.length === 0 && (
              <div className="py-12 text-center text-slate-500 bg-slate-50/50 rounded-xl border border-slate-200/70">
                <p className="text-sm font-medium">No registered users found.</p>
              </div>
            )}

            {/* Users List */}
            {!loadingUsers && !usersError && usersList.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
                {/* Header row (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3.5 bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <div className="col-span-4">User Details</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">System Role</div>
                  <div className="col-span-2">Registered At</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-slate-100">
                  {usersList.map((item) => {
                    const isExpanded = expandedUserId === item._id;
                    const isDeleting = deletingId === item._id;
                    const isSuperAdminUser = item.role === 'super_admin';

                    return (
                      <div key={item._id} className="transition-colors">
                        {/* Main Row */}
                        <div
                          className={`p-4 sm:px-5 sm:py-3.5 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center hover:bg-slate-50/70 transition-colors ${
                            isExpanded ? 'bg-blue-50/20' : ''
                          }`}
                        >
                          {/* User Identity */}
                          <div className="col-span-4 flex items-center gap-3 w-full min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 text-blue-600 font-bold flex items-center justify-center text-xs uppercase shrink-0 border border-slate-200">
                              {item.name ? item.name.charAt(0) : 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 text-sm truncate">{item.name}</p>
                              <p className="text-[11px] text-slate-400 font-mono truncate">
                                ID: {item._id}
                              </p>
                            </div>
                          </div>

                          {/* Email */}
                          <div className="col-span-3 w-full min-w-0 text-sm text-slate-600 truncate font-medium">
                            {item.email}
                          </div>

                          {/* Role */}
                          <div className="col-span-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                isSuperAdminUser
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {isSuperAdminUser ? 'Super Admin' : 'Standard User'}
                            </span>
                          </div>

                          {/* Date */}
                          <div className="col-span-2 text-xs text-slate-500 whitespace-nowrap">
                            {formatDate(item.createdAt)}
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 w-full md:w-auto flex items-center justify-end gap-1.5 pt-2 md:pt-0 border-t md:border-0 border-slate-100">
                            <button
                              type="button"
                              onClick={() => toggleViewUser(item._id)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                                isExpanded
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                              }`}
                              title="View Details"
                            >
                              <span>{isExpanded ? 'Hide' : 'View'}</span>
                              <svg
                                className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(item)}
                              disabled={isDeleting || isSuperAdminUser}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                isSuperAdminUser
                                  ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                                  : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300'
                              }`}
                              title={isSuperAdminUser ? 'Super Admin cannot be deleted' : 'Delete user'}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Accordion Panel */}
                        {isExpanded && (
                          <div className="border-t border-b border-slate-200/90 bg-slate-50/80 p-5 sm:p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                                Detailed MongoDB Profile Attributes
                              </h4>
                              <span className="text-[11px] text-slate-500 font-mono">
                                Document ID: {item._id}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  Identity Profile
                                </h5>
                                <div>
                                  <p className="text-xs text-slate-400 font-medium">Display Name</p>
                                  <p className="text-sm font-semibold text-slate-900 mt-0.5">
                                    {item.name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400 font-medium">Email Address</p>
                                  <p className="text-sm text-slate-800 font-mono mt-0.5 select-all">
                                    {item.email}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400 font-medium">Assigned Role</p>
                                  <div className="mt-1">
                                    <span
                                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                        isSuperAdminUser
                                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                                      }`}
                                    >
                                      {item.role}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                  Timestamps & Integrity
                                </h5>
                                <div>
                                  <p className="text-xs text-slate-400 font-medium">Created On</p>
                                  <p className="text-sm text-slate-800 mt-0.5 font-medium">
                                    {formatDate(item.createdAt)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400 font-medium">Last Modified</p>
                                  <p className="text-sm text-slate-800 mt-0.5 font-medium">
                                    {formatDate(item.updatedAt || item.createdAt)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400 font-medium">Password Integrity</p>
                                  <p className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                    Hashed with bcrypt (Protected)
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

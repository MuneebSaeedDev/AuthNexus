import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SplitLayout from '../components/SplitLayout';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
// import { useAuth } from '../context/AuthContext';

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [error, setError] = useState('');
  // const [loading, setLoading] = useState(false);
  // const { login } = useAuth();

  const dispatch = useDispatch();

  const { loginStatus, loginError } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     await login(email, password);
  //     navigate('/dashboard');
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        loginUser({ email, password })
      ).unwrap();

      navigate("/dashboard");
    } catch {
      // Error authSlice mein save ho chuka hai.
    }
  };

  const RightContent = (
    <>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span className="font-semibold tracking-wide text-sm text-slate-200">AuthNexus</span>
      </div>

      <div className="my-auto py-8 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
          Secure Authentication
        </h2>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
          Robust, token-based session management and identity verification for your applications.
        </p>

        <div className="mt-8 flex items-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            JWT Encrypted
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Role Isolation
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>v1.0.0</span>
        <span>Standard Security Protocol</span>
      </div>
    </>
  );

  return (
    <SplitLayout rightContent={RightContent}>
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          Sign In
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Enter your registered email and password to access your account.
        </p>
      </div>

      {/* <Alert message={error} type="error" /> */}

      <Alert message={loginError} type="error" /> 

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          }
        />
        <InputField
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />

        {/* <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-150 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button> */}
        <button
          type="submit"
          disabled={loginStatus === "loading"}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 px-4 rounded-xl font-medium text-sm disabled:opacity-60"
        >
          {loginStatus === "loading"
            ? "Signing in..."
            : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors">
          Create an account
        </Link>
      </p>
    </SplitLayout>
  );
}

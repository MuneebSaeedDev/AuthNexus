import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SplitLayout from '../components/SplitLayout';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const RightContent = (
    <>
      <h2 className="text-2xl font-bold text-text-primary mb-4">Welcome Back</h2>
      <p className="text-gray-600 mb-8">
        Sign in to access your dashboard and continue where you left off.
      </p>
      <div className="w-64 h-64 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>
    </>
  );

  return (
    <SplitLayout rightContent={RightContent}>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Log In</h1>
      <p className="text-gray-500 mb-8">Enter your details to access your account</p>

      <Alert message={error} type="error" />

      <form onSubmit={handleSubmit}>
        <InputField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <InputField
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-lg font-medium transition-colors mt-4 disabled:opacity-70"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary hover:text-primary-hover font-medium">
          Sign up
        </Link>
      </p>
    </SplitLayout>
  );
}

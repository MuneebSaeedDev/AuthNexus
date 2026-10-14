import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SplitLayout from '../components/SplitLayout';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      await signup(name, email, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create an account.');
    } finally {
      setLoading(false);
    }
  };

  const RightContent = (
    <>
      <h2 className="text-2xl font-bold text-text-primary mb-4">Join Us Today</h2>
      <p className="text-gray-600 mb-8">
        Create an account to unlock all features and manage your settings seamlessly.
      </p>
      <div className="w-64 h-64 mx-auto bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </div>
    </>
  );

  return (
    <SplitLayout rightContent={RightContent}>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
      <p className="text-gray-500 mb-8">Fill in your details to get started</p>

      <Alert message={error} type="error" />

      <form onSubmit={handleSubmit}>
        <InputField
          label="Full Name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
        />
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
        <InputField
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-hover text-white py-2 px-4 rounded-lg font-medium transition-colors mt-2 disabled:opacity-70"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-hover font-medium">
          Log in
        </Link>
      </p>
    </SplitLayout>
  );
}

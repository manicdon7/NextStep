import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../constants';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, credentials);
      const { token, user } = response.data;

      // Store token and user data in localStorage
      localStorage.setItem('adminToken', token);
      localStorage.setItem('user', JSON.stringify(user)); // Store user object with email and role
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1324] to-[#1A2540] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1E293B] p-8 rounded-lg border border-[#AD46FF]/30">
        <h2 className="text-2xl font-bold text-[#AD46FF] mb-6 text-center">Admin Login</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded bg-[#0D1324] border border-gray-700 text-white focus:outline-none focus:border-[#AD46FF]"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded bg-[#0D1324] border border-gray-700 text-white focus:outline-none focus:border-[#AD46FF]"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-[#AD46FF] hover:bg-[#AD46FF]/90 text-white py-2 px-4 rounded transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
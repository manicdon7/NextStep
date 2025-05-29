import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalResources: 0,
    activeUsers: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail')
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D1324] to-[#1A2540] flex items-center justify-center">
        <div className="text-[#AD46FF] text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D1324] to-[#1A2540]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-[#AD46FF]/90 hover:bg-[#AD46FF] text-white px-4 py-2 rounded transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
            <h3 className="text-gray-400 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-[#AD46FF]">{stats.totalUsers}</p>
          </div>
          <div className="bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
            <h3 className="text-gray-400 mb-2">Total Resources</h3>
            <p className="text-3xl font-bold text-[#AD46FF]">{stats.totalResources}</p>
          </div>
          <div className="bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
            <h3 className="text-gray-400 mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-[#AD46FF]">{stats.activeUsers}</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-[#1E293B] p-6 rounded-lg border border-[#AD46FF]/30">
          <h2 className="text-xl font-bold text-[#AD46FF] mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="bg-[#0D1324] p-4 rounded-lg border border-[#AD46FF]/20 hover:border-[#AD46FF]/50 cursor-pointer transition-all"
              onClick={() => navigate('/admin/add-resource')}
            >
              <h3 className="text-lg font-medium text-white mb-2">Add New Resource</h3>
              <p className="text-gray-300 text-sm">
                Create new resources or detailed resources for users to access.
              </p>
            </div>
            <div className="bg-[#0D1324] p-4 rounded-lg border border-[#AD46FF]/20">
              <h3 className="text-lg font-medium text-white mb-2">Manage Users</h3>
              <p className="text-gray-300 text-sm">View and manage user accounts (coming soon).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
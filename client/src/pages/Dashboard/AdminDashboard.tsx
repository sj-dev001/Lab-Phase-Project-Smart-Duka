import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  vendorProfile?: { storeName: string; approved: boolean };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [pendingVendors, setPendingVendors] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'vendors'>('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login');
    else loadData();
  }, [user, navigate]);

  async function loadData() {
    try {
      const [analyticsRes, usersRes, pendingRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/vendors/pending'),
      ]);
      setAnalytics(analyticsRes.data.data);
      setUsers(usersRes.data.data.users);
      setPendingVendors(pendingRes.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function approveVendor(id: string) {
    try {
      await api.put(`/admin/vendors/${id}`);
      toast.success('Vendor approved');
      loadData();
    } catch {
      toast.error('Failed to approve vendor');
    }
  }

  async function toggleUserStatus(id: string, isActive: boolean) {
    try {
      await api.put(`/admin/users/${id}`, { isActive: !isActive });
      toast.success('User status updated');
      loadData();
    } catch {
      toast.error('Failed to update user');
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm mb-1">Customers</h3>
          <p className="text-3xl font-bold">{analytics.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm mb-1">Vendors</h3>
          <p className="text-3xl font-bold">{analytics.totalVendors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm mb-1">Products</h3>
          <p className="text-3xl font-bold">{analytics.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm mb-1">Orders</h3>
          <p className="text-3xl font-bold">{analytics.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 text-sm mb-1">Revenue</h3>
          <p className="text-3xl font-bold">KES {analytics.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'overview' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'vendors' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
        >
          Pending Vendors ({pendingVendors.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold p-6 border-b">All Users</h2>
          <div className="divide-y">
            {users.map((u) => (
              <div key={u._id} className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email} | {u.role}</p>
                </div>
                <button
                  onClick={() => toggleUserStatus(u._id, u.isActive)}
                  className={`px-3 py-1 rounded text-sm ${
                    u.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {u.isActive ? 'Active' : 'Suspended'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vendors' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold p-6 border-b">Pending Vendor Applications</h2>
          {pendingVendors.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No pending applications</div>
          ) : (
            <div className="divide-y">
              {pendingVendors.map((v) => (
                <div key={v._id} className="p-6 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{v.name}</p>
                    <p className="text-sm text-gray-500">
                      {v.email} | Store: {v.vendorProfile?.storeName}
                    </p>
                  </div>
                  <button
                    onClick={() => approveVendor(v._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

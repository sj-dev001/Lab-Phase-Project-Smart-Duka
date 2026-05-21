import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchOrders } from '../../features/orders/ordersSlice';
import api from '../../services/api';

export default function CustomerDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: orders, loading } = useSelector((state: RootState) => state.orders);
  const [vendorStatus, setVendorStatus] = useState<'none' | 'pending' | 'approved'>('none');

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role === 'vendor') navigate('/dashboard/vendor');
    else if (user.role === 'admin') navigate('/dashboard/admin');
    else {
      dispatch(fetchOrders());
      if (user.vendorProfile) {
        setVendorStatus(user.vendorProfile.approved ? 'approved' : 'pending');
      }
    }
  }, [user, navigate, dispatch]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 mb-1">Total Orders</h3>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 mb-1">Active Orders</h3>
          <p className="text-3xl font-bold">
            {orders.filter((o) => ['pending', 'confirmed'].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 mb-1">Delivered</h3>
          <p className="text-3xl font-bold">
            {orders.filter((o) => o.status === 'delivered').length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Become a Vendor</h2>
        </div>
        {vendorStatus === 'none' ? (
          <Link
            to="/dashboard/vendor"
            className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Apply for Vendor Account
          </Link>
        ) : vendorStatus === 'pending' ? (
          <p className="text-yellow-600">Your vendor application is pending approval</p>
        ) : (
          <p className="text-green-600">Your vendor account is active</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold p-6 border-b">My Orders</h2>
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No orders yet.{' '}
            <Link to="/shop" className="text-primary-600 hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order._id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {order.items.map((i) => i.name).join(', ')}
                </p>
                <p className="font-bold mt-1">
                  KES {order.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

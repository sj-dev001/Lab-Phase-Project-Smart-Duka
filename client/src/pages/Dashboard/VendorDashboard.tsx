import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
}

interface Order {
  _id: string;
  customer: { name: string; email: string };
  items: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export default function VendorDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role === 'customer') {
      if (!user.vendorProfile) {
        const registerVendor = async () => {
          try {
            await api.post('/vendors/register', {
              storeName: `${user.name}'s Store`,
              description: '',
              phone: '',
              address: '',
            });
            toast.success('Vendor registration submitted');
          } catch {
            navigate('/dashboard');
          }
        };
        registerVendor();
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && (user.role === 'vendor' || user.role === 'admin')) {
      loadData();
      api.get('/categories').then((res) => setCategories(res.data.data));
    }
  }, [user]);

  async function loadData() {
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get(`/vendors/${user!._id}/products`),
        api.get(`/vendors/${user!._id}/orders`),
      ]);
      setProducts(prodRes.data.data);
      setOrders(orderRes.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
      });
      toast.success('Product created');
      setShowForm(false);
      setForm({ name: '', description: '', price: '', category: '', stock: '' });
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    }
  }

  async function toggleProduct(id: string, isActive: boolean) {
    try {
      await api.put(`/products/${id}`, { isActive: !isActive });
      loadData();
    } catch (err: any) {
      toast.error('Failed to update product');
    }
  }

  async function updateOrderStatus(orderId: string, status: string) {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated');
      loadData();
    } catch {
      toast.error('Failed to update order');
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 mb-1">Products</h3>
          <p className="text-3xl font-bold">{products.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 mb-1">Orders</h3>
          <p className="text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-gray-500 mb-1">Pending Orders</h3>
          <p className="text-3xl font-bold">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'products' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">My Products</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreateProduct} className="p-6 border-b space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                  min="0"
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Create Product
              </button>
            </form>
          )}

          <div className="divide-y">
            {products.map((product) => (
              <div key={product._id} className="p-6 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    KES {product.price.toLocaleString()} | Stock: {product.stock}
                  </p>
                </div>
                <button
                  onClick={() => toggleProduct(product._id, product.isActive)}
                  className={`px-3 py-1 rounded text-sm ${
                    product.isActive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold p-6 border-b">Incoming Orders</h2>
          {orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No orders yet</div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order._id} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">
                        {order.customer?.name} | {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600">
                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                  </p>
                  <p className="font-bold mt-1">KES {order.totalAmount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

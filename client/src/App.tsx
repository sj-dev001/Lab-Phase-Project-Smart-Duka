import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CustomerDashboard from './pages/Dashboard/CustomerDashboard';
import VendorDashboard from './pages/Dashboard/VendorDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PaymentVerify from './pages/PaymentVerify';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 via-slate-50 to-orange-50/50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/dashboard/vendor" element={<VendorDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/payment/verify" element={<PaymentVerify />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Smart Duka
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
              <Link to="/shop" className="text-gray-600 hover:text-primary-600">Shop</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative text-gray-600 hover:text-primary-600">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={
                    user.role === 'admin'
                      ? '/dashboard/admin'
                      : user.role === 'vendor'
                      ? '/dashboard/vendor'
                      : '/dashboard'
                  }
                  className="text-gray-600 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="text-gray-600 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-primary-600">Login</Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

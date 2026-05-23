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
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-slate-950">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-base font-black text-white shadow-lg shadow-primary-200">
                SD
              </span>
              <span>Smart Duka</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link to="/" className="font-medium text-slate-600 hover:text-primary-600">Home</Link>
              <Link to="/shop" className="font-medium text-slate-600 hover:text-primary-600">Shop</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative font-medium text-slate-600 hover:text-primary-600">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-3 -right-5 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
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
                  className="font-medium text-slate-600 hover:text-primary-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => dispatch(logout())}
                  className="font-medium text-slate-600 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="font-medium text-slate-600 hover:text-primary-600">Login</Link>
                <Link
                  to="/register"
                  className="rounded-full bg-slate-950 px-4 py-2 font-semibold text-white shadow-sm hover:bg-primary-700"
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

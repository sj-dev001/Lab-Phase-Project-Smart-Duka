import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../features/products/productsSlice';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: '8' }));
  }, [dispatch]);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Smart Duka</h1>
          <p className="text-xl mb-8 text-primary-100">
            Discover unique products from local vendors in your area
          </p>
          <Link
            to="/shop"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition"
              >
                <img
                  src={product.images[0] || 'https://placehold.co/600x400?text=Product'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-primary-600 font-bold text-xl">
                    KES {product.price.toLocaleString()}
                  </p>
                  {product.vendor?.vendorProfile?.storeName && (
                    <p className="text-gray-500 text-sm">{product.vendor.vendorProfile.storeName}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Link
            to="/shop"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
          >
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: '8' }));
  }, [dispatch]);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1800&q=85"
          alt="Curated shopping shelves"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-emerald-950/85 to-orange-900/35" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-100 ring-1 ring-white/15 backdrop-blur">
              Local vendors. Better finds. Fast checkout.
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Smart Duka
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">
              Shop everyday essentials, electronics, fashion, home goods, and beauty picks from trusted vendors near you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-full bg-white px-7 py-3 font-bold text-slate-950 shadow-xl shadow-black/20 hover:bg-emerald-50"
              >
                Start Shopping
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-orange-200/40 px-7 py-3 font-bold text-white backdrop-blur hover:bg-white/10"
              >
                Join Smart Duka
              </Link>
            </div>
          </div>

          <div className="mt-10 hidden rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur lg:block">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['80+', 'Products'],
                ['24 hr', 'Vendor response'],
                ['KES', 'Local pricing'],
                ['4.8', 'Avg rating'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg bg-white p-5 text-slate-950">
                  <p className="text-3xl font-black text-emerald-700">{value}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase text-orange-600">Fresh picks</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Featured Products</h2>
          </div>
          <Link
            to="/shop"
            className="w-fit rounded-full bg-slate-950 px-5 py-3 font-bold text-white shadow-sm hover:bg-primary-700"
          >
            View All Products
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../features/products/productsSlice';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function Shop() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, pagination, loading } = useSelector(
    (state: RootState) => state.products
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const currentCategory = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    const params: Record<string, any> = { page, limit: 12 };
    if (currentCategory) params.category = currentCategory;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    dispatch(fetchProducts(params));
  }, [dispatch, currentCategory, search, sort, page]);

  function updateParams(updates: Record<string, string>) {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });
    setSearchParams(newParams);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-lg bg-gradient-to-r from-slate-950 via-emerald-900 to-orange-700 px-6 py-8 text-white shadow-xl shadow-emerald-100 sm:px-8">
        <p className="text-sm font-bold uppercase text-orange-100">Marketplace</p>
        <div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-black md:text-5xl">Shop Smart Duka</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Browse verified vendor products with clear stock, local pricing, and quick checkout.
            </p>
          </div>
          <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
            {pagination.total || products.length} products available
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="w-full shrink-0 md:w-72">
          <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold text-slate-700">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => updateParams({ search: e.target.value, page: '1' })}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none ring-primary-100 focus:border-primary-400 focus:ring-4"
              />
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-bold text-slate-900">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => updateParams({ category: '', page: '1' })}
                  className={`block w-full rounded-lg px-3 py-2 text-left font-semibold transition ${
                    !currentCategory
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParams({ category: cat._id, page: '1' })}
                    className={`block w-full rounded-lg px-3 py-2 text-left font-semibold transition ${
                      currentCategory === cat._id
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-bold text-slate-900">Sort By</h3>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  updateParams({ sort: e.target.value, page: '1' });
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-3 outline-none ring-primary-100 focus:border-primary-400 focus:ring-4"
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center">
              <p className="text-lg font-bold text-slate-700">No products found</p>
              <p className="mt-2 text-slate-500">Try another search or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      className={`rounded-lg px-4 py-2 font-bold ${
                        p === pagination.page
                          ? 'bg-primary-600 text-white'
                          : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

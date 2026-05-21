import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProducts } from '../features/products/productsSlice';
import api from '../services/api';

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => updateParams({ search: e.target.value, page: '1' })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              <button
                onClick={() => updateParams({ category: '', page: '1' })}
                className={`block w-full text-left px-3 py-2 rounded ${
                  !currentCategory ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => updateParams({ category: cat._id, page: '1' })}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    currentCategory === cat._id
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Sort By</h3>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); updateParams({ sort: e.target.value, page: '1' }); }}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-primary-600 font-bold text-lg">
                        KES {product.price.toLocaleString()}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {product.vendor?.vendorProfile?.storeName || 'Vendor'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParams({ page: String(p) })}
                      className={`px-4 py-2 rounded ${
                        p === pagination.page
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
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

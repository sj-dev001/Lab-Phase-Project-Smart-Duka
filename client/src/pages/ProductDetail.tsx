import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchProduct, clearSelected } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const fallbackProductImage =
  'https://placehold.co/1200x900/065f46/ffffff/png?text=Smart+Duka';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selected: product, loading } = useSelector((state: RootState) => state.products);
  const { user } = useSelector((state: RootState) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
    return () => { dispatch(clearSelected()); };
  }, [id, dispatch]);

  function handleAddToCart() {
    if (!product) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0] || '',
        stock: product.stock,
      })
    );
    toast.success('Added to cart');
  }

  function handleBuyNow() {
    handleAddToCart();
    navigate('/cart');
  }

  if (loading || !product) {
    return <div className="py-20 text-center font-semibold text-slate-500">Loading...</div>;
  }

  const productImage = product.images[0] || fallbackProductImage;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <img
            src={productImage}
            alt={product.name}
            onError={(event) => {
              if (event.currentTarget.src !== fallbackProductImage) {
                event.currentTarget.src = fallbackProductImage;
              }
            }}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-5 flex flex-wrap gap-2">
            {product.category?.name && (
              <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700">
                {product.category.name}
              </span>
            )}
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>

          <h1 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-4 text-4xl font-black text-primary-600">
            KES {product.price.toLocaleString()}
          </p>

          <div className="mt-4">
            <span className="text-yellow-500">
              {'★'.repeat(Math.round(product.rating))}
              {'☆'.repeat(5 - Math.round(product.rating))}
            </span>
            <span className="ml-2 text-slate-500">({product.numReviews} reviews)</span>
          </div>

          <p className="mt-6 border-y border-slate-100 py-6 leading-8 text-slate-600">
            {product.description}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Vendor</p>
              <p className="mt-1 font-bold text-slate-950">
                {product.vendor?.vendorProfile?.storeName || 'Vendor'}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-500">Availability</p>
              <p className={product.stock > 0 ? 'mt-1 font-bold text-emerald-600' : 'mt-1 font-bold text-red-600'}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </p>
            </div>
          </div>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <span className="font-bold text-slate-700">Quantity</span>
              <div className="flex items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  -
                </button>
                <span className="min-w-12 px-4 py-2 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 text-lg font-bold text-slate-600 hover:bg-slate-100"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 rounded-full bg-primary-600 py-3 font-bold text-white shadow-lg shadow-primary-100 hover:bg-primary-700 disabled:bg-slate-300 disabled:shadow-none"
            >
              Add to Cart
            </button>
            {user && (
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 rounded-full bg-slate-950 py-3 font-bold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 disabled:bg-slate-300 disabled:shadow-none"
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

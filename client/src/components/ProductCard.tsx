import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    images: string[];
    category?: { name: string };
    vendor?: { vendorProfile?: { storeName: string } };
    stock?: number;
    rating?: number;
  };
}

const fallbackImage =
  'https://placehold.co/900x700/065f46/ffffff/png?text=Smart+Duka';

export default function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0] || fallbackImage;
  const vendorName = product.vendor?.vendorProfile?.storeName || 'Smart Duka Vendor';
  const isLowStock = typeof product.stock === 'number' && product.stock > 0 && product.stock <= 10;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={product.name}
          onError={(event) => {
            if (event.currentTarget.src !== fallbackImage) {
              event.currentTarget.src = fallbackImage;
            }
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/55 to-transparent" />
        {product.category?.name && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur">
            {product.category.name}
          </span>
        )}
        {isLowStock && (
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-950 shadow-sm">
            Low stock
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-slate-950 group-hover:text-primary-700">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
            {product.description || vendorName}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">{vendorName}</p>
            <p className="text-xl font-black text-emerald-700">
              KES {product.price.toLocaleString()}
            </p>
          </div>
          <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-orange-700">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}

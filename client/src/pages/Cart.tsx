import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/shop" className="text-primary-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.product} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
            <img
              src={item.image || 'https://placehold.co/100x100?text=Product'}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-primary-600 font-bold">
                KES {item.price.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => dispatch(updateQuantity({ product: item.product, quantity: item.quantity - 1 }))}
                className="px-3 py-1 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                onClick={() => dispatch(updateQuantity({ product: item.product, quantity: item.quantity + 1 }))}
                className="px-3 py-1 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <p className="font-bold w-24 text-right">
              KES {(item.price * item.quantity).toLocaleString()}
            </p>
            <button
              onClick={() => dispatch(removeFromCart(item.product))}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span>Total:</span>
          <span>KES {total.toLocaleString()}</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => dispatch(clearCart())}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Clear Cart
          </button>
          <Link
            to="/checkout"
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-primary-700"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

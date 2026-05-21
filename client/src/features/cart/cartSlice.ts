import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find((i) => i.product === action.payload.product);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + action.payload.quantity, existing.stock);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    updateQuantity(state, action: PayloadAction<{ product: string; quantity: number }>) {
      const item = state.items.find((i) => i.product === action.payload.product);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
    },
    clearCart(state) {
      state.items = [];
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

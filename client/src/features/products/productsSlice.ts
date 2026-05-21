import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: { _id: string; name: string; slug: string };
  vendor: { _id: string; name: string; vendorProfile?: { storeName: string } };
  stock: number;
  rating: number;
  numReviews: number;
}

interface ProductsState {
  items: Product[];
  selected: Product | null;
  pagination: { page: number; limit: number; total: number; pages: number };
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selected: null,
  pagination: { page: 1, limit: 20, total: 0, pages: 0 },
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: Record<string, any> | undefined, { rejectWithValue }) => {
    try {
      const res = await api.get('/products', { params });
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch product');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelected } = productsSlice.actions;
export default productsSlice.reducer;

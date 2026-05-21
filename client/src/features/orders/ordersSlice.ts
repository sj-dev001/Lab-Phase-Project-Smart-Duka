import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface Order {
  _id: string;
  customer: { _id: string; name: string; email: string };
  vendor: string;
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  totalAmount: number;
  status: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
}

interface OrdersState {
  items: Order[];
  selected: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  selected: null,
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/orders');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await api.post('/orders', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSelectedOrder(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });
  },
});

export const { clearSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

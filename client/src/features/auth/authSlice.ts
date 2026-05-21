import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin';
  isActive: boolean;
  vendorProfile?: {
    storeName: string;
    description: string;
    logo: string;
    phone: string;
    address: string;
    approved: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/register', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/me');
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

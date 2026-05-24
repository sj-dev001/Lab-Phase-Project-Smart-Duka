// FILE: seed/sources/fakestore.ts
import axios from 'axios';

export async function fetchFakeStore(): Promise<any[]> {
  const url = 'https://fakestoreapi.com/products';
  const res = await axios.get(url, { timeout: 15000 });
  return res.data || [];
}

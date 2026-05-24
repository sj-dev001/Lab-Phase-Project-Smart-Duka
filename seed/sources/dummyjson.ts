// FILE: seed/sources/dummyjson.ts
import axios from 'axios';

export async function fetchDummyJSON(): Promise<any[]> {
  const url = 'https://dummyjson.com/products?limit=100';
  const res = await axios.get(url, { timeout: 15000 });
  const data = res.data?.products || [];
  return data;
}

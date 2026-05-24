// FILE: seed/sources/platzi.ts
import axios from 'axios';

export async function fetchPlatzi(): Promise<any[]> {
  const url = 'https://api.escuelajs.co/api/v1/products';
  const res = await axios.get(url, { timeout: 15000 });
  return res.data || [];
}

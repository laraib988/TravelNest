/** Production API (Render). Override locally with NEXT_PUBLIC_API_URL in .env.local */
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://travelnest-5ttl.onrender.com/api/v1'
    : 'http://localhost:4000/api/v1');

export async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `API error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`[API Fetch Error] ${endpoint}:`, error);
    throw error;
  }
}

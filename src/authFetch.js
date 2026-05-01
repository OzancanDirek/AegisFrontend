const BASE = "http://localhost:8080";

// Token'ı refresh eden fonksiyon
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("aegis_refresh_token");
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const newToken = data.accessToken || data.token;
    if (newToken) {
      localStorage.setItem("aegis_token", newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
};

// Token expire olunca otomatik refresh yapan authFetch
export const authFetch = async (url, options = {}) => {
  const fullUrl = url.startsWith("http") ? url : `${BASE}${url}`;
  const token = localStorage.getItem("aegis_token");

  const makeRequest = (tkn) =>
    fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tkn}`,
        ...(options.headers || {}),
      },
    });

  let res = await makeRequest(token);

  // 403 gelirse token'ı refresh et ve tekrar dene
  if (res.status === 403) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      res = await makeRequest(newToken);
    } else {
      // Refresh da başarısız → login sayfasına yönlendir
      localStorage.clear();
      window.location.href = "/login";
      return res;
    }
  }

  return res;
};
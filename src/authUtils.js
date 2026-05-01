export function getRole() {
  return localStorage.getItem("role") || null;
}

export function isLoggedIn() {
  return !!localStorage.getItem("aegis_token");
}
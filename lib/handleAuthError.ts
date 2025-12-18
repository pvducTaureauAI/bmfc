export function handleAuthError(response: Response) {
  if (response.status === 401) {
    // Token expired or invalid - logout and redirect
    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    // Clear token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    // Redirect to login
    window.location.href = "/login";
    return true;
  }
  return false;
}

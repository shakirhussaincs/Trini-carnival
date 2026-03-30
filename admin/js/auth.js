/* ---------- Admin Auth Guard ---------- */
(function checkAuth() {
  const path = window.location.pathname;
  const isAuth = localStorage.getItem('admin_auth') === 'true';
  const isLoginPage = path.includes('login.html');

  if (!isAuth && !isLoginPage) {
    window.location.href = '/admin/login.html';
  } else if (isAuth && isLoginPage) {
    window.location.href = '/admin/index.html';
  }
})();

function adminLogout() {
  localStorage.removeItem('admin_auth');
  window.location.href = '/admin/login.html';
}

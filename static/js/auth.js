// Shared auth utilities

function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('session_token');
}

function setToken(t) {
  localStorage.setItem('token', t);
}

function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('session_token');
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = '/login';
  }
}

function authHeaders() {
  return { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json' };
}

function handleLogout() {
  clearToken();
  window.location.href = '/login';
}

function buildNav(activePage) {
  var pages = [
    { href: '/', label: 'Timeline' },
    { href: '/post', label: 'New Post' },
    { href: '/profile', label: 'Profile' },
    { href: '/users', label: 'Users' }
  ];
  var links = pages.map(function(p) {
    return '<a href="' + p.href + '"' + (activePage === p.href ? ' aria-current="page"' : '') + '>' + p.label + '</a>';
  }).join('');
  return '<nav><span class="nav-title">Inkwell</span>' + links + '<button class="nav-btn" id="logoutBtn">Logout</button></nav>';
}

document.addEventListener('DOMContentLoaded', function() {
  var logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('mousedown', handleLogout);
  }
});

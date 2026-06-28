// theme.js - handles light/dark theme switching without page reload

(function () {
  const body = document.body;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const lightLink = document.getElementById('light-theme');
  const darkLink = document.getElementById('dark-theme');

  const SUN_ICON = `
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  `;

  const MOON_ICON = `
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  `;

  function applyTheme(theme) {
    body.classList.add('theme-transitioning');
    body.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      lightLink.disabled = true;
      darkLink.disabled = false;
      themeIcon.innerHTML = MOON_ICON;
    } else {
      lightLink.disabled = false;
      darkLink.disabled = true;
      themeIcon.innerHTML = SUN_ICON;
    }

    localStorage.setItem('rbeh-theme', theme);

    window.clearTimeout(applyTheme._t);
    applyTheme._t = window.setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 500);
  }

  function toggleTheme() {
    const current = body.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Initialize theme from saved preference or system preference
  const savedTheme = localStorage.getItem('rbeh-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(initialTheme);

  themeToggleBtn.addEventListener('click', toggleTheme);
})();

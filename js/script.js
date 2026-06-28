// script.js - general site interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Simple hover lift handled in CSS; here we add a subtle terminal cursor blink
  // and a tiny "typing" re-trigger when terminal enters view.

  const terminalBody = document.getElementById('terminal-body');

  // Re-trigger a fade-in animation on load for the terminal lines
  if (terminalBody) {
    const lines = terminalBody.querySelectorAll('p');
    lines.forEach((line, index) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(6px)';
      line.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 150 + index * 110);
    });
  }

  // Menu dropdown (Tools / Course / Cyber Lab)
  const menuBtn = document.getElementById('menu-btn');
  const menuDropdown = document.getElementById('menu-dropdown');

  if (menuBtn && menuDropdown) {
    const closeMenu = () => {
      menuDropdown.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
      menuDropdown.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    };

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuDropdown.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
      if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }
});

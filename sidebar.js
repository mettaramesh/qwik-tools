// JS for sidebar toggle and live search

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-category').forEach(cat => {
        const header = cat.querySelector('.category-header');
        const items = cat.querySelector('.category-items');

        if (!cat.classList.contains('nav-favourites')) {
            items.classList.remove('expanded'); // collapse everything except favourites
        }

        header.addEventListener('click', () => {
            items.classList.toggle('expanded');
            const chevron = header.querySelector('.chevron');
            if (chevron) chevron.classList.toggle('rotate');
        });
    });

    // Live search for tools (restored robust logic)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const q = this.value.trim().toLowerCase();
        document.querySelectorAll('.nav-category').forEach(navCategory => {
          if (navCategory.classList.contains('nav-favourites')) return;
          const items = navCategory.querySelector('.category-items');
          let hasVisible = false;
          items.querySelectorAll('.nav-item').forEach(link => {
            const text = link.textContent.trim().toLowerCase();
            if (!q || text.includes(q)) {
              link.style.display = '';
              hasVisible = true;
            } else {
              link.style.display = 'none';
            }
          });
          if (q) {
            if (hasVisible) {
              navCategory.style.display = '';
              items.classList.add('expanded');
              items.style.display = '';
            } else {
              navCategory.style.display = 'none';
            }
          } else {
            navCategory.style.display = '';
            items.style.display = '';
            items.classList.remove('expanded');
            items.querySelectorAll('.nav-item').forEach(link => link.style.display = '');
          }
        });
      });
    }
});

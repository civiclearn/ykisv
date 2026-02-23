/* related-articles.js — populates the "More articles" grid on article pages
   Reads /articles.json, excludes the hub entry and current article,
   picks 3 random articles, renders cards into .related-grid */

(function () {
  const grid = document.querySelector('.related-grid');
  if (!grid) return;

  const currentSlug = grid.dataset.articleSlug || '';

  fetch('/articles.json')
    .then(r => r.json())
    .then(articles => {
      /* Filter out the hub entry (url === "/artigos/./") and current article */
      const candidates = articles.filter(a => {
        const slug = a.url.replace(/^\/|\/$/g, '');
        return slug !== currentSlug && !a.url.includes('/./');
      });

      /* Shuffle and pick up to 3 */
      const picked = candidates
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      if (picked.length === 0) {
        grid.closest('.related-articles')?.remove();
        return;
      }

      grid.innerHTML = picked.map(a => `
        <a href="${a.url}" class="related-card">
          <img src="${a.image}" alt="${a.title}" loading="lazy">
          <div class="related-card-body">
            <h3>${a.title}</h3>
            <p>${a.desc}</p>
          </div>
        </a>
      `).join('');
    })
    .catch(() => {
      /* If articles.json doesn't exist yet, hide the section silently */
      grid.closest('.related-articles')?.remove();
    });
})();

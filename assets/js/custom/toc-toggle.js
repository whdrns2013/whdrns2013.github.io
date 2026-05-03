document.addEventListener('DOMContentLoaded', function() {
  const tocHeader = document.querySelector('.toc header');
  const tocMenu = document.querySelector('.toc__menu-container');
  const tocToggle = document.querySelector('.toc__toggle');

  if (tocHeader && tocMenu) {
    tocHeader.style.cursor = 'pointer';
    
    tocHeader.addEventListener('click', function() {
      const isCollapsed = tocMenu.classList.toggle('is-collapsed');
      
      if (tocToggle) {
        const icon = tocToggle.querySelector('i');
        if (isCollapsed) {
          icon.classList.remove('fa-chevron-down');
          icon.classList.add('fa-chevron-right');
        } else {
          icon.classList.remove('fa-chevron-right');
          icon.classList.add('fa-chevron-down');
        }
      }
    });
  }
});

// Loader

window.addEventListener('load', () => {
  document.querySelector('.loader').classList.add('hidden');

  const body = document.querySelector('.page-content');
  body.classList.add('loaded');
});

window.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.foodSwiper', {
    loop: true,
    grabCursor: true, // shows a "grab hand" cursor for dragging
    autoplay: {
      delay: 3000, // move every 3 seconds on its own
      disableOnInteraction: false, // keep autoplaying even after the user drags it
    },
    pagination: { el: '.swiper-pagination', clickable: true },
  });

  const reviewSwiper = new Swiper('.reviewSwiper', {
    slidesPerView: 1, // default = mobile
    spaceBetween: 20,
    grabCursor: true,
    loop: false,

    breakpoints: {
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
      },
    },
  });

  // Hamburger Click

  const menu = document.querySelector('button');
  const media = window.matchMedia('(max-width: 700px)');
  const icon = document.querySelector('.hamburger');
  const i = document.querySelector('.fa-solid');
  const ul = document.querySelector('.links-container');
  const search = document.querySelector('.icons-container');
  const overlay = document.getElementById('overlay');

  // Adds transition when reloads settles
  ul.classList.add('transition-ready');

  // Search Function
  search.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('icon') ||
      e.target.classList.contains('fa-magnifying-glass')
    ) {
      overlay.style.display = 'flex';
    }
  });

  function closeSearch(e) {
    if (e.target.classList.contains('fa-xmark')) {
      overlay.style.display = 'none';
    }
  }

  overlay.addEventListener('click', closeSearch);

  function changeActiveState(e) {
    const li = e.target;

    if (li.tagName === 'A') {
      const parent = li.parentElement.parentElement;
      const a = ul.querySelectorAll('.nav-list a');

      a.forEach((a) => {
        if (a.classList.contains('active')) {
          a.classList.remove('active');
          li.classList.add('active');
        }
      });

      if (e.target) {
        setTimeout(() => {
          parent.classList.remove('active');
          toggleNavbar();
        }, 300);
      }
    }
  }

  ul.addEventListener('click', changeActiveState);

  function toggleNavbar() {
    if (icon.classList.contains('active')) {
      // Turns the menuBar to x and back
      i.classList.replace('fa-xmark', 'fa-bars');

      icon.classList.remove('active');
      i.classList.remove('active');
      ul.classList.remove('active');
    } else {
      icon.classList.add('active');
      i.classList.add('active');
      ul.classList.add('active');

      i.classList.replace('fa-bars', 'fa-xmark');
    }
  }

  menu.addEventListener('click', toggleNavbar);

  let resizeTimer;

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    ul.classList.remove('transition-ready');

    resizeTimer = setTimeout(() => {
      ul.classList.add('transition-ready');
    }, 200);

    if (window.innerWidth > 730 && icon.classList.contains('active')) {
      icon.classList.remove('active');
      i.classList.remove('active');
      ul.classList.remove('active');
      i.classList.replace('fa-xmark', 'fa-bars');
    }
  });
});

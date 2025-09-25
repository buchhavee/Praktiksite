// Theme switcher og burger menu logik
function setupThemeAndMenu() {
  const themeSwitch = document.getElementById("theme-switch");
  const html = document.documentElement;
  if (!themeSwitch) {
    return;
  }

  // Henter gemt theme fra localStorage
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark-theme");
    themeSwitch.checked = true;
  } else if (localStorage.getItem("theme") === "light") {
    html.classList.remove("dark-theme");
    themeSwitch.checked = false;
  } else {
    // Bruger systemets farveskema hvis intet er valgt
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      html.classList.add("dark-theme");
      themeSwitch.checked = true;
    } else {
      html.classList.remove("dark-theme");
      themeSwitch.checked = false;
    }
  }

  themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
      html.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  });

  // Burger menu funktionalitet - så den lukker når man trykker på ting
  const burger = document.getElementById("burger");
  const menuOverlay = document.getElementById("menu-overlay");
  const closeMenu = document.getElementById("close-menu");
  const menuItems = document.querySelectorAll(".menu-item");

  function toggleMenu() {
    menuOverlay?.classList.toggle("open");
  }

  function closeMenuHandler() {
    menuOverlay?.classList.remove("open");
  }

  // Åbner/lukker menu når man trykker på burger
  burger?.addEventListener("click", toggleMenu);

  // Lukker menu når man trykker på X
  closeMenu?.addEventListener("click", closeMenuHandler);

  // Lukker menu når man trykker på et menu punkt
  menuItems.forEach((item) => {
    item.addEventListener("click", closeMenuHandler);
  });

  // Lukker menu når man trykker udenfor
  menuOverlay?.addEventListener("click", (e) => {
    if (e.target === menuOverlay) {
      closeMenuHandler();
    }
  });
}

// Portfolio animationer - får billederne til at fade ind efter hinanden
function initPortfolioAnimations() {
  const portfolioItems = document.querySelectorAll(".portfolio__item");
  let animatedItems = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const index = parseInt(target.dataset.index || "0");

          if (!animatedItems.has(index)) {
            // Giver delay så de kommer frem efter hinanden
            const delay = (index - 1) * 200;

            setTimeout(() => {
              target.classList.add("animate-in");
              animatedItems.add(index);
            }, delay);
          }
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  // Sætter observer på alle portfolio items
  portfolioItems.forEach((item) => {
    observer.observe(item);
  });
}

// Fade-in animationer til andre sektioner på siden
function initGeneralAnimations() {
  function onVisible(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }

  const fadeEls = document.querySelectorAll(".fade-in-section, .fade-in-left");
  const observer = new IntersectionObserver(onVisible, { threshold: 0 });
  fadeEls.forEach((el) => observer.observe(el));
}

// Smooth scroll når man trykker på "about" links
function initSmoothScroll() {
  document.querySelectorAll('a[href="#about"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const target = document.getElementById("about");
      if (target) {
        e.preventDefault();
        const yOffset = window.innerWidth < 500 ? -80 : -112;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    });
  });
}

// Starter alt funktionalitet når siden loader
function initializeApp() {
  setupThemeAndMenu();
  initGeneralAnimations();
  initSmoothScroll();
  initPortfolioAnimations();
}

window.addEventListener("DOMContentLoaded", initializeApp);
document.addEventListener("astro:after-swap", initializeApp);
document.addEventListener("astro:page-load", initializeApp);

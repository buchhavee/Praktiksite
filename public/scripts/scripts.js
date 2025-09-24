// Theme switcher and menu logic for Astro

function setupThemeAndMenu() {
  const themeSwitch = document.getElementById("theme-switch");
  const html = document.documentElement;
  if (!themeSwitch) {
    return;
  }

  // Load theme from localStorage
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark-theme");
    themeSwitch.checked = true;
  } else if (localStorage.getItem("theme") === "light") {
    html.classList.remove("dark-theme");
    themeSwitch.checked = false;
  } else {
    // Hvis intet valgt, brug systemets farveskema
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

  const burger = document.getElementById("burger");
  const menuOverlay = document.getElementById("menu-overlay");
  const closeMenu = document.getElementById("close-menu");
  burger?.addEventListener("click", () => {
    menuOverlay?.classList.add("open");
  });
  closeMenu?.addEventListener("click", () => {
    menuOverlay?.classList.remove("open");
  });
}

// Portfolio animations and Intersection Observer
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
            // Delay animation based on order - sequential reveal
            const delay = (index - 1) * 200; // 200ms delay between each item

            setTimeout(() => {
              target.classList.add("animate-in");
              animatedItems.add(index);
            }, delay);
          }
        }
      });
    },
    {
      threshold: 0.2, // Trigger when 20% of item is visible
      rootMargin: "0px 0px -10% 0px", // Start animation slightly before item comes into view
    }
  );

  // Observe all portfolio items
  portfolioItems.forEach((item) => {
    observer.observe(item);
  });

  // Optional: Add scroll-based parallax effect for enhanced smoothness
  let ticking = false;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.1;

    portfolioItems.forEach((item, index) => {
      if (item.classList.contains("animate-in")) {
        // Skip parallax on mobile to avoid transform conflicts
        if (window.innerWidth > 767) {
          const parallaxRate = rate * (index + 1) * 0.1;
          item.style.transform = `translateZ(${parallaxRate}px)`;
        }
      }
    });

    ticking = false;
  }

  function requestParallaxTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Add smooth scroll listener for parallax (disabled on mobile)
  if (window.innerWidth > 767) {
    window.addEventListener("scroll", requestParallaxTick);
  }
}

// General fade-in animations for other sections
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

// Smooth scroll setup
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

// Initialize all functionality
function initializeApp() {
  setupThemeAndMenu();
  initGeneralAnimations();
  initSmoothScroll();
  initPortfolioAnimations();
}

window.addEventListener("DOMContentLoaded", initializeApp);
document.addEventListener("astro:after-swap", initializeApp);
document.addEventListener("astro:page-load", initializeApp);

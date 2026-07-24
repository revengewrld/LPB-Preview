// Navegación, animaciones y microinteracciones LPB 2.0

const header = document.querySelector("header");
const menu = document.querySelector(".menu");
const menuToggle = document.querySelector(".menu-toggle");
const backToTop = document.querySelector(".back-to-top");
const hero = document.querySelector(".hero");

// Cambios al hacer scroll
window.addEventListener(
  "scroll",
  () => {
    const scrolled = window.scrollY > 70;

    header.style.background = scrolled
      ? "rgba(255,255,255,.98)"
      : "rgba(255,255,255,.93)";

    header.style.boxShadow = scrolled
      ? "0 8px 30px rgba(0,0,0,.08)"
      : "none";

    backToTop?.classList.toggle(
      "visible",
      window.scrollY > 650
    );

    // Efecto parallax del hero
    if (hero && window.innerWidth > 900) {
      hero.style.backgroundPosition =
        `center ${window.scrollY * 0.18}px`;
    }
  },
  { passive: true }
);

// Menú responsive para celular
menuToggle?.addEventListener("click", () => {
  const open = menu.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(open)
  );

  menuToggle.innerHTML = open
    ? '<i class="bi bi-x-lg"></i>'
    : '<i class="bi bi-list"></i>';
});

// Scroll suave para enlaces internos
document
  .querySelectorAll('a[href^="#"]')
  .forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      // Cerrar menú de celular
      menu?.classList.remove("open");

      menuToggle?.setAttribute(
        "aria-expanded",
        "false"
      );

      if (menuToggle) {
        menuToggle.innerHTML =
          '<i class="bi bi-list"></i>';
      }
    });
  });

// Botón para volver arriba
backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Elementos que aparecerán al hacer scroll
const revealElements = document.querySelectorAll(`
  .info-card,
  .feature-card,
  .level-card,
  .gallery-item,
  .news-card,
  .testimonial-card,
  .section-title,
  .about-content,
  .about-image,
  .life-left,
  .life-right,
  .contact-info,
  .contact-form,
  .admissions-cta
`);

revealElements.forEach(element => {
  element.classList.add("reveal");
});

// Animación de aparición
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  }
);

revealElements.forEach(element => {
  observer.observe(element);
});

// Contadores animados
const counters =
  document.querySelectorAll(".info-card h2");

const counterZone =
  document.querySelector(".hero-info");

let countersStarted = false;

function animateCounters() {
  if (countersStarted || !counterZone) {
    return;
  }

  const position =
    counterZone.getBoundingClientRect().top;

  if (position > window.innerHeight - 80) {
    return;
  }

  countersStarted = true;

  counters.forEach(counter => {
    const original =
      counter.textContent.trim();

    const numeric = Number(
      original.replace(/[^0-9]/g, "")
    );

    if (!numeric) {
      return;
    }

    const start = performance.now();
    const duration = 1300;

    const frame = now => {
      const progress = Math.min(
        (now - start) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      const current =
        Math.floor(numeric * eased);

      if (original.includes("+")) {
        counter.textContent =
          `${current}+`;
      } else {
        counter.textContent =
          current.toLocaleString("es-CO");
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        counter.textContent = original;
      }
    };

    requestAnimationFrame(frame);
  });
}

window.addEventListener(
  "scroll",
  animateCounters,
  { passive: true }
);

animateCounters();

// Efecto 3D en las tarjetas
if (
  window
    .matchMedia("(pointer:fine)")
    .matches
) {
  document
    .querySelectorAll(".feature-card")
    .forEach(card => {
      card.addEventListener(
        "mousemove",
        event => {
          const rect =
            card.getBoundingClientRect();

          const rotateY =
            (
              (event.clientX - rect.left) /
              rect.width -
              0.5
            ) * 5;

          const rotateX =
            (
              (event.clientY - rect.top) /
              rect.height -
              0.5
            ) * -5;

          card.style.transform =
            `perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateY(-8px)`;
        }
      );

      card.addEventListener(
        "mouseleave",
        () => {
          card.style.transform = "";
        }
      );
    });
}
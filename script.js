const track = document.getElementById('scroll-track');
const sections = [...document.querySelectorAll('.panel')];
let currentSection = 0;
let locked = false;

const clampIndex = (index) => Math.max(0, Math.min(index, sections.length - 1));

const goToSection = (index) => {
  const targetIndex = clampIndex(index);
  const target = sections[targetIndex];

  if (!target) return;

  locked = true;
  currentSection = targetIndex;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    locked = false;
  }, 650);
};

track.addEventListener(
  'wheel',
  (event) => {
    event.preventDefault();

    if (locked) return;

    const direction = Math.sign(event.deltaY);
    if (direction === 0) return;

    goToSection(currentSection + direction);
  },
  { passive: false }
);

track.addEventListener('scroll', () => {
  const viewportCenter = track.scrollTop + track.clientHeight / 2;

  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    if (viewportCenter >= sectionTop && viewportCenter < sectionBottom) {
      currentSection = index;
    }
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.25, root: track }
);

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    const index = sections.indexOf(target);
    goToSection(index);
  });
});

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  const isDark = body.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  
  body.classList.add('theme-transition');
  body.setAttribute('data-theme', newTheme);
  
  const themeToggle = document.querySelector('.theme-toggle');
  themeToggle.textContent = isDark ? '🌙' : '☀️';
  
  localStorage.setItem('theme', newTheme);
  
  setTimeout(() => {
    body.classList.remove('theme-transition');
  }, 300);
}

// Initialize theme based on preference
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  document.body.setAttribute('data-theme', theme);
  document.querySelector('.theme-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Animate section titles
gsap.utils.toArray('section').forEach(section => {
  gsap.fromTo(section.querySelector('h2'),
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// Animate content elements
const animateContent = (elements, stagger = 0.2) => {
  gsap.from(elements, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: stagger,
    scrollTrigger: {
      trigger: elements,
      start: 'top bottom-=100',
      toggleActions: 'play none none reverse'
    }
  });
};

// Animate about section
const aboutElements = [
  '.about-image',
  '.about-text p',
  '.skills-grid .skill-item'
].map(selector => document.querySelectorAll(selector));

aboutElements.forEach(elements => animateContent(elements));

// Project filtering functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    const filter = button.getAttribute('data-filter');
    
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const timeline = gsap.timeline();
      
      if (filter === 'all' || category === filter) {
        timeline
          .to(card, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              card.style.display = 'block';
            }
          })
          .to(card, {
            scale: 1,
            opacity: 1,
            duration: 0.3
          });
      } else {
        timeline
          .to(card, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              card.style.display = 'none';
            }
          });
      }
    });
  });
});

// Project card hover animations
projectCards.forEach(card => {
  const image = card.querySelector('.project-image img');
  const overlay = card.querySelector('.project-overlay');
  
  card.addEventListener('mouseenter', () => {
    gsap.to(image, {
      scale: 1.1,
      duration: 0.3
    });
    
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.3
    });
  });
  
  card.addEventListener('mouseleave', () => {
    gsap.to(image, {
      scale: 1,
      duration: 0.3
    });
    
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3
    });
  });
});

// Contact form animations
const contactForm = document.querySelector('.contact-form');
const formElements = contactForm.querySelectorAll('input, textarea, button');

animateContent(formElements, 0.1);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// Initialize theme
initializeTheme();

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop) {
    // Scrolling down
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    navbar.style.transform = 'translateY(0)';
  }
  
  // Update background opacity based on scroll position
  const opacity = Math.min(scrollTop / 200, 0.95);
  navbar.style.backgroundColor = `rgba(var(--navbar-rgb), ${opacity})`;
  
  lastScrollTop = scrollTop;
});

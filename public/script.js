  document.addEventListener('DOMContentLoaded', () => {
    // Dark mode toggle
    if (localStorage.getItem('dark-mode') === 'enabled') {
      document.body.classList.add('dark-mode');
    }
  
    document.getElementById('darkModeToggle')?.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('dark-mode',
        document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
    });
  
    // Scroll fade-in
    const fadeIns = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    fadeIns.forEach(el => observer.observe(el));
  
    // Burger menu toggle
    const burger = document.getElementById('burger');
    const navMenu = document.getElementById('navMenu');
    const header = document.querySelector('header');
    
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      header.classList.toggle('open');
      navMenu.classList.toggle('open');
    });
  });
  
  // Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Animate individual words on hover
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.hover-text');
  
    containers.forEach(container => {
      const words = container.textContent.trim().split(' ');
      container.innerHTML = ''; // clear content
  
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.classList.add('word');
        container.appendChild(span);
  
        if (i < words.length - 1) {
          container.appendChild(document.createTextNode(' '));
        }
      });
    });
  });
  document.addEventListener('DOMContentLoaded', () => {
    const hoverContainers = document.querySelectorAll('.hover-text');
  
    hoverContainers.forEach(container => {
      const words = container.textContent.trim().split(' ');
      container.innerHTML = '';
  
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.classList.add('hover-word');
        span.textContent = word;
        container.appendChild(span);
  
        if (i < words.length - 1) {
          container.appendChild(document.createTextNode(' '));
        }
  
        // Hover effect
        span.addEventListener('mouseenter', () => {
          span.classList.add('hovered');
          if (span.previousSibling?.classList?.contains('hover-word')) {
            span.previousSibling.classList.add('hovered-near');
          }
          if (span.nextSibling?.classList?.contains('hover-word')) {
            span.nextSibling.classList.add('hovered-near');
          }
        });
  
        span.addEventListener('mouseleave', () => {
          span.classList.remove('hovered');
          if (span.previousSibling?.classList?.contains('hover-word')) {
            span.previousSibling.classList.remove('hovered-near');
          }
          if (span.nextSibling?.classList?.contains('hover-word')) {
            span.nextSibling.classList.remove('hovered-near');
          }
        });
      });
    });
  });
  
  
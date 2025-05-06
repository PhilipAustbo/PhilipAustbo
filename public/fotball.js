// === MATH TRAINER ===
const mathBox = document.querySelector('.math-trainer');
const problemEl = mathBox?.querySelector('.math-problem');
const spans = problemEl?.querySelectorAll('span') || [];

const problems = [
  { num1: 43, operator: '+', num2: 74, result: 117 },
  { num1: 88, operator: '-', num2: 29, result: 59 },
  { num1: 6, operator: '×', num2: 7, result: 42 },
  { num1: 144, operator: '÷', num2: 12, result: 12 },
];

function showProblem() {
  const p = problems[Math.floor(Math.random() * problems.length)];
  spans[0].textContent = p.num1;
  spans[1].textContent = p.operator;
  spans[2].textContent = p.num2;
  spans[4].textContent = p.result;

  problemEl.classList.add('show');

  setTimeout(() => {
    problemEl.classList.remove('show');
    problemEl.classList.add('fly-out');
  }, 3000);

  setTimeout(() => {
    problemEl.classList.remove('fly-out');
  }, 4000);
}

let intervalId = null;

mathBox?.addEventListener('mouseenter', () => {
  showProblem();
  intervalId = setInterval(showProblem, 4500);
});

mathBox?.addEventListener('mouseleave', () => {
  clearInterval(intervalId);
  problemEl?.classList.remove('show', 'fly-out');
});

// === TIMELINE SCROLL ===
function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// === GALLERY TOGGLE ===
let currentIndex = 0;

function showGallery(type) {
  const collage = document.getElementById('collage');
  const wheel = document.getElementById('wheel');
  const wheelInner = document.getElementById('wheelInner');

  if (type === 'collage') {
    collage.classList.add('active');
    wheel.classList.remove('active');
    currentIndex = 0;
  } else if (type === 'wheel') {
    collage.classList.remove('active');
    wheel.classList.add('active');
    currentIndex = 0;
    wheelInner.scrollLeft = 0;
  }
}

// === SCROLL WHEEL LEFT/RIGHT ===
function scrollWheel(direction) {
  const wheel = document.getElementById('wheelInner');
  const images = wheel.querySelectorAll('img');
  if (images.length === 0) return;

  const imageWidth = images[0].getBoundingClientRect().width;
  const scrollAmount = direction * (imageWidth); // adjust if margin/padding between images

  currentIndex = (currentIndex + direction + images.length) % images.length;
  wheel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

// === HANDLE WINDOW RESIZE ===
window.addEventListener('resize', () => {
  const wheel = document.getElementById('wheelInner');
  const images = wheel.querySelectorAll('img');
  const imageWidth = images[0]?.getBoundingClientRect().width || 0;
  wheel.scrollTo({ left: currentIndex * imageWidth, behavior: 'instant' });
});

// === COLLAGE IMAGE ZOOM OVERLAY ===
const collageImages = document.querySelectorAll('.collage img');
const overlay = document.getElementById('imageOverlay');
const overlayImg = document.getElementById('overlayImage');

collageImages.forEach(img => {
  img.addEventListener('click', () => {
    overlayImg.src = img.src;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

overlay?.addEventListener('click', () => {
  overlay.style.display = 'none';
  overlayImg.src = '';
  document.body.style.overflow = '';
});

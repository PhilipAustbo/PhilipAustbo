const mathBox = document.querySelector('.math-trainer');
const problemEl = mathBox.querySelector('.math-problem');
const spans = problemEl.querySelectorAll('span');

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

mathBox.addEventListener('mouseenter', () => {
  showProblem();
  intervalId = setInterval(showProblem, 4500);
});

mathBox.addEventListener('mouseleave', () => {
  clearInterval(intervalId);
  problemEl.classList.remove('show', 'fly-out');
});

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// === JS for Image Gallery Toggle ===

function showGallery(type) {
  document.getElementById('collage').classList.remove('active');
  document.getElementById('wheel').classList.remove('active');
  document.getElementById(type).classList.add('active');
}

let currentIndex = 0;

function scrollWheel(direction) {
  const wheel = document.querySelector('.wheel-inner');
  const images = wheel.querySelectorAll('img');
  const total = images.length;
  currentIndex = (currentIndex + direction + total) % total;

  const offset = images[currentIndex].offsetLeft - wheel.offsetLeft;
  wheel.scrollTo({ left: offset, behavior: 'smooth' });
}

// Optional: Reset to first image on resize
window.addEventListener('resize', () => {
  const wheel = document.querySelector('.wheel-inner');
  const images = wheel.querySelectorAll('img');
  const offset = images[currentIndex]?.offsetLeft - wheel.offsetLeft;
  if (offset !== undefined) {
    wheel.scrollTo({ left: offset, behavior: 'instant' });
  }
});

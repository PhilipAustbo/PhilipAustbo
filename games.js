document.addEventListener('DOMContentLoaded', () => {
    const mathBox = document.querySelector('.game-box.math-trainer');
    const problemEl = mathBox.querySelector('.math-problem');
    const spans = problemEl.querySelectorAll('span');
  
    let intervalId = null;
  
    function generateRandomProblem() {
      const num1 = Math.floor(Math.random() * 91) + 10;
      const num2 = Math.floor(Math.random() * 91) + 10;
      const operators = ['+', '-', '×', '÷'];
      const operator = operators[Math.floor(Math.random() * operators.length)];
      let result;
  
      switch (operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '×': result = num1 * num2; break;
        case '÷': result = (num1 / num2).toFixed(2); break;
      }
  
      return { num1, operator, num2, result };
    }
  
    function getEdgeZoneValue() {
      return Math.random() < 0.5
        ? Math.floor(Math.random() * 11) + 15  // 15–25%
        : Math.floor(Math.random() * 11) + 75; // 75–85%
    }
  
    function showProblem() {
      const topPercent = getEdgeZoneValue();
      const leftPercent = Math.floor(Math.random() * 11) + 45; // 45–55%
  
      problemEl.style.top = `${topPercent}%`;
      problemEl.style.left = `${leftPercent}%`;
  
      const directions = ['left', 'right', 'top', 'bottom'];
      const dir = directions[Math.floor(Math.random() * directions.length)];
  
      // Reset offscreen based on direction
      problemEl.style.transition = 'none';
      switch (dir) {
        case 'left':
          problemEl.style.transform = 'translate(-50%, -50%) translateX(-100%)';
          break;
        case 'right':
          problemEl.style.transform = 'translate(-50%, -50%) translateX(100%)';
          break;
        case 'top':
          problemEl.style.transform = 'translate(-50%, -50%) translateY(-100%)';
          break;
        case 'bottom':
          problemEl.style.transform = 'translate(-50%, -50%) translateY(100%)';
          break;
      }
      problemEl.style.opacity = '0';
      void problemEl.offsetWidth; // force reflow
  
      const p = generateRandomProblem();
      spans[0].textContent = p.num1;
      spans[1].textContent = p.operator;
      spans[2].textContent = p.num2;
      spans[4].textContent = p.result;
  
      // Slide in to center (of position) + fade in
      problemEl.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
      problemEl.style.transform = 'translate(-50%, -50%) translateX(0) translateY(0)';
      problemEl.style.opacity = '1';
  
      // Fade out after 2 seconds
      setTimeout(() => {
        problemEl.style.transition = 'opacity 0.5s ease';
        problemEl.style.opacity = '0';
      }, 2000);
    }
  
    mathBox.addEventListener('mouseenter', () => {
      showProblem();
      intervalId = setInterval(showProblem, 3000);
    });
  
    mathBox.addEventListener('mouseleave', () => {
      clearInterval(intervalId);
      problemEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      problemEl.style.opacity = '0';
    });
  });
  
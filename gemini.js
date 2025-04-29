// Constants
const API_URL = 'https://backend-git-main-philip-austbos-projects.vercel.app/api/ask';

// Elements
const container = document.querySelector('.container');
const chatsContainer = document.querySelector('.chats-container');
const promptForm = document.querySelector('.prompt-form');
const promptInput = promptForm.querySelector('.prompt-input');
const fileInput = promptForm.querySelector('#file-input');
const fileUploadWrapper = promptForm.querySelector('.file-upload-wrapper');
const themeToggleBtn = document.querySelector('#theme-toggle-btn');

let controller, typingInterval;
const chatHistory = [];
const userData = { message: '', file: {} };

// Initial Theme
const isLightTheme = localStorage.getItem('themeColor') === 'light_mode';
document.body.classList.toggle('light-theme', isLightTheme);
themeToggleBtn.textContent = isLightTheme ? 'dark_mode' : 'light_mode';

// Helper Functions
const createMessageElement = (content, ...classes) => {
  const div = document.createElement('div');
  div.classList.add('message', ...classes);
  div.innerHTML = content;
  return div;
};

const scrollToBottom = () => container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = '';
  const words = text.split(' ');
  let wordIndex = 0;
  typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      textElement.textContent += (wordIndex === 0 ? '' : ' ') + words[wordIndex++];
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      botMsgDiv.classList.remove('loading');
      document.body.classList.remove('bot-responding');
    }
  }, 30);
};

const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector('.message-text');
  controller = new AbortController();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userData.message }),
      signal: controller.signal
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Error');

    const responseText = data.candidates[0].content.parts[0].text.trim();
    typingEffect(responseText, textElement, botMsgDiv);

    chatHistory.push({ role: 'model', parts: [{ text: responseText }] });
  } catch (error) {
    textElement.textContent = error.name === 'AbortError' ? 'Response stopped.' : error.message;
    textElement.style.color = '#d62939';
    botMsgDiv.classList.remove('loading');
    document.body.classList.remove('bot-responding');
  } finally {
    userData.file = {};
  }
};

// Form Submission
const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains('bot-responding')) return;

  userData.message = userMessage;
  promptInput.value = '';
  document.body.classList.add('chats-active', 'bot-responding');

  const userMsgHTML = `<p class="message-text">${userData.message}</p>`;
  const userMsgDiv = createMessageElement(userMsgHTML, 'user-message');
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();

  setTimeout(() => {
    const botMsgHTML = `<img class="avatar" src="gemini.svg" /> <p class="message-text">Just a sec...</p>`;
    const botMsgDiv = createMessageElement(botMsgHTML, 'bot-message', 'loading');
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);
  }, 400);
};

// File Upload
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    fileInput.value = '';
    fileUploadWrapper.querySelector('.file-preview').src = e.target.result;
    fileUploadWrapper.classList.add('active');
    userData.file = { fileName: file.name, data: e.target.result.split(',')[1], mime_type: file.type };
  };
});

document.querySelector('#cancel-file-btn').addEventListener('click', () => {
  userData.file = {};
  fileUploadWrapper.classList.remove('active');
});

// Theme Toggle
themeToggleBtn.addEventListener('click', () => {
  const isLightTheme = document.body.classList.toggle('light-theme');
  localStorage.setItem('themeColor', isLightTheme ? 'light_mode' : 'dark_mode');
  themeToggleBtn.textContent = isLightTheme ? 'dark_mode' : 'light_mode';
});

// Stop Bot Response
const stopBtn = document.getElementById('stop-response-btn');
stopBtn.addEventListener('click', () => {
  controller?.abort();
  clearInterval(typingInterval);
  const botMsg = document.querySelector('.bot-message.loading');
  if (botMsg) botMsg.classList.remove('loading');
  document.body.classList.remove('bot-responding');
});

// Delete All Chats
const deleteBtn = document.getElementById('delete-chats-btn');
deleteBtn.addEventListener('click', () => {
  chatHistory.length = 0;
  chatsContainer.innerHTML = '';
  document.body.classList.remove('chats-active', 'bot-responding');
});

// Suggestions Click
const suggestions = document.querySelectorAll('.suggestions-item');
suggestions.forEach((item) => {
  item.addEventListener('click', () => {
    promptInput.value = item.querySelector('.text').textContent;
    promptForm.dispatchEvent(new Event('submit'));
  });
});

// Mobile controls hide/show
const wrapper = document.querySelector('.prompt-wrapper');
document.addEventListener('click', ({ target }) => {
  const shouldHide = target.classList.contains('prompt-input') || (wrapper.classList.contains('hide-controls') && (target.id === 'add-file-btn' || target.id === 'stop-response-btn'));
  wrapper.classList.toggle('hide-controls', shouldHide);
});

// Form submit event
promptForm.addEventListener('submit', handleFormSubmit);
promptForm.querySelector('#add-file-btn').addEventListener('click', () => fileInput.click());

// Preload CV and add personalization
const preloadCV = async () => {
  const response = await fetch('Philip_Austbo_CV.pdf');
  const blob = await response.blob();
  const reader = new FileReader();

  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    const base64data = reader.result.split(',')[1];
    const pdfPart = {
      inline_data: {
        mime_type: 'application/pdf',
        data: base64data
      }
    };

    chatHistory.unshift({
      role: 'user',
      parts: [
        {
          text: `You are an assistant for Philip Austbø. Philip is a master's student in Finance at NHH (Norwegian School of Economics) with experience at Ernst & Young and DNV, and a background in financial audit, consulting, and technology projects. He is passionate about finance, strategy, and data analysis, and plays football competitively.\n**Behavior Instructions:** 1. When greeted ("hello", "hi", "hey"), respond warmly with a set phrase. 2. If asked about Philip's background, hobbies, career goals, answer personally using context. 3. If asked about general finance or strategy, answer knowledgeably and link to Philip if relevant. 4. If unsure, ask if they want it related to Philip. 5. When asked "Tell me about Philip Austbø", give a short overview and ask if they want more.`
        },
        pdfPart
      ]
    });
  };
};

preloadCV();

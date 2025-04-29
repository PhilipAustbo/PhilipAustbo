const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");

const API_URL = "https://backend-git-main-philip-austbos-projects.vercel.app/api/ask";

let controller, typingInterval;
let contextParts = []; // This will include the CV preload

// Theme setup
const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";

// Create a message element
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const scrollToBottom = () => container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });

const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.textContent = "";
  const words = text.split(" ");
  let wordIndex = 0;
  typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      textElement.textContent += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      botMsgDiv.classList.remove("loading");
      document.body.classList.remove("bot-responding");
    }
  }, 30);
};

const generateResponse = async (botMsgDiv, userMessage) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [...contextParts] },
          { role: "user", parts: [{ text: userMessage }] }
        ]
      }),
      signal: controller.signal,
    });

    const data = await response.json();

    if (!response.ok || !data?.candidates?.[0]) {
      throw new Error(data.error?.message || "Unexpected error");
    }

    const responseText = data.candidates[0].content.parts[0].text.trim();
    typingEffect(responseText, textElement, botMsgDiv);

  } catch (error) {
    textElement.textContent = error.name === "AbortError"
      ? "Response generation stopped."
      : error.message;
    textElement.style.color = "#d62939";
    botMsgDiv.classList.remove("loading");
    document.body.classList.remove("bot-responding");
    scrollToBottom();
  }
};

// Submit handler
const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains("bot-responding")) return;

  promptInput.value = "";
  document.body.classList.add("chats-active", "bot-responding");

  const userMsgDiv = createMessageElement(`<p class="message-text">${userMessage}</p>`, "user-message");
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();

  setTimeout(() => {
    const botMsgDiv = createMessageElement(
      `<img class="avatar" src="gemini.svg" /> <p class="message-text">Just a sec...</p>`,
      "bot-message", "loading"
    );
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();

    generateResponse(botMsgDiv, userMessage);
  }, 400);
};

promptForm.addEventListener("submit", handleFormSubmit);

document.querySelector("#stop-response-btn").addEventListener("click", () => {
  controller?.abort();
  clearInterval(typingInterval);
  const botMsg = chatsContainer.querySelector(".bot-message.loading");
  if (botMsg) botMsg.classList.remove("loading");
  document.body.classList.remove("bot-responding");
});

themeToggleBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  localStorage.setItem("themeColor", isLight ? "light_mode" : "dark_mode");
  themeToggleBtn.textContent = isLight ? "dark_mode" : "light_mode";
});

document.querySelector("#delete-chats-btn").addEventListener("click", () => {
  chatsContainer.innerHTML = "";
  document.body.classList.remove("chats-active", "bot-responding");
});

// ✅ Preload CV
const preloadCV = async () => {
  const response = await fetch("Philip_Austbo_CV.pdf"); // Ensure PDF is in /public folder
  const blob = await response.blob();
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    const base64 = reader.result.split(",")[1];
    contextParts = [
      {
        text: `
You are an assistant for Philip Austbø.
Philip is a master's student in Finance at NHH (Norwegian School of Economics) with experience at Ernst & Young and DNV, and a background in financial audit, consulting, and technology projects. 
He is passionate about finance, strategy, and data analysis, and plays football competitively.

**Behavior Instructions:**
1. When greeted (e.g., "hello", "hi", "hey"), respond warmly with:
   - “Hello! How can I help you today? Are you interested in learning more about Philip, or would you like to ask something else?” However, only when greeted with these words.
   - If the greeting is not a typical thing to say, e.g., not "hello", then respond how you normally would.
2. If someone asks about **Philip's background, experience, education, leadership, hobbies, or career goals**, use the provided context and CV information to answer personally.
3. If someone asks **general finance, strategy, or technology questions**:
   - Answer knowledgeably.
   - If relevant, relate it back to Philip’s interests or experience.
   - If not related to Philip, answer normally. Do not mention Philip if not relevant.
4. If unsure whether the question is about Philip or a general topic, ask for clarification:
   - “Would you like me to relate this to Philip’s background or provide a general answer?”
5. When asked "Tell me about Philip Austbø", give a short overview of his personal and professional life, then ask if the user wants to learn more.
6. Be friendly, professional, and speak warmly of Philip.
7. Use enough paragraphs when talking about Philip, especially before asking a follow-up question.
        `.trim()
      },
      {
        inline_data: {
          mime_type: "application/pdf",
          data: base64
        }
      }
    ];
  };
};

preloadCV(); // 🔁 Start preloading when site loads

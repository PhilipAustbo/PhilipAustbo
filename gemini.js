// gemini.js (updated)

const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");

const API_URL = "/api/ask"; // from vercel serverless function

let controller, typingInterval;
const chatHistory = [
  {
    role: "user",
    parts: [
      {
        text: `
        You are an assistant for Philip Austbø.
        Philip is a master's student in Finance at NHH (Norwegian School of Economics) with experience at Ernst & Young and DNV, and a background in financial audit, consulting, and technology projects.
        He is passionate about finance, strategy, and data analysis, and plays football competitively.

        **Behavior Instructions:**
        1. When greeted (e.g., "hello", "hi", "hey"), respond warmly with:
           - “Hello! How can I help you today? Are you interested in learning more about Philip, or would you like to ask something else?” However, only when greeted with these words.
           - if the greeting is not a typical thing to say, e.g hello, then respond how you normally would.
        2. If someone asks about **Philip's background, experience, education, leadership, hobbies, or career goals**, use the provided context and CV information to answer personally.
        3. If someone asks **general finance, strategy, or technology questions**:
           - Answer knowledgeably.
           - If relevant, relate it back to Philip’s interests or experience (e.g., “Philip has worked in audit and consulting, so he’s familiar with this topic...”).
           - If not related to Philip, answer normally, do not talk about Philip when not relevant.
        4. If unsure whether the question is about Philip or a general topic, ask for clarification:
           - “Would you like me to relate this to Philip’s background or provide a general answer?”
        5. When asked "Tell me about Philip Austbø" you should give a short overview of his personal and professional life. Then ask if the user wants to learn more.
        6. Be friendly, professional, and speak warmly of Philip.
        7. Ensure you use enough paragraphs when talking about Philip. Especially before asking a question in the end.`
      }
    ]
  }
];

const userData = { message: "", file: {} };

const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";

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
  }, 40);
};

const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();

  chatHistory.push({
    role: "user",
    parts: [
      { text: userData.message },
      ...(userData.file.data ? [{ inline_data: (({ fileName, isImage, ...rest }) => rest)(userData.file) }] : [])
    ],
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: chatHistory.slice(-9) }),
      signal: controller.signal,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "No response from Gemini API");

    const responseText = data.candidates[0].content.parts[0].text.trim();
    typingEffect(responseText, textElement, botMsgDiv);
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    textElement.textContent = error.name === "AbortError" ? "Response generation stopped." : error.message;
    textElement.style.color = "#d62939";
    botMsgDiv.classList.remove("loading");
    document.body.classList.remove("bot-responding");
    scrollToBottom();
  } finally {
    userData.file = {};
  }
};

const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains("bot-responding")) return;
  userData.message = userMessage;
  promptInput.value = "";
  document.body.classList.add("chats-active", "bot-responding");
  fileUploadWrapper.classList.remove("file-attached", "img-attached", "active");

  const userMsgHTML = `
    <p class="message-text"></p>
    ${userData.file.data
      ? (userData.file.isImage
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="img-attachment" />`
        : `<p class="file-attachment"><span class="material-symbols-rounded">description</span>${userData.file.fileName}</p>`)
      : ""}
  `;
  const userMsgDiv = createMessageElement(userMsgHTML, "user-message");
  userMsgDiv.querySelector(".message-text").textContent = userData.message;
  chatsContainer.appendChild(userMsgDiv);
  scrollToBottom();

  setTimeout(() => {
    const botMsgHTML = `<img class="avatar" src="gemini.svg" /> <p class="message-text">Just a sec...</p>`;
    const botMsgDiv = createMessageElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);
  }, 600);
};

// Event handlers for file, theme, cancel, etc. (same as your previous code, can be appended after this)

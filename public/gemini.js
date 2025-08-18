// ===== DOM references =====
const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");
const sendPromptBtn = document.querySelector("#send-prompt-btn");
const suggestionButtons = document.querySelectorAll(".suggestion-btn");

const API_URL = "/api/ask";

// ===== System context (goes on every request) =====
const SYSTEM_CONTEXT_TEXT = `You are an AI assistant representing Philip Tinius Riise Austbø to recruiters and hiring managers.
Your goals: (1) showcase Philip's fit for roles in finance/consulting, (2) answer recruiter-style questions concisely and professionally, (3) proactively offer to share relevant projects or experience when helpful.

About Philip (public profile):
- Education: Master's in Finance at NHH (Norwegian School of Economics).
- Experience: EY (assurance/audit), DNV Dubai (aquaculture consulting, Sept–Oct 2025), various data/tech side projects (interactive portfolio, games, chatbot).
- Interests: corporate finance, strategy, data analysis, sustainability; competitive football with leadership experience.
- Style: friendly, concise, evidence-based; avoid overselling—use concrete examples.

Behavior:
- If asked about Philip, give a crisp summary first, then offer deeper details (education, internships, leadership, tech skills, notable projects, links to portfolio pages).
- For general finance/strategy/tech questions, answer well and (when relevant) connect to Philip's experience.
- If a question could be about Philip or general, ask: "Shall I relate this to Philip or keep it general?"`;

// ===== State =====
let controller, typingInterval;
let isFirstExchange = true;
const chatHistory = []; // we will push the system on each request; we also maintain conversation turns here
const userData = { message: "", file: {} };

// ===== Theme init =====
const isLightTheme = localStorage.getItem("themeColor") === "light_mode";
document.body.classList.toggle("light-theme", isLightTheme);
if (themeToggleBtn) themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";

// ===== Helpers =====
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const scrollToBottom = () =>
  container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });

const escapeHTML = (s) =>
  s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

const postProcessLinks = (root) => {
  root.querySelectorAll("a").forEach((a) => {
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
};

const setBusy = (busy) => {
  document.body.classList.toggle("bot-responding", busy);
  sendPromptBtn.disabled = busy;
  sendPromptBtn.setAttribute("aria-disabled", String(busy));
};

// ===== Typing effect with safe HTML =====
const typingEffect = (text, textElement, botMsgDiv) => {
  clearInterval(typingInterval);
  textElement.innerHTML = "";

  const htmlUnsafe = marked.parse(text || "");
  const htmlSafe = DOMPurify.sanitize(htmlUnsafe, { USE_PROFILES: { html: true } });

  // Build word-by-word using plain text (from sanitized HTML)
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlSafe;
  const words = tempDiv.textContent.split(/\s+/).filter(Boolean);

  let wordIndex = 0;
  let displayText = "";

  typingInterval = setInterval(() => {
    if (wordIndex < words.length) {
      displayText += (wordIndex === 0 ? "" : " ") + words[wordIndex++];
      textElement.textContent = displayText;
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      textElement.innerHTML = htmlSafe; // swap to full sanitized HTML
      postProcessLinks(textElement);
      botMsgDiv.classList.remove("loading");
      setBusy(false);
    }
  }, 40);
};

// ===== Networking =====
const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();

  const fullHistory = [
    { role: "system", parts: [{ text: SYSTEM_CONTEXT_TEXT }] },
    ...chatHistory,
    {
      role: "user",
      parts: [
        { text: userData.message },
        ...(userData.file.data ? [{ inline_data: (({ fileName, isImage, ...rest }) => rest)(userData.file) }] : []),
      ],
    },
  ];

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: fullHistory }),
      signal: controller.signal,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("Invalid JSON from server");
    }
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    if (!data.reply) throw new Error("Empty reply from API");

    const responseText = String(data.reply).trim();
    typingEffect(responseText, textElement, botMsgDiv);

    // store turn (without file to keep memory lean)
    chatHistory.push({ role: "user", parts: [{ text: userData.message }] });
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    textElement.textContent = `Error: ${error.message}`;
    textElement.style.color = "#d62939";
    botMsgDiv.classList.remove("loading");
    setBusy(false);
    scrollToBottom();
  } finally {
    userData.file = {};
  }
};

// ===== Form handling =====
const handleFormSubmit = (e) => {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  if (!userMessage || document.body.classList.contains("bot-responding")) return;

  userData.message = userMessage;
  promptInput.value = "";
  setBusy(true);
  fileUploadWrapper.classList.remove("file-attached", "img-attached", "active");

  // USER message
  const userMsgHTML = `
    <p class="message-text"></p>
    ${
      userData.file.data
        ? userData.file.isImage
          ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="img-attachment" alt="Image attachment" />`
          : `<p class="file-attachment"><span class="material-symbols-rounded">description</span>${escapeHTML(userData.file.fileName)}</p>`
        : ""
    }
  `;
  const userMsgDiv = createMessageElement(userMsgHTML, "user-message");
  if (isFirstExchange) userMsgDiv.classList.add("first-exchange");
  userMsgDiv.querySelector(".message-text").textContent = userData.message;
  chatsContainer.appendChild(userMsgDiv);

  if (isFirstExchange) {
    chatsContainer.classList.add("first-run");
  }

  scrollToBottom();

  // BOT loading & fetch
  setTimeout(() => {
    const botMsgHTML = `<img class="avatar" src="gemini.svg" alt="AI avatar" /> <div class="message-text">Loading...</div>`;
    const botMsgDiv = createMessageElement(botMsgHTML, "bot-message", "loading");
    if (isFirstExchange) botMsgDiv.classList.add("first-exchange");
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);

    if (isFirstExchange) {
      // visually nudge to “center” the first pair a bit
      setTimeout(() => container.scrollBy({ top: 120, behavior: "smooth" }), 100);
      isFirstExchange = false;
    }
  }, 300);
};

promptForm.addEventListener("submit", handleFormSubmit);

// ===== File upload =====
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const MAX_FILE_SIZE_MB = 4.5;
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    alert(`File too large! Max file size is ${MAX_FILE_SIZE_MB} MB. Your file is ${fileSizeMB.toFixed(2)} MB.`);
    fileInput.value = "";
    return;
  }

  const isImage = file.type.startsWith("image/");
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (e) => {
    fileInput.value = "";
    const base64String = e.target.result.split(",")[1];
    fileUploadWrapper.querySelector(".file-preview").src = e.target.result;
    fileUploadWrapper.classList.add("active", isImage ? "img-attached" : "file-attached");
    userData.file = {
      fileName: file.name,
      data: base64String,
      mime_type: file.type,
      isImage,
    };
  };
});

document.querySelector("#cancel-file-btn").addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-attached", "img-attached", "active");
});

document.querySelector("#stop-response-btn").addEventListener("click", () => {
  controller?.abort();
  userData.file = {};
  clearInterval(typingInterval);
  const loadingBotMsg = chatsContainer.querySelector(".bot-message.loading");
  if (loadingBotMsg) loadingBotMsg.classList.remove("loading");
  setBusy(false);
});

// ===== Theme & housekeeping =====
themeToggleBtn.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  localStorage.setItem("themeColor", isLight ? "light_mode" : "dark_mode");
  themeToggleBtn.textContent = isLight ? "dark_mode" : "light_mode";
});

document.querySelector("#delete-chats-btn").addEventListener("click", () => {
  chatHistory.length = 0;
  chatsContainer.innerHTML = "";
  document.body.classList.remove("chats-active", "bot-responding");
});

// ===== Suggestions -> submit =====
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    promptInput.value = btn.textContent;
    promptForm.dispatchEvent(new Event("submit"));
  });
});

// ===== Optional: on-demand CV preload (call only when needed) =====
const preloadCV = async () => {
  try {
    const response = await fetch("Philip_Austbo_CV.pdf");
    if (!response.ok) return;
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result.split(",")[1];
      const pdfPart = { inline_data: { mime_type: "application/pdf", data: base64data } };
      // You can push a context turn that includes the CV as inline data (optional):
      chatHistory.push({
        role: "user",
        parts: [
          {
            text:
              "Context document: Philip's CV (use for answering recruiter questions concisely and accurately).",
          },
          pdfPart,
        ],
      });
    };
  } catch (err) {
    console.error("CV preload failed:", err);
  }
};
// Example usage: call preloadCV() before the first recruiter-style question if you want CV included.

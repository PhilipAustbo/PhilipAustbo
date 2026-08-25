const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");
const sendPromptBtn = document.querySelector("#send-prompt-btn");

const API_URL = "/api/ask"; // updated endpoint

let controller, typingInterval;
const chatHistory = [];
const userData = { message: "", file: {} };

const isLightTheme = true;
document.body.classList.toggle("light-theme", isLightTheme);
themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

const showFinishedAvatar = (botMsgDiv) => {
  const avatarIcon = botMsgDiv.querySelector(".avatar-icon");
  if (avatarIcon) avatarIcon.textContent = "smart_toy";
  const avatar = botMsgDiv.querySelector(".avatar");
  if (avatar) avatar.setAttribute("aria-label", "Assistant response");
};

const scrollToBottom = () => container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });

const typingEffect = (text, textElement, botMsgDiv) => {
  textElement.innerHTML = "";
  const tokens = text.match(/\s+|[^\s]+/g) || [text];
  const chunks = [];

  tokens.forEach((token) => {
    if (/^\s+$/.test(token) && chunks.length) {
      chunks[chunks.length - 1] += token;
    } else {
      chunks.push(token);
    }
  });

  let chunkIndex = 0;
  let visibleMarkdown = "";

  typingInterval = setInterval(() => {
    if (chunkIndex < chunks.length) {
      visibleMarkdown += chunks[chunkIndex++];
      textElement.innerHTML = marked.parse(visibleMarkdown);
      scrollToBottom();
    } else {
      clearInterval(typingInterval);
      textElement.innerHTML = marked.parse(text);
      botMsgDiv.classList.remove("loading");
      showFinishedAvatar(botMsgDiv);
      document.body.classList.remove("bot-responding");
    }
  }, 40);
};

const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();

  const fullHistory = [
    ...chatHistory,
    {
      role: "user",
      parts: [
        { text: userData.message },
        ...(userData.file.data
          ? [{
              inline_data: (({ fileName, isImage, ...rest }) => rest)(userData.file),
            }]
          : []),
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

    const data = await response.json();
    if (!response.ok || !data.reply) throw new Error(data.error || "No response from API");

    const responseText = data.reply.trim();
    typingEffect(responseText, textElement, botMsgDiv);
    chatHistory.push({ role: "user", parts: [{ text: userData.message }] });
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });
  } catch (error) {
    textElement.textContent = "Something went wrong. Please try again.";
    textElement.style.color = "#d62939";
    botMsgDiv.classList.remove("loading");
    showFinishedAvatar(botMsgDiv);
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
    const botMsgHTML = `<div class="avatar" aria-label="Assistant is thinking"><span class="avatar-icon material-symbols-rounded" aria-hidden="true">progress_activity</span></div><div class="message-text">Loading...</div>`;
    const botMsgDiv = createMessageElement(botMsgHTML, "bot-message", "loading");
    chatsContainer.appendChild(botMsgDiv);
    scrollToBottom();
    generateResponse(botMsgDiv);
  }, 600);
};

promptForm.addEventListener("submit", handleFormSubmit);
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const MAX_FILE_SIZE_MB = 4.5;
  const fileSizeMB = file.size / (1024 * 1024);

  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    alert(`The file is too large. The maximum size is ${MAX_FILE_SIZE_MB} MB. Your file is ${fileSizeMB.toFixed(2)} MB.`);
    fileInput.value = ""; // reset input
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
  if (loadingBotMsg) {
    loadingBotMsg.classList.remove("loading");
    showFinishedAvatar(loadingBotMsg);
  }
  document.body.classList.remove("bot-responding");
});

themeToggleBtn.addEventListener("click", () => {
  const isLightTheme = document.body.classList.toggle("light-theme");
  localStorage.setItem("themeColor", isLightTheme ? "light_mode" : "dark_mode");
  themeToggleBtn.textContent = isLightTheme ? "dark_mode" : "light_mode";
});

document.querySelector("#delete-chats-btn").addEventListener("click", () => {
  chatHistory.length = 0;
  chatsContainer.innerHTML = "";
  document.body.classList.remove("chats-active", "bot-responding");
});

document.querySelectorAll(".suggestions-item").forEach((suggestion) => {
  suggestion.addEventListener("click", () => {
    promptInput.value = suggestion.querySelector(".text").textContent;
    promptForm.dispatchEvent(new Event("submit"));
  });
  suggestion.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      suggestion.click();
    }
  });
});

document.addEventListener("click", ({ target }) => {
  const wrapper = document.querySelector(".prompt-wrapper");
  const shouldHide = target.classList.contains("prompt-input") ||
    (wrapper.classList.contains("hide-controls") && (target.id === "add-file-btn" || target.id === "stop-response-btn"));
  wrapper.classList.toggle("hide-controls", shouldHide);
});

promptForm.querySelector("#add-file-btn").addEventListener("click", () => fileInput.click());

const preloadCV = async () => {
  try {
    const response = await fetch("Philip_Austbo_CV.pdf");
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result.split(",")[1];
      const pdfPart = {
        inline_data: { mime_type: "application/pdf", data: base64data },
      };
      chatHistory.push({ role: "user", parts: [{ text: 
      `You are an assistant representing Philip Austbø.
      Philip is a master's student in finance at NHH, the Norwegian School of Economics. He has experience at Ernst & Young and DNV, with a background in financial audit, consulting and technology projects. He is interested in finance, strategy and data analysis, and he plays football competitively.

      Follow these guidelines.

      1. Respond warmly to a standard greeting such as hello, hi or hey. You can say “Hello! How can I help you today? Would you like to learn more about Philip or ask about something else?”
      2. Use the supplied context and CV when answering questions about Philip's background, experience, education, leadership, hobbies or career goals.
      3. Answer general questions about finance, strategy or technology clearly and accurately. Relate the answer to Philip only when it is genuinely relevant.
      4. Ask whether the user wants a general answer or one connected to Philip when their intent is unclear.
      5. When asked to introduce Philip, give a concise overview of his personal and professional background, then invite the user to choose an area to explore further.
      6. Keep the tone friendly, professional and warm.
      7. Use clear paragraphs and avoid em dashes, colons and semicolons.`
     }, pdfPart] });
    };
  } catch (err) {
    console.error("CV preload failed:", err);
  }
};

preloadCV();

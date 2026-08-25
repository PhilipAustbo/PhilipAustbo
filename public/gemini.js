const container = document.querySelector(".container");
const chatsContainer = document.querySelector(".chats-container");
const promptForm = document.querySelector(".prompt-form");
const promptInput = promptForm.querySelector(".prompt-input");
const fileInput = promptForm.querySelector("#file-input");
const fileUploadWrapper = promptForm.querySelector(".file-upload-wrapper");
const themeToggleBtn = document.querySelector("#theme-toggle-btn");
const sendPromptBtn = document.querySelector("#send-prompt-btn");

const API_URL = "/api/ask"; // updated endpoint

let controller;
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

const generateResponse = async (botMsgDiv) => {
  const textElement = botMsgDiv.querySelector(".message-text");
  controller = new AbortController();
  let responseText = "";

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

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "No response from API");
    }

    if (!response.body) throw new Error("No response stream from API");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const processEvent = (eventText) => {
      const payload = eventText
        .split(/\r?\n/)
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trimStart())
        .join("\n")
        .trim();

      if (!payload) return;

      const event = JSON.parse(payload);

      if (event.type === "error") {
        throw new Error(event.error || "The response was interrupted");
      }

      if (event.type === "chunk" && event.text) {
        responseText += event.text;
        textElement.innerHTML = marked.parse(responseText);
        scrollToBottom();
      }
    };

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split(/\r?\n\r?\n/);
      buffer = events.pop() || "";
      events.forEach(processEvent);
    }

    buffer += decoder.decode();

    if (buffer.trim()) processEvent(buffer);

    responseText = responseText.trim();
    if (!responseText) throw new Error("No response from API");

    textElement.innerHTML = marked.parse(responseText);
    chatHistory.push({ role: "user", parts: [{ text: userData.message }] });
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });
    botMsgDiv.classList.remove("loading");
    showFinishedAvatar(botMsgDiv);
    document.body.classList.remove("bot-responding");
  } catch (error) {
    if (error.name === "AbortError") {
      if (!responseText.trim()) textElement.textContent = "Response stopped.";
    } else {
      textElement.textContent = "Something went wrong. Please try again.";
      textElement.style.color = "#d62939";
    }
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

  const botMsgHTML = `<div class="avatar" aria-label="Assistant is thinking"><span class="avatar-icon material-symbols-rounded" aria-hidden="true">progress_activity</span></div><div class="message-text">Loading...</div>`;
  const botMsgDiv = createMessageElement(botMsgHTML, "bot-message", "loading");
  chatsContainer.appendChild(botMsgDiv);
  scrollToBottom();
  generateResponse(botMsgDiv);
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

// api/ask.js

const PRIMARY_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash";

const RETRYABLE_STATUS_CODES = new Set([
  408,
  429,
  500,
  502,
  503,
  504,
]);

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function callGemini({ model, apiKey, contents }) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${model}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({ contents }),
  });

  const responseText = await response.text();

  let data;

  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    data = {
      error: {
        message: "Gemini returned an invalid response.",
      },
    };
  }

  return {
    response,
    data,
  };
}

async function callWithRetries({
  model,
  apiKey,
  contents,
  maximumAttempts = 3,
}) {
  let lastResult;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    lastResult = await callGemini({
      model,
      apiKey,
      contents,
    });

    if (lastResult.response.ok) {
      return lastResult;
    }

    const shouldRetry = RETRYABLE_STATUS_CODES.has(
      lastResult.response.status
    );

    if (!shouldRetry || attempt === maximumAttempts) {
      return lastResult;
    }

    // Approximately 1 second, 2 seconds, then 4 seconds,
    // with a small amount of random jitter.
    const baseDelay = 1000 * 2 ** (attempt - 1);
    const jitter = Math.floor(Math.random() * 500);

    await sleep(baseDelay + jitter);
  }

  return lastResult;
}

function extractReply(data) {
  const candidate = data?.candidates?.[0];

  return candidate?.content?.parts
    ?.filter(
      (part) =>
        typeof part?.text === "string" &&
        part.text.trim() &&
        part.thought !== true
    )
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const apiKey =
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Missing Gemini API key");

    return res.status(500).json({
      error: "Server configuration error: Gemini API key is missing",
    });
  }

  let requestBody = req.body;

  if (typeof requestBody === "string") {
    try {
      requestBody = JSON.parse(requestBody);
    } catch {
      return res.status(400).json({
        error: "Invalid JSON request body",
      });
    }
  }

  const contents = requestBody?.contents;

  if (!Array.isArray(contents) || contents.length === 0) {
    return res.status(400).json({
      error: "Invalid request: contents must be a non-empty array",
    });
  }

  try {
    let result = await callWithRetries({
      model: PRIMARY_MODEL,
      apiKey,
      contents,
    });

    // If Gemini 3.5 remains overloaded after retrying,
    // try Gemini 2.5 Flash.
    if (
      !result.response.ok &&
      RETRYABLE_STATUS_CODES.has(result.response.status)
    ) {
      console.warn(
        `${PRIMARY_MODEL} unavailable. Trying ${FALLBACK_MODEL}.`
      );

      result = await callWithRetries({
        model: FALLBACK_MODEL,
        apiKey,
        contents,
        maximumAttempts: 2,
      });
    }

    if (!result.response.ok) {
      const errorMessage =
        result.data?.error?.message ||
        `Gemini API request failed with status ` +
          `${result.response.status}`;

      console.error("Gemini API error:", {
        status: result.response.status,
        message: errorMessage,
      });

      return res.status(result.response.status).json({
        error: errorMessage,
      });
    }

    const reply = extractReply(result.data);

    if (!reply) {
      const candidate = result.data?.candidates?.[0];
      const blockReason =
        result.data?.promptFeedback?.blockReason;
      const finishReason = candidate?.finishReason;

      return res.status(502).json({
        error: blockReason
          ? `The request was blocked: ${blockReason}`
          : finishReason
            ? `Gemini returned no text. Finish reason: ${finishReason}`
            : "Gemini returned no text response",
      });
    }

    return res.status(200).json({
      reply,
    });
  } catch (error) {
    console.error("Internal server error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
}
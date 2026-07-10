// api/ask.js

const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_API_URL =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
    console.error("Missing GOOGLE_API_KEY or GEMINI_API_KEY");

    return res.status(500).json({
      error: "Server configuration error: Gemini API key is missing",
    });
  }

  let requestBody = req.body;

  // Handle cases where the request body has not already been parsed.
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
    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents,
      }),
    });

    const responseText = await geminiResponse.text();

    let data;

    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      console.error("Gemini returned invalid JSON:", responseText);

      return res.status(502).json({
        error: "Gemini returned an invalid response",
      });
    }

    if (!geminiResponse.ok) {
      const errorMessage =
        data?.error?.message ||
        `Gemini API request failed with status ${geminiResponse.status}`;

      console.error("Gemini API error:", {
        status: geminiResponse.status,
        message: errorMessage,
      });

      return res.status(geminiResponse.status).json({
        error: errorMessage,
      });
    }

    const candidate = data?.candidates?.[0];

    const reply = candidate?.content?.parts
      ?.filter(
        (part) =>
          typeof part?.text === "string" &&
          part.text.trim() &&
          part.thought !== true
      )
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (!reply) {
      const blockReason = data?.promptFeedback?.blockReason;
      const finishReason = candidate?.finishReason;

      console.error("Gemini returned no visible text:", {
        blockReason,
        finishReason,
      });

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
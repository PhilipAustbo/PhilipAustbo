const PRIMARY_MODEL = "gemini-3.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = `You are an assistant representing Philip Tinius Riise Austbø.

Use the profile below when answering questions about Philip. Keep answers accurate and do not invent details.

Education
- Norwegian School of Economics, NHH. Master of Science in Finance and CEMS Master in International Management. GPA 4.9 out of 5.0. August 2024 to expected graduation in June 2027.
- Vienna University of Economics and Business. Selected for the CEMS dual-degree program for spring 2027.
- Norwegian School of Economics, NHH. Bachelor of Science in Business Administration. August 2021 to June 2024.
- University of Michigan, Stephen M. Ross School of Business. Exchange semester from January to June 2023. GPA 3.9 out of 4.0.
- Relevant coursework includes Investments, Corporate Finance, Microeconomics, Macroeconomics, Negotiation Strategy, Product Innovation Management, Entrepreneurial Management, Decision Modelling and Analysis, Business Data Processing, and Strategy.

Professional experience
- Capgemini Invent in Oslo. Strategy Consulting Intern from June to August 2026. Conducted strategic and market analysis of AI-driven disruption in the TMT sector. Evaluated future business models, customer care transformation, operating models, and growth opportunities. Developed venture business cases covering revenue, costs, profitability, feasibility, and risk. Built an AI-powered business case generator for financial and strategic analysis.
- DNV in Dubai. Maritime Advisory Intern from September to December 2025. Helped develop corporate HSE and ESG frameworks. Reviewed more than 100 policies and training materials. Conducted strategic and financial analyses of maritime technologies and trends in the GCC, including investment potential and ESG impact.
- Ernst & Young in Bergen. Financial Audit and Assurance Services Intern from January to December 2025. Participated in public and private company audits under IFRS and GAAP. Designed and maintained more than 20 Excel models for control testing. Identified financial risks and presented findings to senior auditors.
- Face2Face Creatives in Bergen. Fundraising and Sales Associate from June to August 2025. Represented Plan International in public outreach, engaged with more than 200 people weekly, and was recognized as Rookie of the Month.
- Additional experience includes analyst and assistant work at Austbø AS, a family-owned seafood wholesaler, freelance mathematics tutoring, healthcare assistance at Rådalslien Shared Accommodation, substitute teaching at Storetveit High School, and certified football coaching at Fana IL.

Leadership and extracurricular experience
- Competitive football player and team captain across several levels, including Brann U16 and multiple Norwegian third-division clubs. Provided leadership on and off the field.
- Active member of the NHH Commodities Group since December 2025. Participates in case work, investment pitches, and technical learning about commodity markets.
- Leader and co-founder of Buketten Asset Management since August 2025. Co-founded a student-run investment group managing a diversified portfolio. Creates investment strategies, leads discussions, makes allocation decisions, and manages risk.

Skills and interests
- Certificates include Bocconi's Private Equity and Venture Capital course, Discover Deloitte Tech, and the McKinsey Forward Program.
- Technical skills include Microsoft Office, Python, JavaScript, R, SQL, and CSS.
- Interests include chess, coding, gaming, skiing, weightlifting, football, and travelling. Philip has visited more than 25 countries.
- Website is https://philip-austbo.vercel.app and email is Philip@austbo.no.

Response guidelines
1. Respond warmly to greetings and offer to help with questions about Philip or another topic.
2. Use the supplied profile for questions about Philip's background, experience, education, leadership, hobbies, or career goals.
3. Answer general questions about finance, strategy, technology, and other topics clearly and accurately. Relate answers to Philip only when genuinely relevant.
4. Ask whether the user wants a general answer or one connected to Philip when the intent is unclear.
5. When introducing Philip, give a concise overview and invite the user to choose an area to explore further.
6. Keep the tone friendly, professional, and warm.
7. Use clear paragraphs and avoid em dashes, colons, and semicolons in visible answers.`;

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

function parseJson(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error: {
        message: "Gemini returned an invalid response.",
      },
    };
  }
}

async function callGeminiStream({ model, apiKey, contents, signal }) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${model}:streamGenerateContent?alt=sse`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
    }),
    signal,
  });

  if (response.ok) {
    return { response, data: null };
  }

  const responseText = await response.text();

  return {
    response,
    data: parseJson(responseText),
  };
}

async function callWithRetries({
  model,
  apiKey,
  contents,
  signal,
  maximumAttempts = 3,
}) {
  let lastResult;

  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    lastResult = await callGeminiStream({
      model,
      apiKey,
      contents,
      signal,
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

    const baseDelay = 1000 * 2 ** (attempt - 1);
    const jitter = Math.floor(Math.random() * 500);

    await sleep(baseDelay + jitter);
  }

  return lastResult;
}

function extractReplyChunk(data) {
  const candidate = data?.candidates?.[0];

  return candidate?.content?.parts
    ?.filter(
      (part) =>
        typeof part?.text === "string" &&
        part.text &&
        part.thought !== true
    )
    .map((part) => part.text)
    .join("") || "";
}

function getSseData(eventText) {
  return eventText
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n")
    .trim();
}

function createSseEvent(event) {
  return `data: ${JSON.stringify(event)}\n\n`;
}

function jsonResponse(data, status, extraHeaders = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  });
}

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return jsonResponse(
        { error: "Method not allowed" },
        405,
        { Allow: "POST" }
      );
    }

    const apiKey =
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Missing Gemini API key");

      return jsonResponse(
        {
          error: "Server configuration error. Gemini API key is missing.",
        },
        500
      );
    }

    let requestBody;

    try {
      requestBody = await request.json();
    } catch {
      return jsonResponse(
        { error: "Invalid JSON request body" },
        400
      );
    }

    const contents = requestBody?.contents;

    if (!Array.isArray(contents) || contents.length === 0) {
      return jsonResponse(
        {
          error: "Invalid request. Contents must be a non-empty array.",
        },
        400
      );
    }

    const upstreamController = new AbortController();
    request.signal.addEventListener(
      "abort",
      () => upstreamController.abort(),
      { once: true }
    );

    try {
      let result = await callWithRetries({
        model: PRIMARY_MODEL,
        apiKey,
        contents,
        signal: upstreamController.signal,
      });

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
          signal: upstreamController.signal,
          maximumAttempts: 2,
        });
      }

      if (!result.response.ok) {
        const errorMessage =
          result.data?.error?.message ||
          `Gemini API request failed with status ` +
            `${result.response.status}`;

        console.error("Gemini API error", {
          status: result.response.status,
          message: errorMessage,
        });

        return jsonResponse(
          { error: errorMessage },
          result.response.status
        );
      }

      if (!result.response.body) {
        return jsonResponse(
          { error: "Gemini returned no response stream." },
          502
        );
      }

      const reader = result.response.body.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      const responseStream = new ReadableStream({
        async start(controller) {
          let buffer = "";
          let receivedText = false;
          let lastData = null;

          const sendEvent = (event) => {
            controller.enqueue(
              encoder.encode(createSseEvent(event))
            );
          };

          const processUpstreamEvent = (eventText) => {
            const payload = getSseData(eventText);

            if (!payload || payload === "[DONE]") return;

            const data = parseJson(payload);
            lastData = data;

            if (data?.error?.message) {
              throw new Error(data.error.message);
            }

            const text = extractReplyChunk(data);

            if (text) {
              receivedText = true;
              sendEvent({ type: "chunk", text });
            }
          };

          try {
            while (true) {
              const { value, done } = await reader.read();

              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const events = buffer.split(/\r?\n\r?\n/);
              buffer = events.pop() || "";
              events.forEach(processUpstreamEvent);
            }

            buffer += decoder.decode();

            if (buffer.trim()) {
              processUpstreamEvent(buffer);
            }

            if (!receivedText) {
              const candidate = lastData?.candidates?.[0];
              const blockReason = lastData?.promptFeedback?.blockReason;
              const finishReason = candidate?.finishReason;
              const errorMessage = blockReason
                ? `The request was blocked. ${blockReason}`
                : finishReason
                  ? `Gemini returned no text. ${finishReason}`
                  : "Gemini returned no text response.";

              sendEvent({ type: "error", error: errorMessage });
            } else {
              sendEvent({ type: "done" });
            }
          } catch (error) {
            if (!upstreamController.signal.aborted) {
              console.error("Streaming error", error);
              sendEvent({
                type: "error",
                error: "The response was interrupted. Please try again.",
              });
            }
          } finally {
            try {
              controller.close();
            } catch {
              // The browser may already have cancelled the stream.
            }
          }
        },
        cancel(reason) {
          upstreamController.abort();
          return reader.cancel(reason);
        },
      });

      return new Response(responseStream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-store, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    } catch (error) {
      if (upstreamController.signal.aborted) {
        return new Response(null, { status: 499 });
      }

      console.error("Internal server error", error);

      return jsonResponse(
        { error: "Internal server error" },
        500
      );
    }
  },
};

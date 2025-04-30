// api/ask.js
export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Du kan evt. være strengere her
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end(); // Preflight check
    }
  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt in request body." });
    }
  
    try {
      console.log("Received prompt:", prompt);
  
      const reply = `Echo: ${prompt}`;
  
      return res.status(200).json({
        candidates: [
          {
            content: {
              parts: [{ text: reply }],
            },
          },
        ],
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
  
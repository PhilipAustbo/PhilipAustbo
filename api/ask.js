// /api/ask.js – Bruker Gemini API via fetch (Vercel API route)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { contents } = req.body;
  
    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Missing or invalid contents in request body' });
    }
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contents }),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Gemini API Error]', errorText);
        return res.status(500).json({ error: 'Gemini API error', details: errorText });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('[Server Error]', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
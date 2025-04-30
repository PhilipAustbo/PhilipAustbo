// pages/api/ask.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { contents } = req.body;

    if (!contents || !Array.isArray(contents)) {
      return res.status(400).json({ error: 'Missing or invalid contents in request body' });
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error('[Gemini API Error]', data);
      return res.status(500).json({ error: 'Gemini API error', details: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('[Server Error]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// pages/api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { contents } = req.body;

  if (!contents || !Array.isArray(contents)) {
    return res.status(400).json({ error: 'Missing or invalid contents in request body' });
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Gemini API key in environment.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('[Gemini API Error]', errText);
      return res.status(500).json({ error: 'Gemini API error', details: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('[Server Error]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
console.log('Inngående forespørsel til /api/ask:', contents);


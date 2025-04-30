export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { prompt } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY;
  
    try {
      const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
  
      const data = await geminiRes.json();
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  }
  
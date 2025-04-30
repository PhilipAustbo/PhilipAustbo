// api/ask.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { contents, prompt } = req.body;
  
    if (!contents && !prompt) {
      return res.status(400).json({ error: 'Missing prompt or contents in request body.' });
    }
  
    try {
      // Hvis du bare bruker en dummy-respons (ingen Google API ennå):
      const promptText = contents
        ? contents.find(part => part.role === 'user')?.parts?.[0]?.text || 'No input'
        : prompt;
  
      console.log('[INFO] Received prompt:', promptText);
  
      // Dummy test-respons
      const reply = `Echo: ${promptText}`;
  
      return res.status(200).json({
        candidates: [
          {
            content: {
              parts: [{ text: reply }]
            }
          }
        ]
      });
    } catch (error) {
      console.error('[ERROR] Failed to process request:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
  
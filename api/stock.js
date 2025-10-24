export default async function handler(req, res) {
  const { symbol } = req.query;

  // Les API-nøkkelen fra server-side miljøvariabel
  const apiKey = process.env.ALPHA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ALPHA_API_KEY not set' });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    // Hent prisen fra Global Quote-objektet
    const price = parseFloat(data['Global Quote']['05. price']);
    if (Number.isNaN(price)) {
        return res.status(404).json({ error: 'Price not found' });
    }

    res.status(200).json({ price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching price' });
  }
}

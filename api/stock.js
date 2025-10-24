module.exports = async (req, res) => {
  const { symbol } = req.query;
  const apiKey = process.env.ALPHA_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ALPHA_API_KEY not set' });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const price = parseFloat(data['Global Quote']['05. price']);
    if (Number.isNaN(price)) {
      return res.status(404).json({ error: 'Price not found' });
    }
    return res.status(200).json({ price });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching price' });
  }
};

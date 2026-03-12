export default async function handler(req, res) {
  const binId = process.env.JSONBIN_BIN_ID;
  const masterKey = process.env.JSONBIN_MASTER_KEY;

  if (!binId || !masterKey) {
    return res.status(500).json({ error: 'JSONBin not configured' });
  }

  if (req.method === 'GET') {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: { 'X-Master-Key': masterKey },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `JSONBin read: ${response.status}` });
    }
    const data = await response.json();
    return res.status(200).json(data.record || {});
  }

  if (req.method === 'PUT') {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': masterKey,
      },
      body: JSON.stringify(req.body),
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: `JSONBin write: ${response.status}` });
    }
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Vercel serverless function: forwards requests to the official FPL API.
// The browser can't call the FPL API directly (no CORS), so the app
// calls /api/fpl?path=... and this function fetches it server-side.
export default async function handler(req, res) {
  const { path } = req.query;

  // Only allow simple FPL API paths - nothing else can be fetched.
  if (!path || !/^[a-z0-9\/\-_]+\/?$/i.test(path)) {
    return res.status(400).json({ error: "Invalid path" });
  }

  try {
    const r = await fetch(`https://fantasy.premierleague.com/api/${path}`, {
      headers: { "User-Agent": "Mozilla/5.0 (FPL Companion)" },
    });
    if (!r.ok) {
      return res.status(r.status).json({ error: `FPL API returned ${r.status}` });
    }
    const data = await r.json();
    // Cache for 60s on Vercel's edge to be kind to the FPL API.
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: "Could not reach the FPL API" });
  }
}

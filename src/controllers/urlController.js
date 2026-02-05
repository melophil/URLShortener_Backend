const Url = require("../models/Url");
const encode = require("../utils/base62");
const redisClient = require("../config/redis");

// 🆕 CREATE SHORT URL
exports.shortenUrl = async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "URL required" });

    // Basic URL validation
    try {
      new URL(longUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // 🔍 Check if URL already exists (dedup)
    const existing = await Url.findOne({ longUrl });
    if (existing) {
      console.log("♻️ Existing URL found, returning same short code");
      return res.json({ shortUrl: `${process.env.BASE_URL}/${existing.shortCode}` });
    }

    const url = new Url({ longUrl, userId: req.userId});
    await url.save();

    url.shortCode = encode(parseInt(url._id.toString().slice(-6), 16));
    await url.save();

    console.log(`✨ New short URL created: ${url.shortCode}`);

    res.json({ shortUrl: `${process.env.BASE_URL}/${url.shortCode}` });
  } catch (err) {
    console.error("Shorten error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔁 REDIRECT USING CACHE
exports.redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;

    const start = Date.now();

    // 🔍 Check Redis cache
    const cachedUrl = await redisClient.get(code);
    if (cachedUrl) {
      console.log(`⚡ CACHE HIT for ${code} (${Date.now() - start}ms)`);
      await redisClient.incr(`clicks:${code}`);
      return res.redirect(cachedUrl);
    }

    console.log(`🐢 CACHE MISS for ${code} — fetching from DB`);

    const url = await Url.findOne({ shortCode: code });
    if (!url) return res.status(404).json({ error: "Not found" });

    // Store in Redis
    await redisClient.set(code, url.longUrl, { EX: 60 * 60 * 24 });

    await redisClient.incr(`clicks:${code}`);

    console.log(`💾 Stored ${code} in cache (${Date.now() - start}ms)`);

    res.redirect(url.longUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

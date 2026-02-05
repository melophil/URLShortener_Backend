require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const Url = require("../models/Url");
const redisClient = require("../config/redis");

// 🔌 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected (Worker)"))
  .catch(err => console.error("MongoDB connection error:", err));

async function processClicks() {
  const keys = await redisClient.keys("clicks:*");

  for (const key of keys) {
    const code = key.split(":")[1];
    const count = parseInt(await redisClient.get(key));

    if (count > 0) {
      await Url.updateOne(
        { shortCode: code },
        { $inc: { clicks: count } }
      );

      await redisClient.del(key);
      console.log(`📊 Updated ${count} clicks for ${code}`);
    }
  }
}

setInterval(processClicks, 60000);

console.log("📊 Click analytics worker running...");

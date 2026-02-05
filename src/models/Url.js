const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  clicks: { type: Number, default: 0 },

  // 🔐 Add this field
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

}, { timestamps: true });

module.exports = mongoose.model("Url", urlSchema);

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { shortenUrl, redirectUrl,getMyLinks } = require("../controllers/urlController");
const { shortenLimiter, redirectLimiter } = require("../middleware/rateLimiter");

router.post("/shorten",auth, shortenLimiter, shortenUrl);
router.get("/my-links", auth, getMyLinks);
router.get("/:code", redirectLimiter, redirectUrl);


module.exports = router;

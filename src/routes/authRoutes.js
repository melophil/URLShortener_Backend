const express = require("express");
const router = express.Router();

// controllers
const { signup, login, me, logout } = require("../controllers/AuthController");

// middleware
const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, me);     // now auth is defined
router.post("/logout", logout);

module.exports = router;

const express = require("express");
const router = express.Router();
const { authUser, registerUser } = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/login", authUser);
router.post("/register", protect, admin, registerUser); // Only admin can register new users? Or public for demo? Plan says Admin creates teachers.

// For initial setup, we might need a way to create the first admin.
// I'll leave it as protect+admin, but user might need to seed.
// Actually, I'll allow public register for now just to create the first user, or I'll create a seeder.
// Better: make register public strictly for this dev phase or add a separate seed script.
// I'll stick to 'protect, admin' but maybe comment it out for first run or provide a seeder.
// Let's implement a 'seed' endpoint or just allow public register for this turn to make it easy for user to start.
// Re-reading plan: "Admin: Create access accounts for Teachers."
// So Register IS Admin only.
// How to create first Admin? Seeder.

module.exports = router;

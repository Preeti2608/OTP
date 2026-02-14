const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
//const { protect } = require("../middlewares/authMiddleware");
const { protect, authorize } = require("../middlewares/authMiddleware");


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/verify-otp", authController.verifyOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);


router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Welcome to dashboard", user: req.user });
});

// Admin-only route
router.get(
  "/admin/dashboard",
  protect,
  authorize("ADMIN"),
  (req, res) => {
    res.json({ message: "Welcome Admin", user: req.user });
  }
);


module.exports = router;


// const express = require("express");
// const router = express.Router();
// const authController = require("../controllers/authController");

// // ---------------- SIGNUP ----------------
// router.post("/signup", authController.signup);

// // ---------------- LOGIN ----------------
// router.post("/login", authController.login);

// // ---------------- OTP VERIFY ----------------
// router.post("/verify-otp", authController.verifyOtp);

// module.exports = router;


// const express = require("express");
// const router = express.Router();

// const authController = require("../controllers/authController");

// /* SIGNUP */
// router.post("/signup", authController.signup);

// /* LOGIN */
// router.post("/login", authController.login);

// /* VERIFY OTP */
// router.post("/verify-otp", authController.verifyOtp);

// module.exports = router;

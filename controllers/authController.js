// const generateOTP = require("../utils/generateOtp");
// const transporter = require("../config/mailConfig");
// const userModel = require("../models/userModel");
// const otpModel = require("../models/otpModel");
// const generateToken = require("../utils/generateToken");

// ---------------- SIGNUP ----------------
// exports.signup = (req, res) => {
//   const { email, password } = req.body;

//   // Check if user exists
//   userModel.findUserByEmail(email, (err, existingUser) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (existingUser)
//       return res.json({ success: false, message: "User already exists" });

//     // Create new user
//     userModel.createUser(email, password, (err, result) => {
//       if (err) return res.json({ success: false, message: "DB error" });

//       const userId = result.insertId;
//       const otp = generateOTP();
//       const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//       // Store OTP in DB
//       otpModel.storeOtp(userId, otp, expiresAt, (err, result) => {
//         if (err) console.error("Error storing OTP:", err);
//       });

//       // Send OTP email
//       transporter.sendMail({
//         from: "testing.purpose2608@gmail.com",
//         to: email,
//         subject: "Verify your account",
//         text: `Your OTP is ${otp}`
//       });

//       res.json({ success: true, message: "Signup successful. OTP sent." });
//     });
//   });
// };

// ---------------- SIGNUP ----------------
//45 - 87
// exports.signup = (req, res) => {
//   const { email, password } = req.body;

//   userModel.findUserByEmail(email, (err, existingUser) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (existingUser)
//       return res.json({ success: false, message: "User already exists" });

//     userModel.createUser(email, password, (err, result) => {
//       if (err) return res.json({ success: false, message: "DB error" });

//       const userId = result.insertId;

//       // ✅ RATE LIMIT CHECK (ADD HERE)
//       otpModel.countRecentOtps(userId, (err, count) => {
//         if (count >= 3) {
//           return res.json({
//             success: false,
//             message: "Too many OTP requests. Please try after 10 minutes."
//           });
//         }

//         // ✅ Generate OTP ONLY if allowed
//         const otp = generateOTP();
//         const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//         otpModel.storeOtp(userId, otp, expiresAt);

//         transporter.sendMail({
//           from: "testing.purpose2608@gmail.com",
//           to: email,
//           subject: "Verify your account",
//           text: `Your OTP is ${otp}`
//         });

//         res.json({
//           success: true,
//           message: "Signup successful. OTP sent."
//         });
//       });
//     });
//   });
// };


// ---------------- LOGIN ----------------
// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (!user) return res.json({ success: false, message: "User not found" });

//     if (user.password !== password)
//       return res.json({ success: false, message: "Wrong password" });

//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//     // Store OTP in DB
//     otpModel.storeOtp(user.id, otp, expiresAt, (err, result) => {
//       if (err) console.error("Error storing OTP:", err);
//     });

//     // Send OTP email
//     transporter.sendMail({
//       from: "testing.purpose2608@gmail.com",
//       to: email,
//       subject: "Login OTP",
//       text: `Your OTP is ${otp}`
//     });

//     res.json({ success: true, message: "OTP sent for login" });
//   });
// };

// ---------------- LOGIN ----------------
//122 - 156
// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (!user) return res.json({ success: false, message: "User not found" });

//     if (user.password !== password)
//       return res.json({ success: false, message: "Wrong password" });

//     // ✅ RATE LIMIT CHECK (ADD HERE)
//     otpModel.countRecentOtps(user.id, (err, count) => {
//       if (count >= 3) {
//         return res.json({
//           success: false,
//           message: "Too many OTP requests. Try again after 10 minutes."
//         });
//       }

//       const otp = generateOTP();
//       const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//       otpModel.storeOtp(user.id, otp, expiresAt);

//       transporter.sendMail({
//         from: "testing.purpose2608@gmail.com",
//         to: email,
//         subject: "Login OTP",
//         text: `Your OTP is ${otp}`
//       });

//       res.json({ success: true, message: "OTP sent for login" });
//     });
//   });
// };


// ---------------- OTP VERIFY ----------------
// exports.verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   // Find user first
//   userModel.findUserByEmail(email, (err, user) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (!user) return res.json({ success: false, message: "User not found" });

//     // Find latest OTP for this user
//     otpModel.findOtpByUserId(user.id, (err, results) => {
//       if (err) return res.json({ success: false, message: "DB error" });

//       const record = results[0];
//       if (!record) return res.json({ success: false, message: "OTP not found" });

//       if (new Date() > record.expires_at)
//         return res.json({ success: false, message: "OTP expired" });

//       if (record.otp != otp)
//         return res.json({ success: false, message: "Invalid OTP" });

//       // Mark user as verified
//       userModel.verifyUser(email, (err, result) => {
//         if (err) return res.json({ success: false, message: "DB error" });

//         // Mark OTP as used
//         otpModel.markOtpUsed(record.id, (err, result) => {
//           if (err) console.error(err);
//         });

//         res.json({ success: true, message: "OTP verified successfully" });
//       });
//     });
//   });
// };

// exports.verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (!user) return res.json({ success: false, message: "User not found" });

//     otpModel.findLatestOtpByUser(user.id, (err, record) => {
//       if (!record)
//         return res.json({ success: false, message: "OTP not found" });

//       // Expiry check
//       if (new Date() > record.expires_at)
//         return res.json({ success: false, message: "OTP expired" });

//       // Attempt limit
//       if (record.attempts >= 3)
//         return res.json({
//           success: false,
//           message: "Too many wrong attempts. OTP blocked."
//         });

//       // Wrong OTP
//       if (record.otp != otp) {
//         otpModel.incrementAttempts(record.id, () => {
//           res.json({ success: false, message: "Invalid OTP" });
//         });
//         return;
//       }

//       // ✅ Correct OTP
//       userModel.verifyUser(email, () => {
//         otpModel.markOtpUsed(record.id, () => {
//           res.json({ success: true, message: "OTP verified successfully" });
//         });
//       });
//     });
//   });
// };


//235 - 378
// exports.verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   // 1️⃣ Find user
//   userModel.findUserByEmail(email, (err, user) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (!user)
//       return res.json({ success: false, message: "User not found" });

//     // 2️⃣ Get latest unused OTP
//     otpModel.findLatestOtpByUser(user.id, (err, record) => {
//       if (!record)
//         return res.json({ success: false, message: "OTP not found" });

//       // 3️⃣ Expiry check
//       if (new Date() > record.expires_at) {
//         return res.json({
//           success: false,
//           message: "OTP expired"
//         });
//       }

//       // 4️⃣ Attempt limit (ANTI BRUTE FORCE)
//       if (record.attempts >= 3) {
//         return res.json({
//           success: false,
//           message: "Too many wrong attempts. OTP blocked."
//         });
//       }

//       // 5️⃣ Wrong OTP
//       if (record.otp != otp) {
//         otpModel.incrementAttempts(record.id, () => {
//           res.json({
//             success: false,
//             message: "Invalid OTP"
//           });
//         });
//         return;
//       }

//       // 6️⃣ ✅ Correct OTP → SUCCESS FLOW
//       userModel.verifyUser(email, () => {
//         otpModel.markOtpUsed(record.id, () => {

//           // 7️⃣ Generate JWT
//           const token = generateToken({
//             id: user.id,
//             email: user.email
//           });

//           // 8️⃣ Send JWT as httpOnly cookie
//           res.cookie("token", token, {
//             httpOnly: true,
//             secure: false, // true in production (HTTPS)
//             maxAge: 15 * 60 * 1000 // 15 minutes
//           });

//           res.json({
//             success: true,
//             message: "OTP verified & logged in successfully"
//           });
//         });
//       });
//     });
//   });
// };


// exports.forgotPassword = (req, res) => {
//   const { email } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (!user)
//       return res.json({ success: false, message: "User not found" });

//     // ✅ Rate limiting (reuse)
//     otpModel.countRecentOtps(user.id, "FORGOT_PASSWORD", (err, count) => {
//       if (count >= 3) {
//         return res.json({
//           success: false,
//           message: "Too many OTP requests. Try after 10 minutes."
//         });
//       }

//       const otp = generateOTP();
//       const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//       otpModel.storeOtp(
//         user.id,
//         otp,
//         expiresAt,
//         "FORGOT_PASSWORD"
//       );

//       transporter.sendMail({
//         from: "testing.purpose2608@gmail.com",
//         to: email,
//         subject: "Reset Password OTP",
//         text: `Your password reset OTP is ${otp}`
//       });

//       res.json({ success: true, message: "OTP sent to email" });
//     });
//   });
// };

// exports.resetPassword = (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (!user)
//       return res.json({ success: false, message: "User not found" });

//     otpModel.findLatestOtpByUser(user.id, "FORGOT_PASSWORD", (err, record) => {
//       if (!record)
//         return res.json({ success: false, message: "OTP not found" });

//       if (new Date() > record.expires_at)
//         return res.json({ success: false, message: "OTP expired" });

//       if (record.attempts >= 3)
//         return res.json({
//           success: false,
//           message: "OTP blocked due to multiple attempts"
//         });

//       if (record.otp != otp) {
//         otpModel.incrementAttempts(record.id);
//         return res.json({ success: false, message: "Invalid OTP" });
//       }

//       // ✅ SUCCESS
//       userModel.updatePassword(email, newPassword, () => {
//         otpModel.markOtpUsed(record.id);
//         res.json({
//           success: true,
//           message: "Password reset successful"
//         });
//       });
//     });
//   });
// };






// const generateOTP = require("../utils/generateOtp");
// const transporter = require("../config/mailConfig");
// const userModel = require("../models/userModel");
// const otpModel = require("../models/otpModel");

// // ---------------- SIGNUP ----------------
// exports.signup = (req, res) => {
//   const { email, password } = req.body;

//   userModel.findUserByEmail(email, (err, existingUser) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (existingUser)
//       return res.json({ success: false, message: "User already exists" });

//     userModel.createUser(email, password, (err, result) => {
//       if (err) return res.json({ success: false, message: "DB error" });

//       const otp = generateOTP();
//       const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
//       const userId = result.insertId;

//       otpModel.storeOtp(userId, otp, expiresAt);

//       transporter.sendMail({
//         from: "testing.purpose2608@gmail.com",
//         to: email,
//         subject: "Verify your account",
//         text: `Your OTP is ${otp}`
//       });

//       res.json({
//         success: true,
//         message: "Signup successful. OTP sent."
//       });
//     });
//   });
// };

// // ---------------- LOGIN ----------------
// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (!user) return res.json({ success: false, message: "User not found" });

//     if (user.password !== password)
//       return res.json({ success: false, message: "Wrong password" });

//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//     otpModel.storeOtp(user.id, otp, expiresAt);

//     transporter.sendMail({
//       from: "testing.purpose2608@gmail.com",
//       to: email,
//       subject: "Login OTP",
//       text: `Your OTP is ${otp}`
//     });

//     res.json({ success: true, message: "OTP sent for login" });
//   });
// };

// // ---------------- OTP VERIFY ----------------
// exports.verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (!user) return res.json({ success: false, message: "User not found" });

//     otpModel.findOtpByUser(user.id, (err, record) => {
//       if (!record)
//         return res.json({ success: false, message: "OTP not found" });

//       if (new Date() > record.expires_at)
//         return res.json({ success: false, message: "OTP expired" });

//       if (record.otp != otp)
//         return res.json({ success: false, message: "Invalid OTP" });

//       userModel.verifyUser(email, () => {
//         otpModel.deleteOtp(record.id);
//         res.json({ success: true, message: "OTP verified successfully" });
//       });
//     });
//   });
// };


//last version with DB otp storage
// const generateOTP = require("../utils/generateOtp");
// const transporter = require("../config/mailConfig");
// const userModel = require("../models/userModel");
// const otpModel = require("../models/otpModel");


// const otpStore = {}; // OTP temporary storage

// // ---------------- SIGNUP ----------------
// exports.signup = (req, res) => {
//   const { email, password } = req.body;

//   // Check if user exists
//   userModel.findUserByEmail(email, (err, existingUser) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (existingUser) return res.json({ success: false, message: "User already exists" });

//     // Create new user
//     userModel.createUser(email, password, (err, result) => {
//       if (err) return res.json({ success: false, message: "DB error" });

//       // Generate OTP
//       // const otp = generateOTP();
//       // otpStore[email] = {
//       //   otp,
//       //   expiresAt: Date.now() + 5 * 60 * 1000
//       // };
//       const otp = generateOTP();
//       const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//       // user ka id chahiye
//       const userId = result.insertId;

//       otpModel.storeOtp(userId, otp, expiresAt);

//       // Send OTP via email
//       transporter.sendMail({
//         from: "testing.purpose2608@gmail.com",
//         to: email,
//         subject: "Verify your account",
//         text: `Your OTP is ${otp}`
//       });

//       res.json({ success: true, message: "Signup successful. OTP sent." });
//     });
//   });
// };

// // ---------------- LOGIN ----------------
// exports.login = (req, res) => {
//   const { email, password } = req.body;

//   userModel.findUserByEmail(email, (err, user) => {
//     if (err) return res.json({ success: false, message: "DB error" });
//     if (!user) return res.json({ success: false, message: "User not found" });

//     if (user.password !== password)
//       return res.json({ success: false, message: "Wrong password" });

//     // Generate OTP for login
//     // const otp = generateOTP();
//     // otpStore[email] = {
//     //   otp,
//     //   expiresAt: Date.now() + 5 * 60 * 1000
//     // };
//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

//     // user ka id chahiye

//     otpModel.storeOtp(user.id, otp, expiresAt);


//     transporter.sendMail({
//       from: "testing.purpose2608@gmail.com",
//       to: email,
//       subject: "Login OTP",
//       text: `Your OTP is ${otp}`
//     });

//     res.json({ success: true, message: "OTP sent for login" });
//   });
// };

// // ---------------- OTP VERIFY ----------------
// exports.verifyOtp = (req, res) => {
//   const { email, otp } = req.body;

//   //const record = otpStore[email];
//   userModel.findUserByEmail(email, (err, user) => {
//   if (!user) return res.json({ success: false, message: "User not found" });

//   otpModel.findOtpByUser(user.id, (err, record) => {
//     if (!record) return res.json({ success: false, message: "OTP not found" });

//     if (new Date() > record.expires_at)
//       return res.json({ success: false, message: "OTP expired" });

//     if (record.otp != otp)
//       return res.json({ success: false, message: "Invalid OTP" });

//     // ✅ user verified
//     userModel.verifyUser(email, () => {
//       otpModel.deleteOtp(record.id); // OTP delete from DB
//       res.json({ success: true, message: "OTP verified successfully" });
//     });
//   });
// });

//   if (!record) return res.json({ success: false, message: "OTP not found" });
//   if (Date.now() > record.expiresAt) return res.json({ success: false, message: "OTP expired" });
//   if (record.otp != otp) return res.json({ success: false, message: "Invalid OTP" });

//   // Mark user as verified in DB
//   userModel.verifyUser(email, (err, result) => {
//     if (err) return res.json({ success: false, message: "DB error" });

//     delete otpStore[email]; // Remove OTP from memory
//     res.json({ success: true, message: "OTP verified successfully" });
//   });
// };


// // const { createUser, findUserByEmail, verifyUser } = require("../models/userModel");
// // const generateOTP = require("../utils/generateOtp");
// // const transporter = require("../config/mailConfig");

// // // OTP storage (temporary)
// // const otpStore = {};

// const generateOTP = require("../utils/generateOtp"); //2nd version
// const transporter = require("../config/mailConfig");
// const userModel = require("../models/userModel");

// const otpStore = {};


// // /* =========================
// //    SIGNUP CONTROLLER
// // ========================= */

// exports.signup = async (req, res) => { //2nd version
//   const { email, password } = req.body;

//   const existingUser = userModel.findUserByEmail(email);
//   if (existingUser) {
//     return res.json({ success: false, message: "User already exists" });
//   }

//   userModel.createUser(email, password);

//   const otp = generateOTP();
//   otpStore[email] = {
//     otp,
//     expiresAt: Date.now() + 5 * 60 * 1000
//   };

//   await transporter.sendMail({
//     from: "testing.purpose2608@gmail.com",
//     to: email,
//     subject: "Verify your account",
//     text: `Your OTP is ${otp}`
//   });

//   res.json({ success: true, message: "Signup successful. OTP sent." });
// };


// // exports.signup = async (req, res) => {
// //   const { email, password } = req.body;

// //   // 1. Check if user already exists
// //   const existingUser = findUserByEmail(email);
// //   if (existingUser) {
// //     return res.json({ success: false, message: "User already exists" });
// //   }

// //   // 2. Create user
// //   const user = createUser(email, password);

// //   // 3. Generate OTP
// //   const otp = generateOTP();

// //   // 4. Store OTP with expiry
// //   otpStore[email] = {
// //     otp,
// //     expiresAt: Date.now() + 5 * 60 * 1000
// //   };

// //   // 5. Send OTP email
// //   await transporter.sendMail({
// //     from: "testing.purpose2608@gmail.com",
// //     to: email,
// //     subject: "Verify your account",
// //     text: `Your OTP is ${otp}. Valid for 5 minutes.`
// //   });

// //   res.json({
// //     success: true,
// //     message: "Signup successful. OTP sent to email"
// //   });
// // };

// // /* =========================
// //    LOGIN CONTROLLER
// // ========================= */

// exports.login = async (req, res) => { //2nd version
//   const { email, password } = req.body;

//   const user = userModel.findUserByEmail(email);
//   if (!user) {
//     return res.json({ success: false, message: "User not found" });
//   }

//   if (user.password !== password) {
//     return res.json({ success: false, message: "Wrong password" });
//   }

//   const otp = generateOTP();
//   otpStore[email] = {
//     otp,
//     expiresAt: Date.now() + 5 * 60 * 1000
//   };

//   await transporter.sendMail({
//     from: "testing.purpose2608@gmail.com",
//     to: email,
//     subject: "Login OTP",
//     text: `Your OTP is ${otp}`
//   });

//   res.json({ success: true, message: "OTP sent for login" });
// };


// // exports.login = async (req, res) => {
// //   const { email, password } = req.body;

// //   // 1. Check user exists
// //   const user = findUserByEmail(email);
// //   if (!user) {
// //     return res.json({ success: false, message: "User not found" });
// //   }

// //   // 2. Check password
// //   if (user.password !== password) {
// //     return res.json({ success: false, message: "Invalid password" });
// //   }

// //   // 3. Generate OTP
// //   const otp = generateOTP();

// //   otpStore[email] = {
// //     otp,
// //     expiresAt: Date.now() + 5 * 60 * 1000
// //   };

// //   // 4. Send OTP
// //   await transporter.sendMail({
// //     from: "testing.purpose2608@gmail.com",
// //     to: email,
// //     subject: "Login OTP",
// //     text: `Your login OTP is ${otp}. Valid for 5 minutes.`
// //   });

// //   res.json({
// //     success: true,
// //     message: "Password verified. OTP sent."
// //   });
// // };

// // /* =========================
// //    VERIFY OTP CONTROLLER
// // ========================= */

// exports.verifyOtp = (req, res) => { //2nd version
//   const { email, otp } = req.body;

//   const record = otpStore[email];
//   if (!record) {
//     return res.json({ success: false, message: "OTP not found" });
//   }

//   if (Date.now() > record.expiresAt) {
//     return res.json({ success: false, message: "OTP expired" });
//   }

//   if (record.otp != otp) {
//     return res.json({ success: false, message: "Invalid OTP" });
//   }

//   userModel.verifyUser(email);
//   delete otpStore[email];

//   res.json({ success: true, message: "OTP verified successfully" });
// };


// // exports.verifyOtp = (req, res) => {
// //   const { email, otp } = req.body;

// //   const record = otpStore[email];

// //   // 1. OTP exists?
// //   if (!record) {
// //     return res.json({ success: false, message: "OTP not found" });
// //   }

// //   // 2. OTP expired?
// //   if (Date.now() > record.expiresAt) {
// //     return res.json({ success: false, message: "OTP expired" });
// //   }

// //   // 3. OTP correct?
// //   if (record.otp == otp) {
// //     delete otpStore[email];
// //     verifyUser(email); // email verified
// //     return res.json({ success: true, message: "OTP verified. Access granted." });
// //   }

// //   res.json({ success: false, message: "Invalid OTP" });
// // };

const generateOTP = require("../utils/generateOtp");
const transporter = require("../config/mailConfig");
const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const generateToken = require("../utils/generateToken");

// Utility to send email
const sendEmail = (email, otp, subject) => {
    transporter.sendMail({
        from: "testing.purpose2608@gmail.com",
        to: email,
        subject: subject,
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
    });
};

exports.signup = (req, res) => {
    const { email, password } = req.body;
    userModel.findUserByEmail(email, (err, existingUser) => {
        if (err) return res.json({ success: false, message: "DB error" });
        if (existingUser) return res.json({ success: false, message: "User already exists" });

        userModel.createUser(email, password, (err, result) => {
            if (err) return res.json({ success: false, message: "Signup failed" });
            
            const userId = result.insertId;
            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            otpModel.storeOtp(userId, otp, expiresAt, 'SIGNUP', (err) => {
                sendEmail(email, otp, "Verify your account");
                res.json({ success: true, message: "Signup successful. OTP sent." });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    userModel.findUserByEmail(email, (err, user) => {
        if (err || !user) return res.json({ success: false, message: "User not found" });
        if (user.password !== password) return res.json({ success: false, message: "Wrong password" });

        otpModel.countRecentOtps(user.id, 'LOGIN', (err, count) => {
            if (count >= 3) return res.json({ success: false, message: "Too many requests. Try later." });

            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            otpModel.storeOtp(user.id, otp, expiresAt, 'LOGIN', (err) => {
                sendEmail(email, otp, "Login OTP");
                res.json({ success: true, message: "OTP sent for login" });
            });
        });
    });
};

exports.verifyOtp = (req, res) => {
    const { email, otp, purpose } = req.body; // Frontend must send 'SIGNUP' or 'LOGIN'

    userModel.findUserByEmail(email, (err, user) => {
        if (!user) return res.json({ success: false, message: "User not found" });

        otpModel.findLatestOtpByUser(user.id, purpose, (err, record) => {
            if (!record) return res.json({ success: false, message: "OTP not found or used" });
            if (new Date() > record.expires_at) return res.json({ success: false, message: "OTP expired" });
            if (record.attempts >= 3) return res.json({ success: false, message: "Too many attempts. OTP blocked." });

            if (record.otp != otp) {
                otpModel.incrementAttempts(record.id, () => {
                    res.json({ success: false, message: "Invalid OTP" });
                });
                return;
            }

            // Success
            userModel.verifyUser(email, () => {
                otpModel.markOtpUsed(record.id, () => {
                    // const token = generateToken({ id: user.id, email: user.email });
                    const token = generateToken({
                        id: user.id,
                        email: user.email,
                        role: user.role
                    });

                    // res.cookie("token", token, { httpOnly: true, maxAge: 15 * 60 * 1000 });
                    res.cookie("token", token, {
                       httpOnly: true,
                       maxAge: 15 * 60 * 1000,
                       sameSite: "lax"
                    });

                    res.json({ success: true, message: "Verified successfully" });
                });
            });
        });
    });
};

exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    userModel.findUserByEmail(email, (err, user) => {
        if (!user) return res.json({ success: false, message: "Email not registered" });

        otpModel.countRecentOtps(user.id, 'FORGOT_PASSWORD', (err, count) => {
            if (count >= 3) return res.json({ success: false, message: "Too many requests." });

            const otp = generateOTP();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            otpModel.storeOtp(user.id, otp, expiresAt, 'FORGOT_PASSWORD', () => {
                sendEmail(email, otp, "Reset Password OTP");
                res.json({ success: true, message: "Reset OTP sent to email" });
            });
        });
    });
};

exports.resetPassword = (req, res) => {
    const { email, otp, newPassword } = req.body;

    userModel.findUserByEmail(email, (err, user) => {
        if (!user) return res.json({ success: false, message: "User not found" });

        otpModel.findLatestOtpByUser(user.id, 'FORGOT_PASSWORD', (err, record) => {
            if (!record) return res.json({ success: false, message: "OTP invalid" });
            if (new Date() > record.expires_at) return res.json({ success: false, message: "OTP expired" });

            if (record.otp != otp) {
                otpModel.incrementAttempts(record.id, () => {
                    res.json({ success: false, message: "Invalid OTP" });
                });
                return;
            }

            userModel.updatePassword(email, newPassword, () => {
                otpModel.markOtpUsed(record.id, () => {
                    res.json({ success: true, message: "Password updated successfully" });
                });
            });
        });
    });
};
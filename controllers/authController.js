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


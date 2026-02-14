//2 - 24
// const db = require("../config/db");

// // Store OTP

// exports.storeOtp = (userId, otp, expiresAt, purpose, callback) => {
//   const sql = `
//     INSERT INTO otps (user_id, otp, expires_at, purpose)
//     VALUES (?, ?, ?, ?)
//   `;
//   db.query(sql, [userId, otp, expiresAt, purpose], callback);
// };

// exports.findLatestOtpByUser = (userId, purpose, callback) => {
//   const sql = `
//     SELECT * FROM otps
//     WHERE user_id = ? AND purpose = ? AND is_used = FALSE
//     ORDER BY created_at DESC
//     LIMIT 1
//   `;
//   db.query(sql, [userId, purpose], (err, res) => {
//     callback(err, res[0]);
//   });
// };





// exports.storeOtp = (userId, otp, expiresAt, callback) => {
//   const sql = `
//     INSERT INTO otps (user_id, otp, expires_at)
//     VALUES (?, ?, ?)
//   `;
//   db.query(sql, [userId, otp, expiresAt], callback);
// };

// // Get latest unused OTP
// exports.findLatestOtpByUser = (userId, callback) => {
//   const sql = `
//     SELECT * FROM otps
//     WHERE user_id = ? AND is_used = FALSE
//     ORDER BY created_at DESC
//     LIMIT 1
//   `;
//   db.query(sql, [userId], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results[0]);
//   });
// };

// Increase wrong attempt count
//53 - 71
// exports.incrementAttempts = (id, callback) => {
//   const sql = `
//     UPDATE otps SET attempts = attempts + 1 WHERE id = ?
//   `;
//   db.query(sql, [id], callback);
// };

// // Mark OTP as used
// exports.markOtpUsed = (id, callback) => {
//   const sql = `
//     UPDATE otps SET is_used = TRUE WHERE id = ?
//   `;
//   db.query(sql, [id], callback);
// };

// exports.deleteOtp = (id, callback) => {
//   const sql = "DELETE FROM otps WHERE id = ?";
//   db.query(sql, [id], callback);
// };

// Check OTP rate limit (max 3 in 10 minutes)
// exports.countRecentOtps = (userId, callback) => {
//   const sql = `
//     SELECT COUNT(*) as count
//     FROM otps
//     WHERE user_id = ?
//     AND created_at >= NOW() - INTERVAL 10 MINUTE
//   `;
//   db.query(sql, [userId], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results[0].count);
//   });
// };

//87 - 110
// exports.countRecentOtps = (userId, typeOrCallback, maybeCallback) => {
//   let type = null;
//   let callback;

//   if (typeof typeOrCallback === "function") {
//     callback = typeOrCallback;
//   } else {
//     type = typeOrCallback;
//     callback = maybeCallback;
//   }

//   let sql = `SELECT COUNT(*) as count FROM otps WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)`;
//   let params = [userId];

//   if (type) {
//     sql += ` AND type = ?`;
//     params.push(type);
//   }

//   db.query(sql, params, (err, results) => {
//     if (err) return callback(err);
//     callback(null, results[0].count);
//   });
// };





// const db = require("../config/db");

// // ---------------- STORE OTP ----------------
// exports.storeOtp = (userId, otp, expiresAt, callback) => {
//   const sql = `
//     INSERT INTO otps (user_id, otp, expires_at)
//     VALUES (?, ?, ?)
//   `;
//   db.query(sql, [userId, otp, expiresAt], callback);
// };

// // ---------------- FIND OTP ----------------
// exports.findOtpByUserId = (userId, callback) => {
//   const sql = `
//     SELECT * FROM otps
//     WHERE user_id = ? AND is_used = FALSE
//     ORDER BY created_at DESC
//     LIMIT 1
//   `;
//   db.query(sql, [userId], callback);
// };

// // ---------------- MARK OTP USED ----------------
// exports.markOtpUsed = (id, callback) => {
//   const sql = `
//     UPDATE otps SET is_used = TRUE WHERE id = ?
//   `;
//   db.query(sql, [id], callback);
// };

const db = require("../config/db");

exports.storeOtp = (userId, otp, expiresAt, purpose, callback) => {
    const sql = "INSERT INTO otps (user_id, otp, expires_at, purpose) VALUES (?, ?, ?, ?)";
    db.query(sql, [userId, otp, expiresAt, purpose], callback);
};

exports.findLatestOtpByUser = (userId, purpose, callback) => {
    const sql = "SELECT * FROM otps WHERE user_id = ? AND purpose = ? AND is_used = FALSE ORDER BY created_at DESC LIMIT 1";
    db.query(sql, [userId, purpose], (err, res) => {
        callback(err, res ? res[0] : null);
    });
};

exports.incrementAttempts = (id, callback) => {
    const sql = "UPDATE otps SET attempts = attempts + 1 WHERE id = ?";
    db.query(sql, [id], callback);
};

exports.markOtpUsed = (id, callback) => {
    const sql = "UPDATE otps SET is_used = TRUE WHERE id = ?";
    db.query(sql, [id], callback);
};

exports.countRecentOtps = (userId, purpose, callback) => {
    let sql = "SELECT COUNT(*) as count FROM otps WHERE user_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)";
    let params = [userId];

    if (purpose && typeof purpose !== 'function') {
        sql += " AND purpose = ?";
        params.push(purpose);
    }

    const actualCallback = typeof purpose === 'function' ? purpose : callback;

    db.query(sql, params, (err, results) => {
        if (err) return actualCallback(err);
        actualCallback(null, results[0].count);
    });
};
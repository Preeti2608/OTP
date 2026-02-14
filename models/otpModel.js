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

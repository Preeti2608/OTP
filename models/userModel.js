const db = require("../config/db");

exports.createUser = (email, password, callback) => {
    //const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    const sql = "INSERT INTO users (email, password, role) VALUES (?, ?, 'USER')";
    db.query(sql, [email, password], (err, result) => {
        if (err) return callback(err);
        callback(null, result);
    });
};

exports.findUserByEmail = (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]);
    });
};

exports.verifyUser = (email, callback) => {
    const sql = "UPDATE users SET is_verified = true WHERE email = ?";
    db.query(sql, [email], callback);
};

exports.updatePassword = (email, newPassword, callback) => {
    const sql = "UPDATE users SET password = ? WHERE email = ?";
    db.query(sql, [newPassword, email], callback);
};

// const db = require("../config/db");

// // Create a new user
// exports.createUser = (email, password, callback) => {
//   const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
//   db.query(sql, [email, password], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };

// // Find user by email
// exports.findUserByEmail = (email, callback) => {
//   const sql = "SELECT * FROM users WHERE email = ?";
//   db.query(sql, [email], (err, results) => {
//     if (err) return callback(err);
//     callback(null, results[0]);
//   });
// };

// // Verify user (after OTP)
// exports.verifyUser = (email, callback) => {
//   const sql = "UPDATE users SET is_verified = true WHERE email = ?";
//   db.query(sql, [email], (err, result) => {
//     if (err) return callback(err);
//     callback(null, result);
//   });
// };

// exports.updatePassword = (email, newPassword, callback) => {
//   const sql = "UPDATE users SET password = ? WHERE email = ?";
//   db.query(sql, [newPassword, email], (err, result) => {
//     if (err) {
//       console.error("Error updating password:", err);
//       return callback(err);
//     }
//     callback(null, result);
//   });
// };

//2nd version with in-memory storage
// const users = [];

// /*
//   User structure:
//   {
//     id,
//     email,
//     password,
//     isVerified,
//     createdAt
//   }
// */

// function createUser(email, password) {
//   const user = {
//     id: Date.now(),
//     email: email,
//     password: password,
//     isVerified: false,
//     createdAt: new Date()
//   };

//   users.push(user);
//   return user;
// }

// function findUserByEmail(email) {
//   return users.find(user => user.email === email);
// }

// function verifyUser(email) {
//   const user = findUserByEmail(email);
//   if (user) {
//     user.isVerified = true;
//   }
//   return user;
// }

// module.exports = {
//   createUser,
//   findUserByEmail,
//   verifyUser
// };

//1st version with in-memory storage
// // Temporary in-memory user storage
// const users = [];

// /*
// User structure:
// {
//   id: number,
//   email: string,
//   password: string,   // later hashed
//   isVerified: boolean
// }
// */

// function createUser(email, password) {
//   const user = {
//     id: users.length + 1,
//     email,
//     password,
//     isVerified: false
//   };

//   users.push(user);
//   return user;
// }

// function findUserByEmail(email) {
//   return users.find(user => user.email === email);
// }

// function verifyUser(email) {
//   const user = findUserByEmail(email);
//   if (user) {
//     user.isVerified = true;
//   }
//   return user;
// }

// module.exports = {
//   createUser,
//   findUserByEmail,
//   verifyUser
// };

const jwt = require("jsonwebtoken");

module.exports = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role // Added role to the token payload
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m"
    }
  );
};

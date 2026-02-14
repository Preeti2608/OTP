const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user attached
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

// Role-based authorization middleware
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden" });
    }
    next();
  };
};

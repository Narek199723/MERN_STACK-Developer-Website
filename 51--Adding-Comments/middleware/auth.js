const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // ! Getting token from header
  // *x-auth-token is the key that we want to send
  const token = req.header("x-auth-token");
  // !   Checking if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  // ! Verifying token if there is at least one
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

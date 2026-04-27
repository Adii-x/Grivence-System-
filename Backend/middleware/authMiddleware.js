const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = async (req, res, next) => {
  const h = req.headers.authorization;
  if (!h || !h.startsWith("Bearer "))
    return res.status(401).json({ message: "Not authorized, token missing" });
  try {
    const token = h.split(" ")[1];
    const d = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(d.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User no longer exists" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
module.exports = { protect };

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }

  if (
    !payload ||
    typeof payload !== "object" ||
    typeof payload.userId !== "string" ||
    typeof payload.role !== "string" ||
    !mongoose.Types.ObjectId.isValid(payload.userId)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }

  const user = await User.findById(payload.userId).select("-passwordHash");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }

  req.user = user;
  return next();
};

module.exports = authenticateUser;
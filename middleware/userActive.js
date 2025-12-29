const isActiveUser = (req, res, next) => {
  try {
    if (!req.user || req.user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Admin has blocked your account",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User status check failed",
    });
  }
};

module.exports = isActiveUser;

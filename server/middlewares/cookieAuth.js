const jwt = require("jsonwebtoken");

const cookieAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ error: "token not present" });
    }
    const decoded= await jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded.userId;
    console.log("token",decoded.userId);
    next();
  } catch (e) {
    console.error("JWT Verification Error:", e);
    return res.status(401).json({ error: e.message });
  }
};

module.exports = cookieAuth;

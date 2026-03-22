const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" });

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });
    const user = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password" });
    res.json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (err) { next(err); }
}

async function getMe(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, plan: req.user.plan } });
}

module.exports = { register, login, getMe };

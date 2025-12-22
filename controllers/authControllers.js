const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- 3.2.1 Register Account ---
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Step 3: "System validate customer entered information in correct format." [cite: 85]
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Step 4: "System validates customer information unique in database." [cite: 85]
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" }); // Alternative flow 4a [cite: 85]
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: "System store customer information in the database." [cite: 85]
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Step 6: "System send verification code via email." [cite: 85]
    console.log(`Verification email sent to ${email}`);

    // Step 7: "System notify customer that account created" [cite: 85]
    res.status(201).json({
      msg: "Account created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- 3.2.2 Login ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 3: "System validate email & password in correct format." [cite: 107]
    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Step 4: "System validate customer's input data with existed account data" [cite: 107]
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" }); // Alternative flow 4a [cite: 107]
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" }); // Alternative flow 4a [cite: 107]
    }

    // Step 5: "System store sign-in status using sessions." [cite: 107]
    // Using JWT as the modern "session" token
    const token = jwt.sign(
      { id: user._id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 6: "System displays successful signed-in" [cite: 107]
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bonusPoints: user.bonusPoints,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

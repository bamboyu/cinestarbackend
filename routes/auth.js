const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const Administrator = require("../models/Administrator"); // Import Admin Model

// ==========================================
// 1. CUSTOMER AUTHENTICATION
// ==========================================

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  const { fullName, email, password, phoneNumber, address } = req.body;
  try {
    let user = await Customer.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new Customer({ fullName, email, password, phoneNumber, address });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.json({ msg: "Customer registered", userId: user._id });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Customer.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    // --- ĐÃ SỬA: LOGIC CẤP QUYỀN ADMIN ---
    // Nếu email là của bạn thì set role = "admin", người khác là "customer"
    const userRole = (user.email === "tranquocdai06@gmail.com") ? "admin" : "customer";

    res.json({
      msg: "Login successful",
      role: userRole,            // <--- Sử dụng biến này thay vì hardcode "customer"
      userId: user._id,
      name: user.fullName,
      email: user.email,         
      phoneNumber: user.phoneNumber || "", 
      address: user.address || ""          
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/auth/update/:id
// @desc    Cập nhật thông tin cá nhân Customer
router.put("/update/:id", async (req, res) => {
  const { fullName, phoneNumber, address } = req.body;

  try {
    // Tìm user theo ID và cập nhật thông tin mới
    const updatedUser = await Customer.findByIdAndUpdate(
      req.params.id,
      { fullName, phoneNumber, address },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // --- ĐÃ SỬA: Đảm bảo khi cập nhật xong vẫn giữ role đúng ---
    const userRole = (updatedUser.email === "tranquocdai06@gmail.com") ? "admin" : "customer";

    res.json({
      msg: "Cập nhật thành công!",
      user: {
        userId: updatedUser._id,
        name: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber || "",
        address: updatedUser.address || "",
        role: userRole // <--- Trả về role đúng sau khi update
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// ==========================================
// 2. ADMINISTRATOR AUTHENTICATION
// ==========================================
// (Phần dưới này giữ nguyên cho Admin hệ thống thật)

// @route   POST /api/auth/admin/login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Administrator.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Access Denied: Not an Admin" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Admin Credentials" });
    }

    res.json({
      msg: "Admin Login Successful",
      role: "admin",
      adminId: admin._id,
      name: admin.name,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST /api/auth/admin/seed
router.post("/admin/seed", async (req, res) => {
  try {
    const email = "admin@cinema.com";
    const password = "admin123"; 

    let admin = await Administrator.findOne({ email });
    if (admin)
      return res.status(400).json({ msg: "Test admin already exists" });

    admin = new Administrator({
      name: "Super Admin",
      email: email,
      password: password,
      role: "SuperAdmin",
    });

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();
    res.json({
      msg: `Test Admin Created! Email: ${email}, Password: ${password}`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

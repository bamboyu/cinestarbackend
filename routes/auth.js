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

    // --- ĐÃ SỬA: Trả về đầy đủ thông tin để hiển thị ở Frontend ---
    res.json({
      msg: "Login successful",
      role: "customer",
      userId: user._id,
      name: user.fullName,
      email: user.email,                 // Thêm email
      phoneNumber: user.phoneNumber || "", // Thêm sđt (nếu null thì trả về chuỗi rỗng)
      address: user.address || ""          // Thêm địa chỉ
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/auth/update/:id
// @desc    Cập nhật thông tin cá nhân Customer
// --- ĐÃ THÊM MỚI ĐOẠN NÀY ---
router.put("/update/:id", async (req, res) => {
  const { fullName, phoneNumber, address } = req.body;

  try {
    // Tìm user theo ID và cập nhật thông tin mới
    // { new: true } để trả về dữ liệu sau khi đã sửa
    const updatedUser = await Customer.findByIdAndUpdate(
      req.params.id,
      { fullName, phoneNumber, address },
      { new: true }
    ).select("-password"); // Không trả về mật khẩu

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Trả về dữ liệu user mới nhất cho Frontend
    res.json({
      msg: "Cập nhật thành công!",
      user: {
        userId: updatedUser._id,
        name: updatedUser.fullName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber || "",
        address: updatedUser.address || "",
        role: "customer"
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

// @route   POST /api/auth/admin/login
// @desc    Separate Login for Admins
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if Admin exists in the ADMINISTRATOR collection
    const admin = await Administrator.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Access Denied: Not an Admin" });
    }

    // 2. Validate Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Admin Credentials" });
    }

    // 3. Return Admin Data
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
// @desc    Run this ONCE to create your test admin
router.post("/admin/seed", async (req, res) => {
  try {
    const email = "admin@cinema.com";
    const password = "admin123"; // The password you want to use

    // Check if seed already exists
    let admin = await Administrator.findOne({ email });
    if (admin)
      return res.status(400).json({ msg: "Test admin already exists" });

    admin = new Administrator({
      name: "Super Admin",
      email: email,
      password: password,
      role: "SuperAdmin",
    });

    // Hash password
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

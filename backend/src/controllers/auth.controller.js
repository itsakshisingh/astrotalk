const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AstrologerProfile = require("../models/astrologerProfile.model");

// Register Controller (Handles 'user', 'astrologer', 'super_admin')
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      mobileNumber, // Frontend might send mobileNumber or mobile
      gender,
      password,
      confirmPassword,
      role = "user", // Default to 'user'
    } = req.body;

    const userMobile = (mobile || mobileNumber || "").toString().trim();
    const userGender = (gender || "").toString().toLowerCase();

    // Required fields check
    if (
      !fullName ||
      !email ||
      !userMobile ||
      !userGender ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // Validate Role
    const allowedRoles = ["super_admin", "astrologer", "user"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Indian mobile validation (10 digits)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(userMobile)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10 digit mobile number",
      });
    }

    // Gender validation
    if (!["male", "female", "other"].includes(userGender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender. Must be Male, Female, or Other",
      });
    }

    // Check existing email
    const existingEmail = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Check existing mobile
    const existingMobile = await User.findOne({
      mobile: userMobile,
    });
    if (existingMobile) {
      return res.status(409).json({
        success: false,
        message: "Mobile number is already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Status logic: Astrologer requires approval ('pending'), others active by default
    const status = role === "astrologer" ? "pending" : "active";

    // Create user in DB
    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      mobile: userMobile,
      gender: userGender,
      password: hashedPassword,
      role,
      status,
    });

    // If role is astrologer, auto-create AstrologerProfile
    let astrologerProfile = null;
    if (role === "astrologer") {
      astrologerProfile = await AstrologerProfile.create({
        userId: user._id,
        displayName: user.fullName,
        verificationStatus: "pending",
      });
    }

    return res.status(201).json({
      success: true,
      message:
        role === "astrologer"
          ? "Astrologer registration successful. Your account is pending super admin approval."
          : `${role.replace("_", " ").toUpperCase()} registration successful!`,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
      error: error.message,
    });
  }
};

// Login Controller
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Mobile and password are required",
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Search by Email OR Mobile
    const user = await User.findOne({
      $or: [{ email: cleanIdentifier }, { mobile: cleanIdentifier }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password",
      });
    }

    // Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password",
      });
    }

    // Check account status
    if (user.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval by super admin.",
      });
    }

    if (user.status === "blocked" || user.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: `Your account is ${user.status}. Please contact support.`,
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  registerAstrologer: registerUser, // Alias for backward compatibility
  loginUser,
};
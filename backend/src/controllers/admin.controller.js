const User = require("../models/user.model");
const AstrologerProfile = require("../models/astrologerProfile.model");

// Get all pending astrologer accounts requiring approval
const getPendingAstrologers = async (req, res) => {
  try {
    const pendingAstrologers = await User.find({
      role: "astrologer",
      status: "pending",
    }).select("-password");

    return res.status(200).json({
      success: true,
      count: pendingAstrologers.length,
      data: pendingAstrologers,
    });
  } catch (error) {
    console.error("Get Pending Astrologers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending astrologers",
      error: error.message,
    });
  }
};

// Get all astrologers (filterable by status: pending, active, rejected, blocked)
const getAllAstrologers = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { role: "astrologer" };
    if (status) {
      query.status = status;
    }

    const astrologers = await User.find(query).select("-password");

    return res.status(200).json({
      success: true,
      count: astrologers.length,
      data: astrologers,
    });
  } catch (error) {
    console.error("Get All Astrologers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch astrologers",
      error: error.message,
    });
  }
};

// Approve, Reject, or Block an Astrologer
const updateAstrologerStatus = async (req, res) => {
  try {
    const { id } = req.params; // Astrologer User ID
    const { status } = req.body || {}; // Allowed: 'active', 'rejected', 'blocked', 'pending'

    const allowedStatuses = ["active", "rejected", "blocked", "pending"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid status in JSON body. Allowed statuses: ${allowedStatuses.join(", ")}`,
      });
    }

    // Find User
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Astrologer user not found",
      });
    }

    if (user.role !== "astrologer") {
      return res.status(400).json({
        success: false,
        message: "User is not an astrologer",
      });
    }

    // Update User Status
    user.status = status;
    await user.save();

    // Update corresponding AstrologerProfile verificationStatus
    let verificationStatus = "pending";
    if (status === "active") verificationStatus = "verified";
    if (status === "rejected") verificationStatus = "rejected";

    await AstrologerProfile.findOneAndUpdate(
      { userId: user._id },
      { verificationStatus }
    );

    return res.status(200).json({
      success: true,
      message: `Astrologer status updated to '${status}' successfully`,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
        verificationStatus,
      },
    });
  } catch (error) {
    console.error("Update Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update astrologer status",
      error: error.message,
    });
  }
};

// Get Admin Profile
const getAdminProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
      error: error.message,
    });
  }
};

// Update Admin Profile
const updateAdminProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, mobile, gender } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (gender) user.gender = gender;

    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update admin profile",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingAstrologers,
  getAllAstrologers,
  updateAstrologerStatus,
  getAdminProfile,
  updateAdminProfile,
};

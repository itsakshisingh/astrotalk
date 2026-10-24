const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const AstrologerProfile = require("../models/astrologerProfile.model");

// Helper: Given any ID (User._id or AstrologerProfile._id), resolve to User._id + Name
async function resolveAstrologerUserId(id) {
  if (!id || !String(id).match(/^[0-9a-fA-F]{24}$/)) return null;

  // Try 1: Is this directly the astrologer's User._id?
  const user = await User.findById(id);
  if (user) {
    if (user.role === "astrologer") {
      return { userId: user._id, name: user.fullName };
    }
  }

  // Try 2: Is this an AstrologerProfile._id?
  const profile = await AstrologerProfile.findById(id).populate(
    "userId",
    "fullName email role"
  );
  if (profile && profile.userId) {
    return {
      userId: profile.userId._id,
      name: profile.displayName || profile.userId.fullName,
    };
  }

  // Try 3: Is this a userId field on an AstrologerProfile?
  const profileByUserId = await AstrologerProfile.findOne({ userId: id }).populate(
    "userId",
    "fullName email role"
  );
  if (profileByUserId && profileByUserId.userId) {
    return {
      userId: profileByUserId.userId._id,
      name: profileByUserId.displayName || profileByUserId.userId.fullName,
    };
  }

  // Fallback: return as-is if user was found (e.g. non-astrologer edge case)
  if (user) return { userId: user._id, name: user.fullName };

  return null;
}

// 1. Create a new appointment booking
const bookAppointment = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      phoneNumber,
      appointmentDate,
      appointmentTime,
      service,
      astrologer, // Can be Astrologer Profile _id, User _id, or Name string from frontend
      astrologerId,
      userId,
      message,
    } = req.body;

    const userPhone = (phone || phoneNumber || "").toString().trim();

    if (
      !fullName ||
      !email ||
      !userPhone ||
      !appointmentDate ||
      !appointmentTime ||
      !service
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields",
      });
    }

    // Resolve correct astrologer User ID from whatever ID was passed
    let finalAstrologerId = null;
    let finalAstrologerName = "Any Available Expert Astrologer";

    // Try 'astrologer' field first (priority - usually AstrologerProfile._id from website)
    const primaryId = astrologer && String(astrologer).match(/^[0-9a-fA-F]{24}$/)
      ? astrologer
      : null;

    // Try 'astrologerId' field as fallback
    const secondaryId = astrologerId && String(astrologerId).match(/^[0-9a-fA-F]{24}$/)
      ? astrologerId
      : null;

    const idToResolve = primaryId || secondaryId;

    if (idToResolve) {
      const resolved = await resolveAstrologerUserId(idToResolve);
      if (resolved) {
        finalAstrologerId = resolved.userId;
        finalAstrologerName = resolved.name;
      }
    }

    // If astrologer is a plain name string (not an ObjectId), use it as name
    if (
      !finalAstrologerName ||
      finalAstrologerName === "Any Available Expert Astrologer"
    ) {
      if (
        astrologer &&
        typeof astrologer === "string" &&
        !astrologer.match(/^[0-9a-fA-F]{24}$/)
      ) {
        finalAstrologerName = astrologer;
      }
    }

    const appointment = await Appointment.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: userPhone,
      appointmentDate,
      appointmentTime,
      service,
      astrologerId: finalAstrologerId,
      astrologerName: finalAstrologerName,
      userId: userId || null,
      message: message ? message.trim() : "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      data: appointment,
    });
  } catch (error) {
    console.error("Book Appointment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

// 2. Get all appointments (Admin / Super Admin)
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("astrologerId", "fullName email mobile profileImage")
      .populate("userId", "fullName email mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get Appointments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// 3. Get appointments for a specific Astrologer (by their User _id)
const getAppointmentsByAstrologer = async (req, res) => {
  try {
    const { astrologerId } = req.params;

    const appointments = await Appointment.find({ astrologerId })
      .populate("userId", "fullName email mobile")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get Astrologer Appointments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch astrologer appointments",
      error: error.message,
    });
  }
};

// 4. Update Appointment Status (pending -> confirmed / completed / cancelled)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${allowedStatuses.join(", ")}`,
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to '${status}' successfully`,
      data: appointment,
    });
  } catch (error) {
    console.error("Update Appointment Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

// 5. Get appointments booked by a specific User (for user profile page)
const getAppointmentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await Appointment.find({
      $or: [{ userId }, { email: req.query.email || "" }]
    })
      .populate("astrologerId", "fullName email profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error("Get User Appointments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user appointments",
      error: error.message,
    });
  }
};


module.exports = {
  bookAppointment,
  getAllAppointments,
  getAppointmentsByAstrologer,
  getAppointmentsByUser,
  updateAppointmentStatus,
};

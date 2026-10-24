const AstrologerProfile = require("../models/astrologerProfile.model");
const User = require("../models/user.model");

// 1. Get Astrologer Profile by User ID
const getAstrologerProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    let profile = null;
    if (userId && userId.match(/^[0-9a-fA-F]{24}$/)) {
      profile = await AstrologerProfile.findOne({
        $or: [{ userId }, { _id: userId }],
      }).populate(
        "userId",
        "fullName email mobile gender role status profileImage"
      );
    }

    if (!profile) {
      // Check if User exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (user.role !== "astrologer") {
        return res.status(400).json({
          success: false,
          message: "User is not an astrologer",
        });
      }

      // Auto-create default AstrologerProfile if it didn't exist before
      profile = await AstrologerProfile.create({
        userId: user._id,
        displayName: user.fullName,
        verificationStatus: user.status === "active" ? "verified" : "pending",
      });

      profile = await AstrologerProfile.findById(profile._id).populate(
        "userId",
        "fullName email mobile gender role status profileImage"
      );
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch astrologer profile",
      error: error.message,
    });
  }
};

// 2. Complete / Update Astrologer Profile
const updateAstrologerProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      displayName,
      professionalTitle,
      bio,
      profileImage,
      coverImage,
      experience,
      experienceUnit,
      specialization,
      skills,
      expertise,
      services,
      consultationFee,
      consultationUnit,
      freeConsultation,
      consultationModes,
      languages,
      education,
      certifications,
      location,
      availability,
      schedule,
      website,
      socialLinks,
      isAcceptingAppointments,
    } = req.body;

    // Check if Astrologer Profile exists
    let profile = await AstrologerProfile.findOne({ userId });

    if (!profile) {
      // If profile does not exist yet, check if User exists and is an astrologer
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      profile = new AstrologerProfile({
        userId,
        displayName: displayName || user.fullName,
      });
    }

    // Update Profile Fields dynamically if provided
    if (displayName !== undefined) profile.displayName = displayName;
    if (professionalTitle !== undefined) profile.professionalTitle = professionalTitle;
    if (bio !== undefined) profile.bio = bio;
    if (profileImage !== undefined) profile.profileImage = profileImage;
    if (coverImage !== undefined) profile.coverImage = coverImage;
    if (experience !== undefined) profile.experience = experience;
    if (experienceUnit !== undefined) profile.experienceUnit = experienceUnit;
    if (specialization !== undefined) profile.specialization = specialization;
    if (skills !== undefined) profile.skills = skills;
    if (expertise !== undefined) profile.expertise = expertise;
    if (services !== undefined) profile.services = services;
    if (consultationFee !== undefined) profile.consultationFee = consultationFee;
    if (consultationUnit !== undefined) profile.consultationUnit = consultationUnit;
    if (freeConsultation !== undefined) profile.freeConsultation = freeConsultation;
    if (consultationModes !== undefined) profile.consultationModes = consultationModes;
    if (languages !== undefined) profile.languages = languages;
    if (education !== undefined) profile.education = education;
    if (certifications !== undefined) profile.certifications = certifications;
    if (location !== undefined) profile.location = { ...profile.location, ...location };
    if (availability !== undefined) profile.availability = { ...profile.availability, ...availability };
    if (schedule !== undefined) profile.schedule = schedule;
    if (website !== undefined) profile.website = website;
    if (socialLinks !== undefined) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    if (isAcceptingAppointments !== undefined) profile.isAcceptingAppointments = isAcceptingAppointments;

    await profile.save();

    // Also update User profileImage if profileImage was updated
    if (profileImage) {
      await User.findByIdAndUpdate(userId, { profileImage });
    }

    return res.status(200).json({
      success: true,
      message: "Astrologer profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update astrologer profile",
      error: error.message,
    });
  }
};

// 3. Get All Verified & Active Astrologers (For Public / User Website)
const getPublicAstrologers = async (req, res) => {
  try {
    let astrologers = await AstrologerProfile.find({
      isActive: true,
      verificationStatus: "verified",
    }).populate("userId", "fullName email mobile gender profileImage status");

    if (!astrologers || astrologers.length === 0) {
      astrologers = await AstrologerProfile.find().populate(
        "userId",
        "fullName email mobile gender profileImage status"
      );
    }

    return res.status(200).json({
      success: true,
      count: astrologers.length,
      data: astrologers,
    });
  } catch (error) {
    console.error("Get Public Astrologers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch astrologers",
      error: error.message,
    });
  }
};

module.exports = {
  getAstrologerProfile,
  updateAstrologerProfile,
  getPublicAstrologers,
};

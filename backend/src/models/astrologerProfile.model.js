const mongoose = require("mongoose");

const astrologerProfileSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER REFERENCE
    // ==========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    displayName: {
      type: String,
      required: true,
      trim: true,
    },

    professionalTitle: {
      type: String,
      trim: true,
      default: "Vedic Astrologer",
    },

    bio: {
      type: String,
      maxlength: 2000,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      default: null,
    },

    coverImage: {
      type: String,
      default: null,
    },

    // ==========================================
    // PROFESSIONAL INFORMATION
    // ==========================================

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    experienceUnit: {
      type: String,
      enum: ["years", "months"],
      default: "years",
    },

    specialization: [
      {
        type: String,
        trim: true,
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    expertise: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // ASTROLOGY SERVICES
    // ==========================================

    services: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        description: {
          type: String,
          trim: true,
        },

        price: {
          type: Number,
          min: 0,
        },

        duration: {
          type: Number,
          min: 1,
        },

        durationUnit: {
          type: String,
          enum: ["minutes", "hours"],
          default: "minutes",
        },

        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],

    // ==========================================
    // CONSULTATION
    // ==========================================

    consultationFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    consultationUnit: {
      type: String,
      enum: ["minute", "session"],
      default: "minute",
    },

    freeConsultation: {
      enabled: {
        type: Boolean,
        default: false,
      },

      duration: {
        type: Number,
        default: 0,
      },
    },

    consultationModes: [
      {
        type: String,
        enum: ["chat", "call", "video", "in_person"],
      },
    ],

    // ==========================================
    // LANGUAGES
    // ==========================================

    languages: [
      {
        type: String,
        trim: true,
      },
    ],

    // ==========================================
    // EDUCATION & CERTIFICATION
    // ==========================================

    education: [
      {
        degree: {
          type: String,
          trim: true,
        },

        institution: {
          type: String,
          trim: true,
        },

        year: {
          type: Number,
        },
      },
    ],

    certifications: [
      {
        name: {
          type: String,
          trim: true,
        },

        issuingOrganization: {
          type: String,
          trim: true,
        },

        year: {
          type: Number,
        },

        certificateUrl: {
          type: String,
          default: null,
        },
      },
    ],

    // ==========================================
    // LOCATION
    // ==========================================

    location: {
      country: {
        type: String,
        default: "India",
      },

      state: {
        type: String,
      },

      city: {
        type: String,
      },

      address: {
        type: String,
      },

      pincode: {
        type: String,
      },

      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },

      isOnline: {
        type: Boolean,
        default: true,
      },
    },

    // ==========================================
    // AVAILABILITY
    // ==========================================

    availability: {
      isOnline: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: ["online", "offline", "busy", "away"],
        default: "offline",
      },

      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
    },

    // ==========================================
    // WEEKLY SCHEDULE
    // ==========================================

    schedule: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },

        isAvailable: {
          type: Boolean,
          default: true,
        },

        slots: [
          {
            startTime: String,
            endTime: String,
          },
        ],
      },
    ],

    // ==========================================
    // SOCIAL / PROFESSIONAL LINKS
    // ==========================================

    website: {
      type: String,
      default: null,
    },

    socialLinks: {
      instagram: {
        type: String,
        default: null,
      },

      facebook: {
        type: String,
        default: null,
      },

      youtube: {
        type: String,
        default: null,
      },

      linkedin: {
        type: String,
        default: null,
      },
    },

    // ==========================================
    // BOOKS
    // ==========================================

    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],

    // ==========================================
    // RATINGS & REVIEWS
    // ==========================================

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalConsultations: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // VERIFICATION
    // ==========================================

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // PROFILE SETTINGS
    // ==========================================

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isAcceptingAppointments: {
      type: Boolean,
      default: true,
    },

    // ==========================================
    // STATISTICS
    // ==========================================

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalAppointments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AstrologerProfile",
  astrologerProfileSchema
);

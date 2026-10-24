const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      trim: true,
      default: "Standard",
    },

    images: {
      type: [String],
      default: [],
    },

    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    badge: {
      type: String,
      trim: true,
      default: "Verified Vedic Ritual",
    },

    stock: {
      type: Number,
      default: 100,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Reference to creator (Astrologer or Super Admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug and calculate discount percentage before save
productSchema.pre("save", function () {
  if (this.isModified("name") || !this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Math.floor(1000 + Math.random() * 9000);
  }

  if (
    this.originalPrice &&
    this.sellingPrice &&
    this.originalPrice > this.sellingPrice
  ) {
    this.discountPercentage = Math.round(
      ((this.originalPrice - this.sellingPrice) / this.originalPrice) * 100
    );
  } else {
    this.discountPercentage = 0;
  }

  if (!this.sku) {
    this.sku = "JYOT-" + Math.floor(100000 + Math.random() * 900000);
  }
});

module.exports = mongoose.model("Product", productSchema);

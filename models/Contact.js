const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    // Excel / External reference
    externalId: {
      type: Number,
      index: true,
    },

    // Core profile info
    name: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },

    // Contact info
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },

    // Social
    linkedin: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      trim: true,
    },

    // Status flags
    unlocked: {
      type: Boolean,
      default: false,
    },
    unlocked_company: {
      type: Boolean,
      default: false,
    },

    email_check_status: {
      type: String,
      trim: true,
    },
    linkedin_check_status: {
      type: String,
      trim: true,
    },

    // Check dates (use Date, not String)
    email_check_date: {
      type: Date,
    },
    linkedin_check_date: {
      type: Date,
    },

    // Excel audit fields (keep but optional)
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
  },
  {
    timestamps: true, // MongoDB createdAt & updatedAt
  }
);

module.exports = mongoose.model("Contact", ContactSchema);

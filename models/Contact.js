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
      index: true,
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
      index: true,
    },

    // Contact info
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
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

    // Check dates
    email_check_date: {
      type: Date,
    },
    linkedin_check_date: {
      type: Date,
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt automatically
    collection: "contacts", // explicit collection name
  }
);

module.exports = mongoose.model("Contact", ContactSchema);

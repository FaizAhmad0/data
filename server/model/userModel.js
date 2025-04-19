const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    primaryContact: { type: String },

    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "manager", "admin", "supervisor"],
      required: true,
      default: "user",
    },
    amazonManager: {
      type: String,
    },
    websiteManager: {
      type: String,
    },
    etsyManager: {
      type: String,
    },
    uid: { type: Number, unique: true },
    dateAmazon: { type: String },
    dateWebsite: { type: String },
    dateEtsy: { type: String },
    enrollmentIdAmazon: { type: String },
    enrollmentIdWebsite: { type: String },
    enrollmentIdEtsy: { type: String },
    batchAmazon: { type: String },
    batchWebsite: { type: String },
    batchEtsy: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

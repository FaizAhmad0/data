const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    primaryContact: { type: String },

    email: { type: String, required: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "manager", "admin", "supervisor", "accountant"],
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
    enrollmentIdAmazon: { type: String, unique: true },
    enrollmentIdWebsite: { type: String, unique: true },
    enrollmentIdEtsy: { type: String, unique: true },
    batchAmazon: { type: String },
    batchWebsite: { type: String },
    batchEtsy: { type: String },
    enrolledBy: { type: String },
    gstDone: {
      type: Boolean,
      default: false,
    },
    legalityDone: {
      type: Boolean,
      default: false,
    },
    billProvided: {
      type: Boolean,
      default: false,
    },
    gstLink: {
      type: String,
      default: "",
    },
    legalityLink: {
      type: String,
      default: "",
    },
    azdt: {
      type: Boolean,
      default: false,
    },
    azsf: {
      type: Boolean,
      default: false,
    },
    wbdt: {
      type: Boolean,
      default: false,
    },
    wbsf: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

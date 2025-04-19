const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  comment: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
});

const complaintSchema = new Schema(
  {
    caseId: {
      type: Number,
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    enrollment: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userReview: reviewSchema,
    managerReview: reviewSchema,
    ad: String,
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

complaintSchema.plugin(mongooseSequence, { inc_field: "caseId" });

const Complaint = model("Complaint", complaintSchema);
module.exports = Complaint;

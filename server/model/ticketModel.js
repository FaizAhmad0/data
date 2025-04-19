const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence");
const { Schema, model } = mongoose;
const AutoIncrement = mongooseSequence(mongoose);
const commentSchema = new Schema({
  comment: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new Schema(
  {
    ticketId: {
      type: Number,
    },
    enrollmentId: {
      type: String,
      required: true,
    },
    uid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    manager: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
    },
    comments: [commentSchema],
    assignee: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.plugin(AutoIncrement, { inc_field: "ticketId" });

const Ticket = model("Ticket", ticketSchema);

module.exports = Ticket;

const mongoose = require("mongoose");
const s = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
    authorRole: {
      type: String,
      enum: ["student", "staff", "admin"],
      required: true,
    },
    message: { type: String, required: true, minlength: 1, maxlength: 1000 },
  },
  { timestamps: true },
);
s.index({ complaintId: 1 });
module.exports = mongoose.model("Comment", s);

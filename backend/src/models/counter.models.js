import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure one user cannot have duplicate words.
counterSchema.index({ word: 1, userId: 1 }, { unique: true });

export const Counter = mongoose.model("Counter", counterSchema);

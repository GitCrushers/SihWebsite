import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullname: {        // renamed to match auth controllers
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,   // usually emails should be unique
    },
    password: {
      type: String,
      required: true, // fixed typo
    },
    role: {            // optional, for future role-based auth
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

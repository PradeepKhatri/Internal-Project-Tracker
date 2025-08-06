import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["viewer", "admin", "superadmin"],
      default: "viewer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;

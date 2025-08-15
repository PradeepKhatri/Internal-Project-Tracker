import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const CreateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("CreateUser error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.includes("@emaar.ae")) {
      return res.status(400).json({ message: "You need access to Login" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "Access denied. You need access." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const UpdatePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email & password are required!" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const salt = await bcrypt.genSalt(10);
    const updatedPassword = await bcrypt.hash(newPassword, salt);

    user.password = updatedPassword;
    await user.save();

    return res.status(200).json({ message: "Passsword Updated Successfully!" });
  } catch (error) {
    console.log("Error Updating Password: ", error);
    return res.status(400).json({ meesage: "Error Updating Pasword" });
  }
};

const GetUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(200).json({ message: "No users to display" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.log("Error fetching users : ", error);
    res.status(500).json({ message: "Error getting users" });
  }
};

const UpdateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;

    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const validRoles = ["viewer", "admin", "superadmin"];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid Role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(400).json({ message: "User Not Found." });
    }

    res.status(200).json({
      message: "User role updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error Updating Role: ", error);
    res.status(400).json({ message: "Error Updating User Role!" });
  }
};

const GetMyProfile = async (req, res) => {
  res.status(200).json(req.user);
};

const GetUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Error getting user by ID" });
  }
};

const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};

export {
  UserLogin,
  CreateUser,
  UpdatePassword,
  UpdateUserRole,
  GetUsers,
  GetMyProfile,
  GetUserById,
  DeleteUser,
};

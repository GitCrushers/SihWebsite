import { User } from "../models/users.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function signUp(req, res) {
  try {
    const { email, username, fullname, password } = req.body;

    if (!email || !fullname || !password || !username) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      username,
      password: hashedPassword,
    });

    // 🔹 create token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role, fullname: newUser.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: {
        fullname: newUser.fullname,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({
        message: "User not registered",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: foundUser._id, role: foundUser.role, fullname: foundUser.fullname },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("csrftoken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return res.json({
      success: true,
      message: "User signed in",
      token,
      user: {
        fullname: foundUser.fullname,
        email: foundUser.email,
        username: foundUser.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

export async function user(req, res) {
  try {
    const signedInUser = req.user;
    const user = await User.findById(signedInUser.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}

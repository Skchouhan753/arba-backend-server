const express = require("express");
// const { auth } = require("../middlewares/authMiddleware.js");

const bcrypt = require("bcrypt");
const { userModel } = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const SECRET_CODE = process.env.SECRET_CODE;
const userRuter = express.Router();

userRuter.post("/register", async (req, res) => {
  try {
    const { fullName, userName, email, password, avatar } = req.body;
    // validation
    if (!fullName || !userName || !email || !password || !avatar) {
      return res.status(500).json({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    //check exisiting user
    const exisitingUSer = await userModel.findOne({ email });
    //validation
    if (exisitingUSer) {
      return res.status(500).json({
        success: false,
        message: "email already exists",
      });
    } else {
      bcrypt.hash(password, 5, (err, hash) => {
        if (!err) {
          const user = new userModel({
            fullName,
            userName,
            email,
            password: hash,
            avatar,
          });
          user.save();
          res.status(201).json({
            success: true,
            message: "Registeration Success, please login",
            user,
          });
        } else {
          res.status(400).json({ msg: err });
        }
      });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      error,
    });
  }
});

//LOGIN
userRuter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "wrong email or password",
      });
    }
    // check user
    const user = await userModel.findOne({ email });
    //user valdiation
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        const token = jwt.sign(
          { userID: user._id, username: user.username },
          SECRET_CODE,
          { expiresIn: "1h" }
        );

        const updatedUser = await userModel.findOneAndUpdate(
          { email },
          { $set: { token: token } },
          { new: true }
        );
        if (!updatedUser) {
          return res.status(400).json({ msg: "Failed to update token" });
        }
        res
          .status(200)
          .cookie("token", token, {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            // secure: process.env.NODE_ENV === "development" ? true : false,
            // httpOnly: process.env.NODE_ENV === "development" ? true : false,
            // sameSite: process.env.NODE_ENV === "development" ? true : false,
          })
          .json({
            success: true,
            message: "Login Successfully",
            token,
            user,
          });
      } else {
        res.status(400).json({ msg: "wrong password" });
      }
    });
  } catch (error) {
    // console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error In Login Api",
      error,
    });
  }
});

// GET USER PROFILE
const getUserProfileController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Prfolie Fetched Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In PRofile API",
      error,
    });
  }
};

// LOGOUT
userRuter.get("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      // 1. Find the user by token
      const user = await userModel.findOne({ token });

      if (!user) {
        return res.status(404).json({ msg: "You are not registered" });
      }

      // 2. Unset the token field for the user
      await userModel.updateOne({ _id: user._id }, { $unset: { token: 1 } });

      // 3. Send a success message
      return res.status(200).json({ msg: "You have been logged out!" });
    } else {
      // If token is not provided in headers
      return res.status(400).json({ msg: "Token not provided" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// UPDATE USER PROFILE
const updateProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { name, email, address, city, country, phone } = req.body;
    // validation + Update
    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    //save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile API",
      error,
    });
  }
};

// update user passsword
const udpatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    //valdiation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }
    // old pass check
    const isMatch = await user.comparePassword(oldPassword);
    //validaytion
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Invalid Old Password",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update password API",
      error,
    });
  }
};

// FORGOT PASSWORD
const passwordResetController = async (req, res) => {
  try {
    // user get email || newPassword || answer
    const { email, newPassword, answer } = req.body;
    // valdiation
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    // find user
    const user = await userModel.findOne({ email, answer });
    //valdiation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "invalid user or answer",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Your Password Has Been Reset Please Login !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In password reset API",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  getUserProfileController,
  logoutController,
  updateProfileController,
  udpatePasswordController,
  passwordResetController,
};

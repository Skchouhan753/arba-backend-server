const express = require("express");
const { auth } = require("../middlewares/authMiddleware.js");
const {
  getUserProfileController,
  loginController,
  logoutController,
  passwordResetController,
  registerController,
  udpatePasswordController,
  updateProfileController,
} = require("../controllers/userController.js");

const { singleUpload } = require("../middlewares/multer.js");

//router object
const userRuter = express.Router();

//routes
// register
userRuter.post("/register", registerController);

//login
userRuter.post("/login", loginController);

//profile
// userRuter.get("/profile", auth, getUserProfileController);

//logout
userRuter.get("/logout", logoutController);


// updte password
userRuter.patch("/update-password", udpatePasswordController);

// uopdate profile
userRuter.patch("/profile-update", updateProfileController);

// FORGOT PASSWORD
userRuter.patch("/reset-password", passwordResetController);

//export
module.exports = {
  userRuter,
};

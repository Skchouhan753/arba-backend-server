const mongoose = require("mongoose");
const JWT = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      // unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // minLength: [6, "password length should be greadter then 6 character"],
    },
    avatar: {
      type: String,
      required: true,
    },
    token: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

//functuions
// hash func
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
// });

// compare function
// userSchema.methods.comparePassword = async function (plainPassword) {
//   return await bcrypt.compare(plainPassword, this.password);
// };

//JWT TOKEN
// userSchema.methods.generateToken = function () {
//   return JWT.sign({ _id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
// };

const userModel = mongoose.model("User", userSchema);
module.exports = {
  userModel,
};

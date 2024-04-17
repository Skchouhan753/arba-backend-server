const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const categoryModel = mongoose.model("Category", categorySchema);
module.exports = {
  categoryModel,
};

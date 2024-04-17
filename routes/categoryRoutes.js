const express = require("express");
const { isAdmin, isAuth } = require("./../middlewares/authMiddleware.js");
const {
  createCategory,
  deleteCategoryController,
  getAllCategoriesController,
  updateCategoryController,
} = require("../controllers/categoryController.js");

const categoryRouter = express.Router();

// CREATE CATEGORY
categoryRouter.post("/create", isAuth, isAdmin, createCategory);

// GET ALL CATEGORY
categoryRouter.get("/get-all", getAllCategoriesController);

// DELETE  CATEGORY
categoryRouter.delete("/delete/:id", isAuth, isAdmin, deleteCategoryController);

// UPDATE ALL CATEGORY
categoryRouter.put("/update/:id", isAuth, isAdmin, updateCategoryController);

// ====================================================================

module.exports = {
  categoryRouter,
};

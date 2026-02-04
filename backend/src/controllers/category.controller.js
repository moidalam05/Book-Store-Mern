import Category from "../models/category.model.js";
import Book from "../models/book.model.js";
import { createCategorySlug } from "../utils/slug.utils.js";

export const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      icon,
      isActive,
      isTrending,
      isFeatured,
      sortOrder,
    } = req.body;

    // create-slug
    const slug = createCategorySlug(name);
    const slugExists = await Category.findOne({ slug });

    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      icon,
      isActive: isActive ?? true,
      isTrending: isTrending ?? false,
      isFeatured: isFeatured ?? false,
      sortOrder: sortOrder ?? 0,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const {
      isActive,
      isFeatured,
      isTrending,
      sortBy = "sortOrder",
      order = "asc",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isFeatured !== undefined) filter.isFeatured = isFeatured === "true";
    if (isTrending !== undefined) filter.isTrending = isTrending === "true";

    const sortOrder = order === "desc" ? -1 : 1;

    const categories = await Category.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Category.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
      },
      data: categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById({
      _id: categoryId,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get category by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name, description, icon, isTrending, isFeatured, sortOrder } =
      req.body;

    const updateData = {};

    if (name && name !== category.name) {
      const newSlug = createCategorySlug(name);

      const slugExists = await Category.findOne({
        slug: newSlug,
        _id: { $ne: categoryId },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }

      updateData.name = name;
      updateData.slug = newSlug;
    }

    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (isTrending !== undefined) updateData.isTrending = isTrending;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const updateCategoryStatus = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category status updated successfully to ${category.isActive ? "active" : "inactive"}`,
    });
  } catch (error) {
    console.error("Update category status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update category status",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // prevent deleting category in use
    const booksCount = await Book.countDocuments({ category: categoryId });
    if (booksCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be deleted because books are assigned to it",
      });
    }

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

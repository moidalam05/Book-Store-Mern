import Cart from "../models/cart.model.js";
import Book from "../models/book.model.js";
import mongoose from "mongoose";
import { recalculateCart } from "../utils/recalculateCart.js";
import { calculateDiscount } from "../utils/coupon.util.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(bookId);

    if (!book || book.status !== true) {
      return res.status(404).json({
        success: false,
        message: "Book not found or inactive",
      });
    }

    if (quantity > book.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    let cart = await Cart.findOne({ user: userId, status: "active" });

    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.book.toString() === bookId
    );

    if (existingItem) {
      existingItem.quantity += quantity;

      if (existingItem.quantity > book.stock) {
        return res.status(400).json({
          success: false,
          message: "Stock limit exceeded",
        });
      }

      existingItem.price.discounted = book.price.discounted;

      existingItem.category = book.category._id || book.category;
      existingItem.authors = book.authors;

      existingItem.subtotal =
        existingItem.quantity * existingItem.price.discounted;
    } else {
      cart.items.push({
        book: bookId,
        title: book.title,

        coverImage: {
          url: book.coverImage.url,
        },

        price: {
          original: book.price.original,
          discounted: book.price.discounted,
        },

        quantity,

        category: book.category._id || book.category,
        authors: book.authors,

        subtotal: book.price.discounted * quantity,
      });
    }

    cart.totalItems = cart.items.length;
    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.appliedCoupon = null;
    recalculateCart(cart);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    }).populate("items.category", "name slug");

    if (
      cart &&
      cart.appliedCoupon &&
      cart.appliedCoupon.lockedUntil &&
      cart.appliedCoupon.lockedUntil <= new Date()
    ) {
      cart.appliedCoupon = null;
      recalculateCart(cart);
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart || { items: [] },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;
    const { quantity } = req.body;

    const delta = Number(quantity);

    if (![1, -1].includes(delta)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity update",
      });
    }

    const cart = await Cart.findOne({ user: userId, status: "active" });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item.book.toString() === bookId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const book = await Book.findById(bookId);

    if (newQuantity > book.stock) {
      return res.status(400).json({
        success: false,
        message: "Stock limit exceeded",
      });
    }

    item.quantity = newQuantity;
    item.subtotal = item.price.discounted * item.quantity;

    cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);

    cart.appliedCoupon = null;
    recalculateCart(cart);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId } = req.params;

    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) => item.book.toString() === bookId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items = cart.items.filter((item) => item.book.toString() !== bookId);

    cart.totalItems = cart.items.length;
    cart.totalQuantity = cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    cart.appliedCoupon = null;
    recalculateCart(cart);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Delete cart item error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete cart item",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({
      user: userId,
      status: "active",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    cart.totalQuantity = 0;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

import { configureStore } from "@reduxjs/toolkit";
import { booksApi } from "./features/books/booksApi.js";
import { ordersApi } from "./features/orders/ordersApi.js";
import { usersApi } from "./features/users/userApi.js";
import { categoryApi } from "./features/category/categoryApi.js";
import { reviewsApi } from "./features/review/reviewApi.js";
import { cartApi } from "./features/cart/cartApi.js";
import { couponsApi } from "./features/coupon/couponApi.js";
import { addressApi } from "./features/address/addressApi.js";
import { authApi } from "./features/auth/authApi.js";
import { dashboardApi } from "./features/dashboard/dashboardApi.js";

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [couponsApi.reducerPath]: couponsApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      usersApi.middleware,
      authApi.middleware,
      categoryApi.middleware,
      reviewsApi.middleware,
      cartApi.middleware,
      couponsApi.middleware,
      addressApi.middleware,
      dashboardApi.middleware,
    ),
});

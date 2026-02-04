import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/home/Home.jsx";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";
import CheckoutPage from "../pages/checkout/CheckoutPage.jsx";
import BookDetail from "../pages/books/BookDetail.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import AdminLogin from "../components/AdminLogin.jsx";
import DashboardLayout from "../pages/dashboard/DashboardLayout.jsx";
import Dashboard from "../pages/dashboard/Dashboard.jsx";
import Profile from "../pages/dashboard/Profile.jsx";
import CreateAdmin from "../pages/dashboard/admin/CreateAdmin.jsx";
import EditProfile from "../pages/dashboard/profile/EditProfile.jsx";
import Order from "../pages/dashboard/order/Order.jsx";
import Books from "../pages/books/Books.jsx";
import CartPage from "../pages/cart/CartPage.jsx";
import Address from "../pages/address/Address.jsx";
import OrderConfirmation from "../pages/order/OrderConfirmation.jsx";
import OrderPage from "../pages/order/OrderPage.jsx";
import OrderDetail from "../pages/order/OrderDetail.jsx";
import AdminOrderDetail from "../pages/dashboard/order/AdminOrderDetail.jsx";
import Category from "../pages/dashboard/category/Category.jsx";
import AddCategory from "../pages/dashboard/category/AddCategory.jsx";
import EditCategory from "../pages/dashboard/category/EditCategory.jsx";
import Coupon from "../pages/dashboard/coupon/Coupon.jsx";
import AddCoupon from "../pages/dashboard/coupon/AddCoupon.jsx";
import ManageBooks from "../pages/dashboard/book/ManageBooks.jsx";
import AddBook from "../pages/dashboard/book/AddBook.jsx";
import EditBook from "../pages/dashboard/book/EditBook.jsx";
import EditCoupon from "../pages/dashboard/coupon/EditCoupon.jsx";
import AllUsers from "../pages/dashboard/profile/AllUsers.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/order-confirmation/:id",
        element: (
          <PrivateRoute>
            <OrderConfirmation />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders/:id",
        element: (
          <PrivateRoute>
            <OrderDetail />
          </PrivateRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/addresses",
        element: (
          <PrivateRoute>
            <Address />
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-profile/:userId",
        element: (
          <PrivateRoute>
            <EditProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/checkout",
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/books/:id",
        element: <BookDetail />,
      },
    ],
  },

  {
    path: "/admin/login",
    element: <AdminLogin />,
  },

  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "",
        element: (
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        ),
      },

      {
        path: "manage-books",
        element: (
          <AdminRoute>
            <ManageBooks />
          </AdminRoute>
        ),
      },
      {
        path: "manage-books/add",
        element: (
          <AdminRoute>
            <AddBook />
          </AdminRoute>
        ),
      },

      {
        path: "manage-books/edit/:id",
        element: (
          <AdminRoute>
            <EditBook />
          </AdminRoute>
        ),
      },

      {
        path: "orders",
        element: (
          <AdminRoute>
            <Order />
          </AdminRoute>
        ),
      },

      {
        path: "orders/:id",
        element: (
          <AdminRoute>
            <AdminOrderDetail />
          </AdminRoute>
        ),
      },
      {
        path: "category",
        element: (
          <AdminRoute>
            <Category />
          </AdminRoute>
        ),
      },
      {
        path: "category/add",
        element: (
          <AdminRoute>
            <AddCategory />
          </AdminRoute>
        ),
      },
      {
        path: "category/edit/:id",
        element: (
          <AdminRoute>
            <EditCategory />
          </AdminRoute>
        ),
      },

      {
        path: "coupon",
        element: (
          <AdminRoute>
            <Coupon />
          </AdminRoute>
        ),
      },
      {
        path: "coupon/add",
        element: (
          <AdminRoute>
            <AddCoupon />
          </AdminRoute>
        ),
      },
      {
        path: "coupon/edit/:id",
        element: (
          <AdminRoute>
            <EditCoupon />
          </AdminRoute>
        ),
      },

      {
        path: "profile",
        element: (
          <AdminRoute>
            <Profile />
          </AdminRoute>
        ),
      },
      {
        path: "edit-profile/:userId",
        element: (
          <AdminRoute>
            <EditProfile />
          </AdminRoute>
        ),
      },
      {
        path: "create-admin",
        element: (
          <AdminRoute>
            <CreateAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;

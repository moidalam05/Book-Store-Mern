# 📚 Book Store – Full Stack MERN Web Application

A modern and user-friendly Book Store web application built with the MERN stack.
It includes secure authentication, admin management, product control, order processing, and a complete shopping experience for users.

---

## 🚀 Features

### 🛒 User Features

- **Browse Books:** Search & filter functionality to find books easily.
- **Book Details:** View detailed information about each book.
- **Shopping Cart:** Add books to cart and proceed to checkout.
- **Order Management:** Place orders and view personal order history.
- **Authentication:** Secure Login & Register using Email/Username.
- **Security:** JWT-based authentication with secure cookies.

### 🛠 Admin Features

- **Admin Dashboard:** Exclusive login portal for administrators.
- **Product Management:** Add, Edit, and Delete books.
- **Order Management:** View and process user orders.
- **Analytics:** Dashboard with monthly sales charts, total books, total sales, and trending books count.

---

## 🧱 Tech Stack

### Frontend

- **React.js**
- **Redux Toolkit + RTK Query**
- **React Hook Form**
- **Tailwind CSS**
- **Axios**
- **Firebase** (Storage/Services)

### Backend

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Bcrypt** (Password hashing)
- **Express-Validator**

### Tools

- **React Hot Toast**
- **Razorpay** (Integration ready)
- **Cloudinary/Local storage** (for images)

---

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd book-store
```

### 2. Backend Setup

Navigate to the backend folder and install dependencies.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following:

```env
PORT=XXXX
MONGO_URI=your_mongodb_connection_string
FRONTEND_URL=your_frontend_url
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
CLOUDINARY_API_NAME=your_cloudinary_api_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Create a `.env` file in the `frontend` directory and add the following:

```env
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

Navigate to the frontend folder and install dependencies.

```bash
cd ../frontend
npm install
```

Start the frontend application:

```bash
npm run dev
```

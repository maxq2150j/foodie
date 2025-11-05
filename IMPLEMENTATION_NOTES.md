# Online Food Delivery System - Implementation Notes

## Overview
This implementation includes all the requested features for the online food delivery system with three roles: User, Restaurant, and Admin.

## Features Implemented

### 1. Admin Dashboard
- **Location**: `/admin-dashboard`
- **Features**:
  - Displays total count of registered users
  - Displays total count of registered restaurants
  - Two tables showing:
    - All registered users with details (ID, Name, Email, Phone, Address, Registration Date)
    - All registered restaurants with details (ID, Name, Email, Phone, Address, Description, Registration Date)

### 2. User Features

#### Home Page
- **Location**: `/`
- **Features**:
  - Displays menus grouped by restaurant
  - Each menu item shows: image, name, description, price, category
  - "Add to Cart" button for each item

#### Cart Page
- **Location**: `/cart`
- **Features**:
  - Table showing all cart items with:
    - Item name, restaurant name, price, quantity controls (+/-), total, remove button
  - Total amount calculation
  - "Proceed to Order" button
  - Order placement modal with delivery address input
  - Order status tracking:
    - Shows order status (pending, confirmed, delivered)
    - After restaurant accepts order, status updates to "confirmed"
    - After 5 seconds, notification appears: "Order has been delivered!"
    - Status updates to "delivered"
  - Feedback form appears after delivery
  - Real-time status polling (every 3 seconds)

### 3. Restaurant Features

#### Restaurant Dashboard
- **Location**: `/restaurant-dashboard`
- **Features**:
  - **Orders Tab**:
    - Table showing all order requests
    - Displays: Order ID, User Name, User Phone, Items, Total Amount, Delivery Address, Status, Order Date
    - "Accept" and "Reject" buttons for pending orders
    - "Mark Delivered" button for confirmed orders
  - **Feedbacks Tab**:
    - Table showing all customer feedbacks
    - Displays: User Name, User Phone, Order ID, Rating (stars), Comment, Date

### 4. Order Flow

1. **User places order**:
   - User adds items to cart
   - User clicks "Proceed to Order"
   - User enters delivery address
   - Order is created with status "pending"

2. **Restaurant receives order**:
   - Order appears in restaurant dashboard
   - Restaurant can accept or reject

3. **Order confirmation**:
   - When restaurant accepts, status changes to "confirmed"
   - User sees status update in cart page

4. **Order delivery**:
   - After 5 seconds, notification appears: "Order has been delivered!"
   - Status changes to "delivered"
   - Feedback form appears for user

5. **Feedback submission**:
   - User submits rating (1-5 stars) and comment
   - Feedback is saved and displayed in restaurant dashboard

## Database Tables

### New Tables Created:
1. **orders**: Stores order information
   - order_id (PK)
   - user_id (FK)
   - restaurant_id (FK)
   - total_amount
   - delivery_address
   - status (pending, confirmed, rejected, delivered)
   - created_at, updated_at

2. **order_items**: Stores individual items in each order
   - order_item_id (PK)
   - order_id (FK)
   - menu_id (FK)
   - quantity
   - price

3. **feedbacks**: Stores customer feedback
   - feedback_id (PK)
   - user_id (FK)
   - restaurant_id (FK)
   - order_id (FK)
   - rating (1-5)
   - comment
   - created_at

## API Endpoints

### Admin Endpoints
- `GET /admin/users/count` - Get total user count
- `GET /admin/restaurants/count` - Get total restaurant count
- `GET /admin/users` - Get all users list
- `GET /admin/restaurants` - Get all restaurants list

### Order Endpoints
- `POST /orders` - Create new order
- `GET /orders/restaurant/:restaurant_id` - Get orders by restaurant
- `GET /orders/user/:user_id` - Get orders by user
- `PUT /orders/:order_id/status` - Update order status
- `GET /orders/:order_id` - Get order details

### Feedback Endpoints
- `POST /feedback` - Create feedback
- `GET /feedback/restaurant/:restaurant_id` - Get feedbacks by restaurant

### Restaurant Endpoints
- `GET /restaurant/:restaurant_id` - Get restaurant details

## Setup Instructions

1. **Database Setup**:
   ```sql
   -- Run the database_setup.sql file to create the necessary tables
   source foodie/database_setup.sql
   ```

2. **Backend Setup**:
   ```bash
   cd foodie/server
   npm install
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd foodie/myfood
   npm install
   npm run dev
   ```

## Login Credentials

- **User**: Login with role "user"
- **Restaurant**: Login with role "restaurant"
- **Admin**: Login with role "admin"

## Navigation

- **User Navigation**: Home, Cart, Logout
- **Restaurant Navigation**: Home, Dashboard, Add Menu, View Menus, Logout
- **Admin Navigation**: Dashboard, Logout

## Important Notes

1. The system uses JWT tokens for authentication
2. Cart data is stored in localStorage
3. Order status updates are polled every 3 seconds
4. After restaurant accepts order, user sees "confirmed" status
5. After 5 seconds, delivery notification appears automatically
6. Feedback form appears after order is delivered
7. All feedbacks are visible in restaurant dashboard

## File Structure

### Backend
- `server/src/controllers/AdminController.js` - Admin operations
- `server/src/controllers/OrderController.js` - Order operations
- `server/src/controllers/FeedbackController.js` - Feedback operations
- `server/src/controllers/LoginController.js` - Updated to return user_id/restaurant_id

### Frontend
- `myfood/src/components/AdminDashboard.jsx` - Admin dashboard
- `myfood/src/components/Cart.jsx` - Cart and order management
- `myfood/src/components/RestaurantDashboard.jsx` - Restaurant dashboard
- `myfood/src/components/FeedbackForm.jsx` - Feedback form
- `myfood/src/components/Home.jsx` - Updated to show menus by restaurant
- `myfood/src/components/Login.jsx` - Updated to handle navigation
- `myfood/src/components/Navigationbar.jsx` - Updated with role-based navigation
- `myfood/src/App.jsx` - Updated routing



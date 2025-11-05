import express from 'express';
import cors from 'cors';
import { connectDb } from './src/configs/DbConfig.js';
import { registerUser, getAllUsers } from './src/controllers/usercontroller.js';
import { addRestaurantMenus, deleteItemById, getAllItems, getItemByRestaurantId, registerRestaurant, searchMenusAndRestaurants, updateItem, getRestaurantById } from './src/controllers/RestaurantController.js';
import { login } from './src/controllers/LoginController.js';
import { getAllUsersCount, getAllRestaurantsCount, getAllUsersList, getAllRestaurantsList } from './src/controllers/AdminController.js';
import { createOrder, getOrdersByRestaurant, getOrdersByUser, updateOrderStatus, getOrderDetails } from './src/controllers/OrderController.js';
import { createFeedback, getFeedbacksByRestaurant } from './src/controllers/FeedbackController.js';
import { addQuery } from './src/controllers/contactUsController.js';

const app = express();
app.use(cors());

app.use(express.json());

// Better JSON parse error handling: return JSON instead of HTML on bad JSON
app.use((err, req, res, next) => {
    if (err && err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'Invalid JSON payload' });
    }
    next(err);
});

app.get("/", (request, response) => {
    response.send({ message: "Welcome to MYFOOD APIs" })
});

// Debugging: log incoming requests
app.use((req, res, next) => {
    if (req.path === '/user' || req.path === '/restaurant' || req.path === '/menus') {
        console.log(`DEBUG ${req.method} ${req.path}`);
        if (req.method === 'POST' && req.path === '/restaurant') {
            console.log('Request body received:', req.body);
        }
    }
    next();
});

app.post("/restaurant", registerRestaurant);
app.get("/restaurant/:restaurant_id", getRestaurantById);
app.post("/login", login);
app.post("/menus", addRestaurantMenus);
app.get("/menus/:restaurant_id", getItemByRestaurantId);
app.get("/menus", getAllItems);
app.put("/menus/:menu_id", updateItem);
app.delete("/menus/:menu_id", deleteItemById);
app.get("/search", searchMenusAndRestaurants);
app.post("/user", registerUser);
app.get("/users", getAllUsers); // debug: list users

// Debug: Check all orders
app.get("/debug/all-orders", async (req, res) => {
    try {
        const { getConnectionObject } = await import('./src/configs/DbConfig.js');
        const connection = getConnectionObject();
        const [rows] = await connection.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug: Check ENUM values for status column
app.get("/debug/status-enum", async (req, res) => {
    try {
        const { getConnectionObject } = await import('./src/configs/DbConfig.js');
        const connection = getConnectionObject();
        const [rows] = await connection.query("SHOW COLUMNS FROM orders LIKE 'status'");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin routes
app.get("/admin/users/count", getAllUsersCount);
app.get("/admin/restaurants/count", getAllRestaurantsCount);
app.get("/admin/users", getAllUsersList);
app.get("/admin/restaurants", getAllRestaurantsList);

// Order routes
app.post("/orders", createOrder);
app.get("/orders/restaurant/:restaurant_id", getOrdersByRestaurant);
app.get("/orders/user/:user_id", getOrdersByUser);
app.put("/orders/:order_id/status", updateOrderStatus);
app.get("/orders/:order_id", getOrderDetails);

// Feedback routes
app.post("/feedback", createFeedback);
app.get("/feedback/restaurant/:restaurant_id", getFeedbacksByRestaurant);

// Contact Us routes
app.post("/contact", addQuery);

// Generic error handler to always return JSON for unexpected errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    connectDb();
});
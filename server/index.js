import express from 'express';
import cors from 'cors';
import { connectDb } from './src/configs/DbConfig.js';
import { registerUser, getAllUsers } from './src/controllers/usercontroller.js';
import { addRestaurantMenus, deleteItemById, getAllItems, getItemByRestaurantId, registerRestaurant, searchMenusAndRestaurants, updateItem } from './src/controllers/RestaurantController.js';
import { login } from './src/controllers/LoginController.js';

const app = express();
app.use(cors());
import cors from "cors";



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

// Debugging: log incoming /user and /restaurant request bodies to help diagnose registration issues
app.use((req, res, next) => {
    if (req.path === '/user' || req.path === '/restaurant') {
        console.log(`DEBUG ${req.method} ${req.path} body:`, req.body);
    }
    next();
});

app.post("/restaurant", registerRestaurant);
app.post("/login", login);
app.post("/menus", addRestaurantMenus);
app.get("/menus", getAllItems);
app.get("/menus/:restaurant_id", getItemByRestaurantId);
app.put("/menus/:menu_id", updateItem);
app.delete("/menus/:menu_id", deleteItemById);
app.get("/search", searchMenusAndRestaurants);
app.post("/user", registerUser);
app.get("/users", getAllUsers); // debug: list users

// Generic error handler to always return JSON for unexpected errors
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(3000, () => {
app.listen(5000, () => {
    connectDb();
});
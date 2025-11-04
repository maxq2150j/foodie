import express from 'express';
import { connectDb } from './src/configs/DbConfig.js';
import { addRestaurantMenus, deleteItemById, getAllItems, getItemByRestaurantId, registerRestaurant, searchMenusAndRestaurants, updateItem } from './src/controllers/RestaurantController.js';

const app = express();
app.use(express.json());

app.get("/", (request, response) => {
    response.send({ message: "Welcome to MYFOOD APIs" })
});

app.post("/restaurant", registerRestaurant);
app.post("/menus", addRestaurantMenus);
app.get("/menus", getAllItems);
app.get("/menus/:restaurant_id", getItemByRestaurantId);
app.put("/menus/:menu_id", updateItem);
app.delete("/menus/:menu_id", deleteItemById);
app.get("/search", searchMenusAndRestaurants);

app.listen(6000, () => {
    connectDb();
});
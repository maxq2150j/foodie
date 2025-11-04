import { getConnectionObject } from "../configs/DbConfig.js";
import { hashSync } from "bcrypt";

export async function registerRestaurant(request, response) {
    try {
        const connection = getConnectionObject();
        const { restaurant_id, name, email, password, phone, address, description } = request.body;
        const encryptedPassword = hashSync(password, 12);
        const qry = `insert into restaurants (restaurant_id, name, email, password, phone, address, description) values(${restaurant_id},'${name}', '${email}', '${encryptedPassword}', '${phone}', '${address}', '${description}')`;
        const [resultSet] = await connection.query(qry);
        if (resultSet.affectedRows === 1) {
            response.send({ message: "Restaurant registered successfully" });
        } else {
            response.send({ message: "restaurant registration failed" });
        }
    } catch (error) {
        console.log(error);
        if (error.errno === 1062) {
            response.status(500).send({ message: "Restaurant with this email or id already exists" });
        } else {
            response.status(500).send({ message: "Something went wrong" });
        }
    }
}

export async function addRestaurantMenus(request, response) {
    try {
        const connection = getConnectionObject();
        const { menu_id, item_name, description, price, image_url, quantity, category, restaurant_id } = request.body;
        const qry = `insert into menus (item_name, description, price, image_url, quantity, category, restaurant_id) values('${item_name}', '${description}', ${price}, '${image_url}', ${quantity}, '${category}', ${restaurant_id})`;
        const [resultSet] = await connection.query(qry);
        if (resultSet.affectedRows === 1) {
            response.send({ message: "Menu added successfully" });
        } else {
            response.send({ message: "Adding menu failed" });
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: "Something went wrong" });
    }
}

export async function getAllItems(request, response) {
    try {
        const connection = getConnectionObject();
        const data = request.body;
        const qry = `select * from menus`;
        const [rows] = await connection.query(qry);
        if (rows.length === 0) {
            response.status(400).send({ message: "Menus not exists" });
        } else {
            response.status(200).send(rows);
        }
    } catch (error) {
        response.status(500).send({ message: "Something went wrong" });
    }
}

export async function getItemByRestaurantId(request, response) {
    try {
        const connection = getConnectionObject();
        const qry = `select * from menus where restaurant_id = ${request.params.restaurant_id}`;
        const [rows] = await connection.query(qry);
        if (rows.length === 0) {
            response.status(404).send({ message: "Item not found" });
        } else {
            response.status(200).send(rows);
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: "Something went wrong" });
    }
}

export async function updateItem(request, response) {
    try {
        const connection = getConnectionObject();
        const { item_name, description, price, image_url, quantity, category } = request.body;
        const qry = `update menus set item_name='${item_name}', description='${description}', price=${price}, image_url='${image_url}', quantity=${quantity}, category='${category}' where menu_id=${request.params.menu_id}`;
        const [resultSet] = await connection.query(qry);
        if (resultSet.affectedRows === 1) {
            response.send({ message: "Menu updated successfully" });
        } else {
            response.send({ message: "Menu update failed" });
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: "Something went wrong" });
    }
}

export async function deleteItemById(request, response) {
    try {
        const connection = getConnectionObject();
        const qry = `delete from menus where menu_id = ${request.params.menu_id}`;
        const [resultSet] = await connection.query(qry);
        if (resultSet.affectedRows === 1) {
            response.status(200).send({ message: "Menu deleted successfully" });
        } else {
            response.status(404).send({ message: "Menu not found" });
        }
    } catch (error) {
        console.log(error);
    }
}

export async function searchMenusAndRestaurants(request, response) {
    try {
        const connection = getConnectionObject();
        const { query } = request.query;

        if (!query) {
            return response.status(400).send({ message: "Please provide a search query" });
        }

        const qry = `
            SELECT 
                m.menu_id,
                m.item_name,
                m.description,
                m.price,
                m.image_url,
                m.quantity,
                m.category,
                r.restaurant_id,
                r.name AS restaurant_name,
                r.address AS restaurant_address
            FROM menus m
            JOIN restaurants r ON m.restaurant_id = r.restaurant_id
            WHERE m.item_name LIKE '%${query}%' OR r.name LIKE '%${query}%'
        `;

        const searchValue = `%${query}%`;
        const [resultSet] = await connection.query(qry, [searchValue, searchValue]);

        if (resultSet.length > 0) {
            response.send({
                message: "Search results found",
                total: resultSet.length,
                data: resultSet
            });
        } else {
            response.send({
                message: "No results found for the given search term"
            });
        }

    } catch (error) {
        console.error("Error during search:", error);
        response.status(500).send({
            message: "Something went wrong during search",
            error: error.message
        });
    }
}
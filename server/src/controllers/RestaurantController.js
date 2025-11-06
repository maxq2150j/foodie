import { getConnectionObject } from "../configs/DbConfig.js";
import { hashSync } from "bcrypt";

export async function registerRestaurant(request, response) {
    try {

        const connection = getConnectionObject();
        if (!connection) {
            console.error('Database connection is null');
            return response.status(500).json({ message: "Database connection not available" });
        }

        const { name, email, password, phone, address, description, restaurant_id } = request.body;

        console.log('Extracted fields:', { name, email, phone, hasPassword: !!password, address, description, restaurant_id });

        if (!name || !email || !password || !phone) {
            console.error('Missing required fields');
            return response.status(400).json({ message: "Name, email, password, and phone are required" });
        }

        const encryptedPassword = hashSync(password, 12);
        console.log('Password encrypted successfully');
        const qry = `INSERT INTO restaurants (name, email, password, phone, address, description) VALUES ('${name}', '${email}', '${encryptedPassword}', '${phone}', '${address}', '${description}')`;
        const params = [
            name,
            email,
            encryptedPassword,
            phone,
            address || '',
            description || ''
        ];

        console.log('Executing query:', qry);
        console.log('With params:', params.map((p, i) => i === 2 ? '[PASSWORD_HIDDEN]' : p));

        const [resultSet] = await connection.query(qry, params);

        console.log('Query result:', resultSet);

        if (resultSet.affectedRows === 1) {
            console.log('Restaurant registered successfully');
            response.status(200).json({ message: "Restaurant registered successfully" });
        } else {
            console.error('Registration failed - no rows affected');
            response.status(500).json({ message: "Restaurant registration failed" });
        }
    } catch (error) {
        console.error('=== ERROR in registerRestaurant ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error errno:', error.errno);
        console.error('Error sqlMessage:', error.sqlMessage);
        console.error('Full error:', error);

        if (error.errno === 1062) {
            response.status(400).json({ message: "Restaurant with this email or id already exists" });
        } else if (error.code === 'ER_NO_SUCH_TABLE') {
            response.status(500).json({ message: "Database table 'restaurants' does not exist. Please create it first." });
        } else {
            response.status(500).json({
                message: "Something went wrong",
                error: error.message,
                code: error.code,
                errno: error.errno
            });
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
        console.log('getAllItems called');
        const connection = getConnectionObject();
        if (!connection) {
            console.error('Database connection is null');
            return response.status(500).json({ message: "Database connection not available" });
        }
        console.log('Executing query: SELECT * FROM menus');
        const qry = `SELECT * FROM menus`;
        const [rows] = await connection.query(qry);
        console.log(`Found ${rows.length} menus`);
        return response.status(200).json(rows);
    } catch (error) {
        console.error('Error in getAllItems:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        if (error.code === 'ER_NO_SUCH_TABLE') {
            return response.status(200).json([]);
        }
        return response.status(500).json({ message: "Something went wrong", error: error.message });
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

        response.status(500).send({ message: "Something went wrong while deleting the menu" });
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
            WHERE m.item_name LIKE ? OR r.name LIKE ?
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

export async function getRestaurantById(request, response) {
    try {
        const connection = getConnectionObject();
        const { restaurant_id } = request.params;
        const qry = `SELECT restaurant_id, name, email, phone, address, description FROM restaurants WHERE restaurant_id = ?`;
        const [rows] = await connection.query(qry, [restaurant_id]);
        if (rows.length === 0) {
            response.status(404).send({ message: "Restaurant not found" });
        } else {
            response.status(200).send(rows[0]);
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: "Something went wrong" });
    }
}
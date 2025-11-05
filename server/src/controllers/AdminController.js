import { getConnectionObject } from "../configs/DbConfig.js";

export async function getAllUsersCount(request, response) {
    try {
        const connection = getConnectionObject();
        const qry = `SELECT COUNT(*) as count FROM users`;
        const [rows] = await connection.query(qry);
        response.status(200).json({ count: rows[0].count });
    } catch (error) {
        console.error('Error in getAllUsersCount:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}

export async function getAllRestaurantsCount(request, response) {
    try {
        const connection = getConnectionObject();
        const qry = `SELECT COUNT(*) as count FROM restaurants`;
        const [rows] = await connection.query(qry);
        response.status(200).json({ count: rows[0].count });
    } catch (error) {
        console.error('Error in getAllRestaurantsCount:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}

export async function getAllUsersList(request, response) {
    try {
        const connection = getConnectionObject();
        const qry = `SELECT user_id, name, email, phone, address, created_at FROM users`;
        const [rows] = await connection.query(qry);
        response.status(200).json(rows);
    } catch (error) {
        console.error('Error in getAllUsersList:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}

export async function getAllRestaurantsList(request, response) {
    try {
        const connection = getConnectionObject();
        const qry = `SELECT restaurant_id, name, email, phone, address, description, created_at FROM restaurants`;
        const [rows] = await connection.query(qry);
        response.status(200).json(rows);
    } catch (error) {
        console.error('Error in getAllRestaurantsList:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}



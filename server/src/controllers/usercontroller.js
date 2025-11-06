import { getConnectionObject } from "../configs/DbConfig.js";
import { hashSync } from "bcrypt";

export async function registerUser(request, response) {
    try {
        const connection = getConnectionObject();
        const { name, email, password, phone, address } = request.body;
        const encryptedPassword = hashSync(password, 12);
        const qry = `insert into users(name, email, password, phone, address) values('${name}', '${email}', '${encryptedPassword}', '${phone}', '${address}')`;
        const [resultSet] = await connection.query(qry, [name, email, encryptedPassword, phone, address]);
        if (resultSet.affectedRows === 1) {
            response.send({ message: "User registered successfully" });
        } else {
            response.send({ message: "User registration failed" });
        }
    } catch (error) {
        console.error('Error in registerUser:', error);
        if (error && error.errno === 1062) {
            response.status(500).send({ message: "User with this email or id already exists" });
        } else {
            response.status(500).send({ message: error?.message || "Something went wrong" });
        }
    }
}

export async function getAllUsers(request, response) {
    try {
        const connection = getConnectionObject();
        const qry = `SELECT user_id, name, email, phone, address FROM users`;
        const [rows] = await connection.query(qry);
        response.status(200).json(rows);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}
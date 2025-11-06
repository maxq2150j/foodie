import { compareSync } from "bcrypt";
import { getConnectionObject } from "../configs/DbConfig.js";
import { ROLES } from "../constants/RoleConstants.js";
import { ADMIN_CREDENTIALS } from "../configs/AdminConfig.js";
import jwt from 'jsonwebtoken';

export async function login(request, response) {
    try {

        const { email, password, role } = request.body;
        const identifier = (email || '').trim();

        if (role === ROLES.ADMIN) {
            console.log('Admin login attempt');
            if ((identifier === ADMIN_CREDENTIALS.email) &&
                password === ADMIN_CREDENTIALS.password) {
                const token = jwt.sign({
                    userId: 'admin',
                    role: ROLES.ADMIN
                }, 'user1234');

                console.log('Admin login successful');
                return response.status(200).send({
                    token,
                    message: 'Admin login successful',
                    userId: 'admin',
                    role: ROLES.ADMIN,
                    name: ADMIN_CREDENTIALS.name
                });
            } else {
                console.log('Admin login failed - invalid credentials');
                return response.status(400).send({ message: "Invalid admin credentials" });
            }
        }


        const connection = getConnectionObject();

        const tableName = (role === ROLES.USER || role === 'users')
            ? 'users'
            : 'restaurants';

        console.log('Table name:', tableName);

        const qry = `SELECT * FROM ${tableName} WHERE phone='${identifier}' OR email='${identifier}'`;
        const [rows] = await connection.query(qry);

        console.log('Found rows:', rows.length);
        if (rows.length > 0) {
            console.log('User data:', { ...rows[0], password: '[HIDDEN]' });
        }

        if (rows.length === 0) {
            response.status(400).send({ message: "Login failed, email doesn't exist" });
        }
        else {
            if (compareSync(password, rows[0].password)) {
                const userId = rows[0].id || rows[0].user_id || rows[0].restaurant_id || null;
                const token = jwt.sign({
                    userId,
                    role: role
                }, 'user1234');
                const responseData = {
                    token,
                    message: 'Login successful',
                    userId: userId,
                    role: role
                };
                if (role === ROLES.RESTAURANT) {
                    responseData.restaurant_id = rows[0].restaurant_id;
                }

                console.log('Login response data:', responseData);
                response.status(200).send(responseData);
            }
            else {
                response.status(400).send({ message: "Login failed, password is invalid" });
            }

        }
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: 'Something went wrong' });
    }
}
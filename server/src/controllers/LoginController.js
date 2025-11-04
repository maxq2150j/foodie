import { compareSync } from "bcrypt";
import { getConnectionObject } from "../configs/DbConfig.js";
import { ROLES } from "../constants/RoleConstants.js";
import jwt from 'jsonwebtoken';

export async function login(request, response) {
    try {
        const connection = getConnectionObject();
        const { phone, email, password, role } = request.body;
        const identifier = (email || phone || '').trim();
        // normalize role so both 'user' and 'users' map to the users table
        const tableName = role === ROLES.ADMIN
            ? 'admin'
            : (role === ROLES.USER || role === 'users')
                ? 'users'
                : 'restaurants';
        // search by phone OR email so login accepts either
        const qry = `SELECT * FROM ${tableName} WHERE phone='${identifier}' OR email='${identifier}'`;
        const [rows] = await connection.query(qry);
        if (rows.length === 0) {
            response.status(400).send({ message: "Login failed, phone doesn't exist" });
        }
        else {
            if(compareSync(password,rows[0].password)){
                const userId = rows[0].id || rows[0].user_id || rows[0].restaurant_id || null;
                const token = jwt.sign({
                    userId,
                    role: role
                }, 'user1234');
                response.status(200).send({token,message:'Login successful'});
            }
            else{
                response.status(400).send({ message: "Login failed, password is invalid" });
            }
        
        }
    } catch (error) {
        console.log(error);
        response.status(500).send({ message: 'Something went wrong' });
    }
}
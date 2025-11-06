import { getConnectionObject } from "../configs/DbConfig.js";

export async function createOrder(request, response) {
    try {
        console.log('=== createOrder called ===');
        console.log('Request body:', JSON.stringify(request.body, null, 2));

        const connection = getConnectionObject();
        const { user_id, restaurant_id, items, total_amount, delivery_address } = request.body;

        console.log('Creating order for restaurant_id:', restaurant_id);

        const orderQry = `INSERT INTO orders (user_id, restaurant_id, total_amount, delivery_address, status) 
                         VALUES (${user_id}, ${restaurant_id}, ${total_amount}, '${delivery_address}', 'pending')`;
        const [orderResult] = await connection.query(orderQry, [user_id, restaurant_id, total_amount, delivery_address]);
        const order_id = orderResult.insertId;

        console.log('Order created with ID:', order_id);

        for (const item of items) {
            const itemQry = `INSERT INTO order_items (order_id, menu_id, quantity, price) 
                             VALUES (${order_id}, ${item.menu_id}, ${item.quantity}, ${item.price})`;
            await connection.query(itemQry, [order_id, item.menu_id, item.quantity, item.price]);
        }

        console.log('Order items inserted successfully');
        response.status(200).json({ message: "Order created successfully", order_id });
    } catch (error) {
        console.error('Error in createOrder:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}

export async function getOrdersByRestaurant(request, response) {
    try {
        const connection = getConnectionObject();
        const { restaurant_id } = request.params;

        console.log('=== getOrdersByRestaurant called ===');
        console.log('Restaurant ID:', restaurant_id);

        const qry = `
            SELECT o.order_id, o.user_id, o.restaurant_id, o.total_amount, o.delivery_address, 
                   o.status, o.created_at, u.name as user_name, u.phone as user_phone,
                   GROUP_CONCAT(
                       CONCAT(m.item_name, ' (x', oi.quantity, ')')
                       SEPARATOR ', '
                   ) as items
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            LEFT JOIN menus m ON oi.menu_id = m.menu_id
            WHERE o.restaurant_id = ?
            GROUP BY o.order_id
            ORDER BY o.created_at DESC
        `;

        const [rows] = await connection.query(qry, [restaurant_id]);
        console.log('Orders found:', rows.length);
        console.log('Orders:', JSON.stringify(rows, null, 2));
        response.status(200).json(rows);
    } catch (error) {
        console.error('Error in getOrdersByRestaurant:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}

export async function getOrdersByUser(request, response) {
    try {
        const connection = getConnectionObject();
        const { user_id } = request.params;

        const qry = `
            SELECT o.order_id, o.user_id, o.restaurant_id, o.total_amount, o.delivery_address, 
                   o.status, o.created_at, r.name as restaurant_name,
                   GROUP_CONCAT(
                       CONCAT(m.item_name, ' (x', oi.quantity, ')')
                       SEPARATOR ', '
                   ) as items
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.restaurant_id
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            LEFT JOIN menus m ON oi.menu_id = m.menu_id
            WHERE o.user_id = ?
            GROUP BY o.order_id
            ORDER BY o.created_at DESC
        `;

        const [rows] = await connection.query(qry, [user_id]);
        response.status(200).json(rows);
    } catch (error) {
        console.error('Error in getOrdersByUser:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}

export async function updateOrderStatus(request, response) {
    try {
        console.log('=== updateOrderStatus called ===');
        console.log('Order ID:', request.params.order_id);
        console.log('New Status:', request.body.status);

        const connection = getConnectionObject();
        const { order_id } = request.params;
        let { status } = request.body;

        status = status.toLowerCase();

        const qry = `UPDATE orders SET status = ? WHERE order_id = ?`;
        console.log('Executing query:', qry);
        console.log('Parameters:', [status, order_id]);

        const [result] = await connection.query(qry, [status, order_id]);

        console.log('Update result:', result);
        console.log('Affected rows:', result.affectedRows);

        if (result.affectedRows === 1) {
            response.status(200).json({ message: "Order status updated successfully" });
        } else {
            response.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error('=== Error in updateOrderStatus ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error errno:', error.errno);
        console.error('Error sqlMessage:', error.sqlMessage);
        console.error('Full error:', error);
        response.status(500).json({
            message: error?.message || 'Something went wrong',
            error: error.sqlMessage || error.message,
            hint: 'Please run fix_order_status.sql to fix database ENUM values'
        });
    }
}

export async function getOrderDetails(request, response) {
    try {
        const connection = getConnectionObject();
        const { order_id } = request.params;

        const qry = `
            SELECT o.*, u.name as user_name, u.phone as user_phone, r.name as restaurant_name,
                   oi.order_item_id, oi.menu_id, oi.quantity, oi.price, m.item_name
            FROM orders o
            JOIN users u ON o.user_id = u.user_id
            JOIN restaurants r ON o.restaurant_id = r.restaurant_id
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            LEFT JOIN menus m ON oi.menu_id = m.menu_id
            WHERE o.order_id = ?
        `;

        const [rows] = await connection.query(qry, [order_id]);
        response.status(200).json(rows);
    } catch (error) {
        console.error('Error in getOrderDetails:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}


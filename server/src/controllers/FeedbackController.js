import { getConnectionObject } from "../configs/DbConfig.js";

export async function createFeedback(request, response) {
    try {
        console.log('=== createFeedback called ===');
        console.log('Request body:', JSON.stringify(request.body, null, 2));
        
        const connection = getConnectionObject();
        const { user_id, restaurant_id, order_id, rating, comment } = request.body;
        
        console.log('Inserting feedback:', { user_id, restaurant_id, order_id, rating, comment });
        
        // Use 'feedback' table (your table name) instead of 'feedbacks'
        const qry = `INSERT INTO feedback (user_id, restaurant_id, order_id, rating, comment) 
                     VALUES (?, ?, ?, ?, ?)`;
        const [result] = await connection.query(qry, [user_id, restaurant_id, order_id, rating, comment]);
        
        console.log('Insert result:', result);
        console.log('Feedback ID:', result.insertId);
        
        if (result.affectedRows === 1) {
            response.status(200).json({ message: "Feedback submitted successfully", feedback_id: result.insertId });
        } else {
            response.status(500).json({ message: "Failed to submit feedback" });
        }
    } catch (error) {
        console.error('=== Error in createFeedback ===');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}

export async function getFeedbacksByRestaurant(request, response) {
    try {
        console.log('=== getFeedbacksByRestaurant called ===');
        const connection = getConnectionObject();
        const { restaurant_id } = request.params;
        
        console.log('Fetching feedbacks for restaurant_id:', restaurant_id);
        
        // Use 'feedback' table (your table name) instead of 'feedbacks'
        const qry = `
            SELECT f.*, u.name as user_name, u.phone as user_phone
            FROM feedback f
            JOIN users u ON f.user_id = u.user_id
            WHERE f.restaurant_id = ?
            ORDER BY f.created_at DESC
        `;
        
        const [rows] = await connection.query(qry, [restaurant_id]);
        
        console.log('Feedbacks found:', rows.length);
        console.log('Feedbacks:', JSON.stringify(rows, null, 2));
        
        response.status(200).json(rows);
    } catch (error) {
        console.error('=== Error in getFeedbacksByRestaurant ===');
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        response.status(500).json({ message: error?.message || 'Something went wrong' });
    }
}


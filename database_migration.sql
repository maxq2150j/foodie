ALTER TABLE menus 
ADD COLUMN restaurant_id INT AFTER menu_id;

ALTER TABLE menus 
ADD CONSTRAINT fk_menu_restaurant 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE;

ALTER TABLE menus 
ADD COLUMN quantity INT DEFAULT 1 AFTER price;

ALTER TABLE orders 
ADD COLUMN restaurant_id INT AFTER user_id,
ADD COLUMN delivery_address TEXT AFTER total_amount,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER order_date,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

ALTER TABLE orders 
ADD CONSTRAINT fk_order_restaurant 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE;

ALTER TABLE order_items 
ADD COLUMN price DECIMAL(10,2) AFTER quantity;

UPDATE order_items oi
JOIN menus m ON oi.menu_id = m.menu_id
SET oi.price = m.price
WHERE oi.price IS NULL AND oi.subtotal IS NOT NULL AND oi.quantity > 0;

UPDATE order_items 
SET price = subtotal / quantity 
WHERE price IS NULL AND subtotal IS NOT NULL AND quantity > 0;

ALTER TABLE feedback 
ADD COLUMN restaurant_id INT AFTER user_id,
ADD COLUMN order_id INT AFTER restaurant_id,
ADD COLUMN comment TEXT AFTER rating;

UPDATE feedback 
SET comment = comments 
WHERE comment IS NULL AND comments IS NOT NULL;

ALTER TABLE feedback 
ADD CONSTRAINT fk_feedback_restaurant 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
ADD CONSTRAINT fk_feedback_order 
FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS contact_us (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_menus_restaurant ON menus(restaurant_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_feedback_restaurant ON feedback(restaurant_id);
CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_menu ON order_items(menu_id);

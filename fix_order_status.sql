-- Fix order status ENUM issue
-- Run this script in your MySQL database to fix the status column

-- STEP 1: First, let's see what the current ENUM values are
-- Run this to check: SHOW COLUMNS FROM orders LIKE 'status';

-- STEP 2: Temporarily change status column to VARCHAR to avoid ENUM restrictions
ALTER TABLE orders MODIFY COLUMN status VARCHAR(20);

-- STEP 3: Update all existing data to lowercase
UPDATE orders SET status = LOWER(status);

-- STEP 4: Convert back to ENUM with correct lowercase values
ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'confirmed', 'rejected', 'delivered') DEFAULT 'pending';

-- STEP 5: Verify the fix
-- Run this to check: SELECT DISTINCT status FROM orders;

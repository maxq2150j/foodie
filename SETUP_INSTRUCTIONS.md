# Database Setup Instructions

## Your Current Database Structure

You have the following tables:
- `users`
- `restaurants`
- `menus`
- `orders`
- `order_items`
- `payments`
- `feedback`
- `admin`

## Step-by-Step Setup

### Step 1: Run the Migration Script

Run the migration script to update your existing tables:

```bash
mysql -u root -p myfood < foodie/database_migration.sql
```

Or in MySQL:
```sql
source foodie/database_migration.sql;
```

### Step 2: Verify the Changes

After running the migration, check that:

1. **menus table** has:
   - `restaurant_id` column
   - `quantity` column

2. **orders table** has:
   - `restaurant_id` column
   - `delivery_address` column
   - `created_at` column

3. **order_items table** has:
   - `price` column

4. **feedback table** has:
   - `restaurant_id` column
   - `order_id` column
   - `comment` column (may be renamed from `comments`)

5. **contact_us table** exists

### Step 3: Update Existing Data (if needed)

If you have existing data, you may need to:

1. **Update menus with restaurant_id**:
   ```sql
   -- Assign restaurant_id to existing menus
   -- You'll need to manually assign based on your data
   UPDATE menus SET restaurant_id = 1 WHERE menu_id IN (...);
   ```

2. **Update orders with restaurant_id**:
   ```sql
   -- Get restaurant_id from order_items -> menus
   UPDATE orders o
   JOIN order_items oi ON o.order_id = oi.order_id
   JOIN menus m ON oi.menu_id = m.menu_id
   SET o.restaurant_id = m.restaurant_id
   WHERE o.restaurant_id IS NULL;
   ```

3. **Update order_items with price**:
   ```sql
   -- Calculate price from subtotal if needed
   UPDATE order_items 
   SET price = subtotal / quantity 
   WHERE price IS NULL AND subtotal IS NOT NULL AND quantity > 0;
   ```

### Step 4: Status Enum Mapping

Your database uses different status values than the application expects:

**Database Status Values:**
- 'Pending'
- 'Preparing'
- 'Out for delivery'
- 'Delivered'
- 'Cancelled'

**Application Status Values:**
- 'pending'
- 'confirmed'
- 'rejected'
- 'delivered'

**The application code has been updated to handle this mapping automatically.**

The mapping is:
- 'Pending' → 'pending'
- 'Preparing' → 'confirmed'
- 'Out for delivery' → 'confirmed'
- 'Delivered' → 'delivered'
- 'Cancelled' → 'rejected'

### Step 5: Test the Application

1. Start your backend server:
   ```bash
   cd foodie/server
   npm start
   ```

2. Start your frontend:
   ```bash
   cd foodie/myfood
   npm run dev
   ```

3. Test the following:
   - Login as user/restaurant/admin
   - Add menus (make sure restaurant_id is set)
   - Place orders
   - View orders in restaurant dashboard
   - Accept/reject orders
   - Submit feedback

## Important Notes

1. **Status Mapping**: The application automatically maps between your database status values and the application's expected values. No changes needed in your database.

2. **Table Names**: 
   - The application uses `feedback` (your table name) not `feedbacks`
   - This has been updated in the controllers

3. **Missing Columns**: If any migration fails because columns already exist, you can skip those ALTER TABLE statements or use `IF NOT EXISTS` (MySQL 8.0+).

4. **Foreign Keys**: Make sure all foreign key relationships are correct. The migration script adds them, but verify they exist.

## Troubleshooting

### Error: Column already exists
- Skip that ALTER TABLE statement or comment it out
- The column is already there, which is fine

### Error: Foreign key constraint fails
- Check that referenced data exists
- Make sure restaurant_id values in menus match actual restaurant IDs
- Make sure user_id values in orders match actual user IDs

### Status not updating correctly
- Check the status mapping functions in `OrderController.js`
- Verify the status values in your database match the expected format

## Next Steps

After setup:
1. Create some test data (restaurants, menus, users)
2. Test the complete order flow
3. Verify feedback functionality
4. Check admin dashboard



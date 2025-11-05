# Status Mapping Guide

## Order Status Mapping

Your database uses these status values:
- 'Pending'
- 'Preparing'
- 'Out for delivery'
- 'Delivered'
- 'Cancelled'

The application expects these status values:
- 'pending'
- 'confirmed'
- 'rejected'
- 'delivered'

## Mapping Strategy

You have two options:

### Option 1: Update Application Code (Recommended)
Update the controllers to map between your database values and application values.

### Option 2: Update Database Enum
Change your database enum to match the application's expected values.

## Recommended Mapping

Database → Application:
- 'Pending' → 'pending'
- 'Preparing' → 'confirmed'
- 'Out for delivery' → 'confirmed'
- 'Delivered' → 'delivered'
- 'Cancelled' → 'rejected'

## Implementation

You'll need to update:
1. `OrderController.js` - Map status values when reading/writing
2. `RestaurantDashboard.jsx` - Display status correctly
3. `Cart.jsx` - Check for correct status values



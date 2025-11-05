import React, { useState, useEffect } from "react";
import { Container, Table, Button, Card, Alert, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/APIConstant.js";
import FeedbackForm from "./FeedbackForm.jsx";

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [orderStatus, setOrderStatus] = useState(null);
    const [notification, setNotification] = useState(null);
    const [latestOrder, setLatestOrder] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        loadCart();
        checkOrderStatus();
        
        // Poll for order status updates every 3 seconds
        const interval = setInterval(() => {
            checkOrderStatus();
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    const loadCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(cart);
    };

    const checkOrderStatus = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem("auth") || "{}");
            if (!auth.user_id) return;

            const response = await fetch(`${BASE_URL}/orders/user/${auth.user_id}`);
            const orders = await response.json();
            
            if (orders.length > 0) {
                const latest = orders[0];
                const previousStatus = orderStatus;
                const normalizedStatus = latest.status?.toLowerCase();
                setLatestOrder(latest);
                setOrderStatus(normalizedStatus);
                
                // Show notification when status changes to confirmed
                if (previousStatus === "pending" && normalizedStatus === "confirmed") {
                    setNotification("🎉 Order confirmed! Your food is being prepared.");
                }
                
                // Show notification when status changes to delivered
                if (previousStatus === "confirmed" && normalizedStatus === "delivered") {
                    setNotification("✅ Order has been delivered! Enjoy your meal!");
                    setShowFeedback(true);
                }
                
                if (normalizedStatus === "delivered" && !showFeedback) {
                    setShowFeedback(true);
                }
                
                // Show notification if order is rejected
                if (previousStatus === "pending" && normalizedStatus === "rejected") {
                    setNotification("❌ Sorry, your order was rejected by the restaurant.");
                }
            }
        } catch (error) {
            console.error("Error checking order status:", error);
        }
    };

    const updateQuantity = (menuId, change) => {
        const updatedCart = cartItems.map((item) => {
            if (item.menu_id === menuId) {
                const newQuantity = item.quantity + change;
                if (newQuantity <= 0) return null;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean);
        
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeItem = (menuId) => {
        const updatedCart = cartItems.filter((item) => item.menu_id !== menuId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleProceedToOrder = () => {
        if (cartItems.length === 0) {
            alert("Cart is empty!");
            return;
        }
        setShowOrderModal(true);
    };

    const handlePlaceOrder = async () => {
        try {
            const auth = JSON.parse(localStorage.getItem("auth") || "{}");
            if (!auth.user_id) {
                alert("Please login first");
                navigate("/login");
                return;
            }

            // Group items by restaurant
            const restaurantGroups = {};
            cartItems.forEach((item) => {
                if (!restaurantGroups[item.restaurant_id]) {
                    restaurantGroups[item.restaurant_id] = [];
                }
                restaurantGroups[item.restaurant_id].push(item);
            });

            // Create orders for each restaurant
            for (const [restaurantId, items] of Object.entries(restaurantGroups)) {
                const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                
                const orderData = {
                    user_id: auth.user_id,
                    restaurant_id: parseInt(restaurantId),
                    items: items.map((item) => ({
                        menu_id: item.menu_id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    total_amount: totalAmount,
                    delivery_address: deliveryAddress || auth.address || "Not specified",
                };

                const response = await fetch(`${BASE_URL}/orders`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderData),
                });

                if (!response.ok) {
                    throw new Error("Failed to place order");
                }
            }

            // Clear cart
            localStorage.removeItem("cart");
            setCartItems([]);
            setShowOrderModal(false);
            alert("Order submitted successfully! Waiting for restaurant confirmation.");
            checkOrderStatus();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 text-danger">Shopping Cart</h2>

            {notification && (
                <Alert variant="success" dismissible onClose={() => setNotification(null)}>
                    {notification}
                </Alert>
            )}

            {cartItems.length === 0 ? (
                <Card className="text-center p-5">
                    <Card.Body>
                        <Card.Title>Your cart is empty</Card.Title>
                        <Button variant="primary" onClick={() => navigate("/")}>
                            Continue Shopping
                        </Button>
                    </Card.Body>
                </Card>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Restaurant</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.menu_id}>
                                    <td>{item.item_name}</td>
                                    <td>{item.restaurant_name}</td>
                                    <td>₹{item.price}</td>
                                    <td>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.menu_id, -1)}
                                        >
                                            -
                                        </Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.menu_id, 1)}
                                        >
                                            +
                                        </Button>
                                    </td>
                                    <td>₹{item.price * item.quantity}</td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => removeItem(item.menu_id)}
                                        >
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="text-end fw-bold">Total:</td>
                                <td className="fw-bold">₹{calculateTotal()}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>

                    <div className="text-center mt-4">
                        <Button variant="success" size="lg" onClick={handleProceedToOrder}>
                            Proceed to Order
                        </Button>
                    </div>
                </>
            )}

            {/* Order Modal */}
            <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Delivery Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="Enter delivery address"
                            />
                        </Form.Group>
                        <div className="mb-3">
                            <strong>Total Amount: ₹{calculateTotal()}</strong>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePlaceOrder}>
                        Place Order
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Order Status and Feedback */}
            {orderStatus && (
                <Card className="mt-4">
                    <Card.Header>
                        <h5>Order Status</h5>
                    </Card.Header>
                    <Card.Body>
                        {latestOrder && (
                            <>
                                <p><strong>Order ID:</strong> {latestOrder.order_id}</p>
                                <p><strong>Restaurant:</strong> {latestOrder.restaurant_name}</p>
                                <p><strong>Total Amount:</strong> ₹{latestOrder.total_amount}</p>
                                <p><strong>Status:</strong> 
                                    {orderStatus === "pending" && (
                                        <span className="badge bg-warning text-dark ms-2">
                                            Pending - Waiting for restaurant confirmation
                                        </span>
                                    )}
                                    {orderStatus === "confirmed" && (
                                        <span className="badge bg-success ms-2">
                                            Confirmed - Order is being prepared
                                        </span>
                                    )}
                                    {orderStatus === "rejected" && (
                                        <span className="badge bg-danger ms-2">
                                            Rejected - Please contact restaurant
                                        </span>
                                    )}
                                    {orderStatus === "delivered" && (
                                        <span className="badge bg-info ms-2">
                                            Delivered - Enjoy your meal!
                                        </span>
                                    )}
                                </p>
                                {orderStatus === "pending" && (
                                    <Alert variant="info" className="mt-3">
                                        <i className="bi bi-info-circle"></i> Your order has been submitted and is awaiting restaurant confirmation. You will be notified once the restaurant accepts your order.
                                    </Alert>
                                )}
                                {orderStatus === "confirmed" && (
                                    <Alert variant="success" className="mt-3">
                                        <i className="bi bi-check-circle"></i> Great! Your order has been confirmed by the restaurant and is being prepared.
                                    </Alert>
                                )}
                            </>
                        )}
                        {showFeedback && latestOrder && (
                            <div className="mt-3">
                                <FeedbackForm
                                    orderId={latestOrder.order_id}
                                    restaurantId={latestOrder.restaurant_id}
                                    onFeedbackSubmitted={() => {
                                        setShowFeedback(false);
                                        alert("Thank you for your feedback!");
                                    }}
                                />
                            </div>
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}


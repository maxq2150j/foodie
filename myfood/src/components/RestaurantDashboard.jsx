import React, { useEffect, useState } from "react";
import { Container, Table, Button, Card, Badge, Modal, Form, Tab, Tabs } from "react-bootstrap";
import { BASE_URL } from "../constants/APIConstant.js";

export default function RestaurantDashboard() {
    const [orders, setOrders] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [restaurantId, setRestaurantId] = useState(null);

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        console.log('RestaurantDashboard - Auth data:', auth);

        let currentRestaurantId = null;

        if (auth.restaurant_id) {

            currentRestaurantId = auth.restaurant_id;
            setRestaurantId(auth.restaurant_id);
            fetchOrders(auth.restaurant_id);
            fetchFeedbacks(auth.restaurant_id);
        } else if (auth.user_id && auth.role === "restaurant") {

            currentRestaurantId = auth.user_id;
            setRestaurantId(auth.user_id);
            fetchOrders(auth.user_id);
            fetchFeedbacks(auth.user_id);
        } else {
            console.error('No restaurant ID found in auth:', auth);
            alert("Restaurant ID not found. Please login again.");
        }


        const interval = setInterval(() => {
            if (currentRestaurantId) {
                fetchOrders(currentRestaurantId);
                fetchFeedbacks(currentRestaurantId);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async (id) => {
        try {

            const response = await fetch(`${BASE_URL}/orders/restaurant/${id}`);

            const data = await response.json();

            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };


    const fetchFeedbacks = async (id) => {
        try {

            const response = await fetch(`${BASE_URL}/feedback/restaurant/${id}`);

            const data = await response.json();

            setFeedbacks(data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        }
    };

    const handleOrderStatus = async (orderId, status) => {
        try {

            const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            const data = await response.json();


            if (response.ok) {
                alert(`Order ${status} successfully!`);
                if (restaurantId) {
                    fetchOrders(restaurantId);
                }
            } else {
                console.error('Failed to update:', data);
                alert(`Failed to update order status: ${data.message || data.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert(`Failed to update order status: ${error.message}`);
        }
    };


    const getStatusBadge = (status) => {
        const normalizedStatus = status?.toLowerCase();
        const variants = {
            pending: "warning",
            confirmed: "success",
            rejected: "danger",
            delivered: "info",
        };
        return <Badge bg={variants[normalizedStatus] || "secondary"}>{status}</Badge>;
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 text-danger">Restaurant Dashboard</h2>


            <Tabs defaultActiveKey="orders" className="mb-3">
                <Tab eventKey="orders" title="Orders">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4>Order Requests</h4>
                        </Card.Header>
                        <Card.Body>
                            {orders.length === 0 ? (
                                <div>
                                    <p className="text-center text-muted">No orders yet</p>
                                    <p className="text-center small">
                                        Orders will appear here when users place orders at your restaurant.
                                        <br />
                                        Current Restaurant ID: <strong>{restaurantId}</strong>
                                    </p>
                                </div>
                            ) : (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>User Name</th>
                                            <th>User Phone</th>
                                            <th>Items</th>
                                            <th>Total Amount</th>
                                            <th>Delivery Address</th>
                                            <th>Status</th>
                                            <th>Order Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.order_id}>
                                                <td>{order.order_id}</td>
                                                <td>{order.user_name}</td>
                                                <td>{order.user_phone}</td>
                                                <td>{order.items || "N/A"}</td>
                                                <td>₹{order.total_amount}</td>
                                                <td>{order.delivery_address}</td>
                                                <td>{getStatusBadge(order.status)}</td>
                                                <td>
                                                    {order.created_at
                                                        ? new Date(order.created_at).toLocaleString()
                                                        : "N/A"}
                                                </td>
                                                <td>
                                                    {order.status?.toLowerCase() === "pending" && (
                                                        <>
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() =>
                                                                    handleOrderStatus(order.order_id, "confirmed")
                                                                }
                                                            >
                                                                Accept
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleOrderStatus(order.order_id, "rejected")
                                                                }
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {order.status?.toLowerCase() === "confirmed" && (
                                                        <Button
                                                            variant="info"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleOrderStatus(order.order_id, "delivered")
                                                            }
                                                        >
                                                            Mark Delivered
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>

                <Tab eventKey="feedbacks" title="Feedbacks">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h4>Customer Feedbacks</h4>
                        </Card.Header>
                        <Card.Body>
                            {feedbacks.length === 0 ? (
                                <p className="text-center">No feedbacks yet</p>
                            ) : (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>User Name</th>
                                            <th>User Phone</th>
                                            <th>Order ID</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedbacks.map((feedback) => (
                                            <tr key={feedback.feedback_id}>
                                                <td>{feedback.user_name}</td>
                                                <td>{feedback.user_phone}</td>
                                                <td>{feedback.order_id}</td>
                                                <td>
                                                    <Badge bg="warning">
                                                        {feedback.rating} ⭐
                                                    </Badge>
                                                </td>
                                                <td>{feedback.comment || "No comment"}</td>
                                                <td>
                                                    {feedback.created_at
                                                        ? new Date(feedback.created_at).toLocaleString()
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Card.Body>
                    </Card>
                </Tab>
            </Tabs>
        </Container>
    );
}




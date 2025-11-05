import React, { useEffect, useState } from "react";
import { Container, Table, Card, Row, Col } from "react-bootstrap";
import { BASE_URL } from "../constants/APIConstant.js";

export default function AdminDashboard() {
    const [usersCount, setUsersCount] = useState(0);
    const [restaurantsCount, setRestaurantsCount] = useState(0);
    const [usersList, setUsersList] = useState([]);
    const [restaurantsList, setRestaurantsList] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch counts
            const usersCountRes = await fetch(`${BASE_URL}/admin/users/count`);
            const usersCountData = await usersCountRes.json();
            setUsersCount(usersCountData.count);

            const restaurantsCountRes = await fetch(`${BASE_URL}/admin/restaurants/count`);
            const restaurantsCountData = await restaurantsCountRes.json();
            setRestaurantsCount(restaurantsCountData.count);

            // Fetch lists
            const usersListRes = await fetch(`${BASE_URL}/admin/users`);
            const usersListData = await usersListRes.json();
            setUsersList(usersListData);

            const restaurantsListRes = await fetch(`${BASE_URL}/admin/restaurants`);
            const restaurantsListData = await restaurantsListRes.json();
            setRestaurantsList(restaurantsListData);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4 text-danger">Admin Dashboard</h2>
            
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Users</Card.Title>
                            <Card.Text className="display-4 text-primary">{usersCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title>Total Restaurants</Card.Title>
                            <Card.Text className="display-4 text-success">{restaurantsCount}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col md={12} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h4>Registered Users</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>User ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Registered Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.length > 0 ? (
                                        usersList.map((user) => (
                                            <tr key={user.user_id}>
                                                <td>{user.user_id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.address || "N/A"}</td>
                                                <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No users registered yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h4>Registered Restaurants</h4>
                        </Card.Header>
                        <Card.Body>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Restaurant ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Description</th>
                                        <th>Registered Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restaurantsList.length > 0 ? (
                                        restaurantsList.map((restaurant) => (
                                            <tr key={restaurant.restaurant_id}>
                                                <td>{restaurant.restaurant_id}</td>
                                                <td>{restaurant.name}</td>
                                                <td>{restaurant.email}</td>
                                                <td>{restaurant.phone}</td>
                                                <td>{restaurant.address || "N/A"}</td>
                                                <td>{restaurant.description || "N/A"}</td>
                                                <td>{restaurant.created_at ? new Date(restaurant.created_at).toLocaleDateString() : "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center">No restaurants registered yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}



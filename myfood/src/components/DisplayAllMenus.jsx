import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { getAllMenus, getMenuByRestaurantId } from "../services/RestaurantService";

export default function DisplayAllMenus() {
    const [menus, setMenus] = useState([]);


    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {

            const response = await getAllMenus();
            setMenus(response.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    return (
        <Container className="mt-5" style={{ paddingLeft: "50px", paddingRight: "50px", paddingBottom: "50px" }}>
            <h2 className="text-center text-success mb-4">🍽️ Our Delicious Menus</h2>
            <Row className="g-4">
                {menus.map((menu) => (
                    <Col md={12} key={menu.menu_id}>
                        <Card
                            className="shadow-sm border-0 d-flex flex-row align-items-center p-3 rounded-4"
                            style={{
                                backgroundColor: "#fffaf0", display: "flex",

                                justifyContent: "space-between",
                                minHeight: "120px",
                            }}
                        >
                            {/* Image */}
                            <div style={{ flex: "0 0 180px" }}>
                                <Card.Img
                                    src={menu.image_url}
                                    alt={menu.item_name}
                                    style={{
                                        width: "180px",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "15px",
                                    }}
                                />
                            </div>

                            {/* Text */}
                            <Card.Body className="ms-4" style={{ flex: 1 }}>
                                <Card.Title className="fw-bold text-primary">
                                    {menu.item_name}
                                </Card.Title>
                                <Card.Text className="text-muted mb-2">{menu.description}</Card.Text>
                                <Card.Text>
                                    <strong>Price:</strong> ₹{menu.price} &nbsp;|&nbsp;
                                    <strong>Qty:</strong> {menu.quantity} &nbsp;|&nbsp;
                                    <strong>Category:</strong> {menu.category}
                                </Card.Text>
                            </Card.Body>

                            {/* Buttons on the right */}
                            <div className="d-flex flex-column align-items-end ms-3" style={{
                                paddingRight: "40px"
                            }}>
                                <Button variant="warning" className="mb-4 px-4">
                                    Update
                                </Button>
                                <Button variant="danger" className="px-4">
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

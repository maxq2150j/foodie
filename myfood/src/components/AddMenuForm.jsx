import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function AddMenuForm() {
    const [menu, setMenu] = useState({

        item_name: "",
        description: "",
        price: "",
        image_url: "",
        quantity: "",
        category: "",
        restaurant_id: "",
    });

    const handleChange = (e) => {
        setMenu({ ...menu, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:6000/menus", menu);
            alert(response.data.message);
        } catch (error) {
            console.error("Error adding menu:", error);
            alert("Something went wrong while adding the menu!");
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="p-4">
                        <h3 className="text-center text-primary mb-4">Add Restaurant Menu</h3>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="item_name"
                                    value={menu.item_name}
                                    onChange={handleChange}
                                    placeholder="Enter item name"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={menu.description}
                                    onChange={handleChange}
                                    placeholder="Enter description"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Price (₹)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={menu.price}
                                    onChange={handleChange}
                                    placeholder="Enter price"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="image_url"
                                    value={menu.image_url}
                                    onChange={handleChange}
                                    placeholder="Enter image URL"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={menu.quantity}
                                    onChange={handleChange}
                                    placeholder="Enter quantity"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={menu.category}
                                    onChange={handleChange}
                                    placeholder="Enter category (e.g., Pizza, Drinks)"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Restaurant ID</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="restaurant_id"
                                    value={menu.restaurant_id}
                                    onChange={handleChange}
                                    placeholder="Enter restaurant ID"
                                />
                            </Form.Group>

                            <div className="text-center">
                                <Button type="submit" variant="primary" className="px-5">
                                    Add Menu
                                </Button>
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

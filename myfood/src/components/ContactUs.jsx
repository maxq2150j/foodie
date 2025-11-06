import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { BASE_URL } from "../constants/APIConstant.js";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        description: "",
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.email || !formData.phone || !formData.description) {
            alert("Please fill in all fields");

            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message || "Your message has been received! We will contact you soon.");


                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    description: "",
                });
                // Hide alert after 5 seconds
                setTimeout(() => setShowAlert(false), 5000);
            } else {
                alert(data.message || "Failed to send message. Please try again.");

            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            alert("Unable to send message. Please try again later.");

        }
    };

    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <div className="text-center mb-4">
                        <h1 className="text-danger display-4 mb-3">Contact Us</h1>
                        <p className="lead text-muted">
                            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    {showAlert && (
                        <Alert
                            variant={alertVariant}
                            dismissible
                            onClose={() => setShowAlert(false)}
                            className="mb-4"
                        >
                            {alertMessage}
                        </Alert>
                    )}

                    <Card className="shadow-sm border-0">
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Phone <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Message <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={5}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter your message..."
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="danger" type="submit" size="lg">
                                        Send Message
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>


                </Col>
            </Row>
        </Container>
    );
}



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
    const [alertVariant, setAlertVariant] = useState("success");

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
            setAlertMessage("Please fill in all fields");
            setAlertVariant("danger");
            setShowAlert(true);
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
                setAlertMessage(data.message || "Your message has been received! We will contact you soon.");
                setAlertVariant("success");
                setShowAlert(true);
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    description: "",
                });
                // Hide alert after 5 seconds
                setTimeout(() => setShowAlert(false), 5000);
            } else {
                setAlertMessage(data.message || "Failed to send message. Please try again.");
                setAlertVariant("danger");
                setShowAlert(true);
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setAlertMessage("Unable to send message. Please try again later.");
            setAlertVariant("danger");
            setShowAlert(true);
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

                    <Card className="shadow-sm border-0 mt-4">
                        <Card.Body className="p-4">
                            <h4 className="text-primary mb-3">Other Ways to Reach Us</h4>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <h5>📧 Email</h5>
                                    <p className="text-muted">support@foodport.com</p>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <h5>📞 Phone</h5>
                                    <p className="text-muted">+1 (555) 123-4567</p>
                                </Col>
                                <Col md={12}>
                                    <h5>📍 Address</h5>
                                    <p className="text-muted">
                                        123 Food Street<br />
                                        City, State 12345<br />
                                        Country
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}



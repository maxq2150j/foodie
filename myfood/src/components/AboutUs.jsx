import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function AboutUs() {
    return (
        <Container className="mt-5 mb-5">
            <Row className="justify-content-center">
                <Col md={10}>
                    <div className="text-center mb-5">
                        <h1 className="text-danger display-4 mb-3">About FoodPort</h1>
                        <p className="lead text-muted">
                            Your trusted partner for delicious food delivery
                        </p>
                    </div>

                    <Row className="mb-5">
                        <Col md={6}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="p-4">
                                    <h3 className="text-primary mb-3">Our Mission</h3>
                                    <p className="text-muted">
                                        At FoodPort, we believe that great food should be accessible to everyone, 
                                        delivered right to your doorstep. We connect food lovers with the best 
                                        restaurants in town, making it easy to enjoy your favorite meals from 
                                        the comfort of your home.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body className="p-4">
                                    <h3 className="text-success mb-3">Our Vision</h3>
                                    <p className="text-muted">
                                        To become the leading food delivery platform that brings communities 
                                        together through the joy of great food. We strive to support local 
                                        restaurants while providing exceptional service to our customers.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-5">
                        <Col md={12}>
                            <Card className="shadow-sm border-0">
                                <Card.Body className="p-4">
                                    <h3 className="text-danger mb-4">Why Choose FoodPort?</h3>
                                    <Row>
                                        <Col md={4} className="mb-3">
                                            <div className="text-center">
                                                <div className="display-4 mb-2">🚀</div>
                                                <h5>Fast Delivery</h5>
                                                <p className="text-muted small">
                                                    Quick and reliable delivery service to get your food hot and fresh
                                                </p>
                                            </div>
                                        </Col>
                                        <Col md={4} className="mb-3">
                                            <div className="text-center">
                                                <div className="display-4 mb-2">🍽️</div>
                                                <h5>Wide Selection</h5>
                                                <p className="text-muted small">
                                                    Choose from hundreds of restaurants and thousands of dishes
                                                </p>
                                            </div>
                                        </Col>
                                        <Col md={4} className="mb-3">
                                            <div className="text-center">
                                                <div className="display-4 mb-2">⭐</div>
                                                <h5>Quality Assured</h5>
                                                <p className="text-muted small">
                                                    Partner with verified restaurants for the best dining experience
                                                </p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={12}>
                            <Card className="shadow-sm border-0 bg-light">
                                <Card.Body className="p-4">
                                    <h3 className="text-primary mb-3">Our Story</h3>
                                    <p className="text-muted">
                                        FoodPort was founded with a simple idea: making great food accessible to everyone. 
                                        Since our launch, we've been committed to connecting customers with local restaurants, 
                                        creating a seamless ordering experience, and supporting the food industry.
                                    </p>
                                    <p className="text-muted">
                                        Today, we're proud to serve thousands of customers and work with hundreds of 
                                        restaurants, continuously improving our platform to provide the best food delivery 
                                        experience possible.
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}



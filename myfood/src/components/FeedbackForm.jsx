import React, { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { BASE_URL } from "../constants/APIConstant.js";

export default function FeedbackForm({ orderId, restaurantId, onFeedbackSubmitted }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = JSON.parse(localStorage.getItem("auth") || "{}");
            if (!auth.user_id) {
                alert("Please login first");
                return;
            }

            const feedbackData = {
                user_id: auth.user_id,
                restaurant_id: restaurantId,
                order_id: orderId,
                rating: rating,
                comment: comment,
            };

            console.log('Submitting feedback:', feedbackData);

            const response = await fetch(`${BASE_URL}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(feedbackData),
            });

            const data = await response.json();
            console.log('Feedback response:', data);

            if (response.ok) {
                setSubmitted(true);
                alert("Thank you for your feedback!");
                if (onFeedbackSubmitted) {
                    onFeedbackSubmitted();
                }
            } else {
                console.error('Failed to submit feedback:', data);
                alert(`Failed to submit feedback: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert(`Failed to submit feedback: ${error.message}`);
        }
    };

    if (submitted) {
        return (
            <Container className="mt-5">
                <Alert variant="success">
                    Thank you for your feedback! Your feedback has been submitted successfully.
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h4>Submit Feedback</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                                required
                            >
                                <option value={5}>5 ⭐ - Excellent</option>
                                <option value={4}>4 ⭐ - Very Good</option>
                                <option value={3}>3 ⭐ - Good</option>
                                <option value={2}>2 ⭐ - Fair</option>
                                <option value={1}>1 ⭐ - Poor</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Please share your experience..."
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Submit Feedback
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}



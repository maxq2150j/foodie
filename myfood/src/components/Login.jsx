import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");

  const roles = [
    { id: "user", label: "User" },
    { id: "restaurant", label: "Restaurant" },
    { id: "admin", label: "Admin" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    // Simple client-side validation
    if (!phone || !password) {
      alert("Please enter phone and password");
      return;
    }
    // POST to backend login endpoint
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password, role: selectedRole }),
      });

      const data = await res.json();
      if (res.ok) {
        const auth = { authenticated: true, role: selectedRole, phone, token: data.token };
        localStorage.setItem("auth", JSON.stringify(auth));
        if (selectedRole === "user") navigate("/");
        else if (selectedRole === "restaurant") navigate("/restaurant-home");
        else navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to reach server");
    }
  }

  return (
    <Container style={{ maxWidth: 900, marginTop: 40 }}>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-4 text-center text-danger">Login</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select Role</Form.Label>
                  <div
                    style={{
                      border: "1px solid #dee2e6",
                      borderRadius: 6,
                      maxHeight: 90,
                      overflowY: "auto",
                      padding: 8,
                    }}
                  >
                    {roles.map((r) => (
                      <Form.Check
                        key={r.id}
                        type="radio"
                        id={`role-${r.id}`}
                        label={r.label}
                        name="role"
                        checked={selectedRole === r.id}
                        onChange={() => setSelectedRole(r.id)}
                        className="mb-1"
                      />
                    ))}
                  </div>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="danger" type="submit">
                    Login
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <small>
                  I don't have account — <a href="/register">Register here</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

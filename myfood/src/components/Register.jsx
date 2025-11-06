import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/APIConstant.js";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRole, setSelectedRole] = useState("user");

  const roles = [
    { id: "user", label: "User" },
    { id: "restaurant", label: "Restaurant" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password || !name || !phone) {
      alert("Please fill at least name, email, phone and password.");
      return;
    }

    try {
      let res;
      if (selectedRole === "restaurant") {
        const payload = {
          name,
          email,
          password,
          phone,
          address: address || "",
          description: description || "",
        };
        res = await fetch(`${BASE_URL}/restaurant`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const payload = {
          name,
          email,
          password,
          phone,
          address: address || "",
        };
        res = await fetch(`${BASE_URL}/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.message || data.error || "Registration failed";
        console.error("Registration error:", data);
        alert(errorMsg + (data.error ? `\nError: ${data.error}` : ""));
        return;
      }


      alert("Registration successful! Please login to continue.");
      navigate("/login");
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
              <h3 className="mb-4 text-center text-danger">Register</h3>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <Form.Group className="mb-3" controlId="formPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>

                {selectedRole === "restaurant" && (
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Restaurant Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Short description of the restaurant"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>
                )}

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
                        id={`reg-role-${r.id}`}
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
                    Register
                  </Button>
                </div>
              </Form>

              <div className="text-center mt-3">
                <small>
                  Already have an account? — <a href="/login">Login here</a>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

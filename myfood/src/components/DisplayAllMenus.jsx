import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Modal, Form, Table } from "react-bootstrap";
import { getAllMenus, updateMenu, deleteMenu, getMenuByRestaurantId } from "../services/RestaurantService";



export default function DisplayAllMenus() {
    const [menus, setMenus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
        fetchMenus();
    }, []);
    const handleChange = (e) => {
        setSelectedMenu({ ...selectedMenu, [e.target.name]: e.target.value });
    };

    // const fetchMenus = async () => {
    //     try {
    //         const response = await getMenuByRestaurantId();
    //         setMenus(response.data);
    //     } catch (error) {
    //         console.error("Error fetching menus:", error);
    //     }
    // };

    const handleUpdateClick = (menu) => {
        setSelectedMenu(menu);
        setShowModal(true);
    };

    const authData = localStorage.getItem("auth");
    const parsedAuth = JSON.parse(authData);
    console.log(parsedAuth);
    const restaurantId = parsedAuth.restaurant_id;
    console.log("Restaurant ID:", restaurantId);

    const fetchMenus = async () => {
        try {
            const response = await getMenuByRestaurantId(restaurantId);
            setMenus(response.data);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };



    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateMenu(selectedMenu.menu_id, selectedMenu);

            alert(response.data.message);
            setShowModal(false);
            fetchMenus();
        } catch (error) {
            console.error("Update failed:", error);
            alert("Something went wrong while updating!");
        }
    };

    const handleDelete = async (menuId) => {
        if (window.confirm("Are you sure you want to delete this menu item?")) {
            try {
                await deleteMenu(menuId);
                alert("Menu deleted successfully!");

                setMenus(menus.filter((menu) => menu.menu_id !== menuId));
            } catch (error) {
                console.error("Error deleting menu:", error);
                alert("Failed to delete menu item.");
            }
        }
    };

    return (
        <Container className="mt-5 pb-5">
            <h2 className="text-center text-danger mb-4 fw-bold">🍔 All Menu Items</h2>

            <div className="table-responsive">
                <Table bordered className="align-middle shadow-sm">
                    <thead className="table-danger text-center">
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Item Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Price (₹)</th>
                            <th>Qty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {menus.length > 0 ? (
                            menus.map((menu, index) => (
                                <tr key={menu.menu_id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img
                                            src={menu.image_url}
                                            alt={menu.item_name}
                                            style={{
                                                width: "80px",
                                                height: "60px",
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </td>
                                    <td className="fw-semibold text-primary">{menu.item_name}</td>
                                    <td style={{ maxWidth: "250px" }}>
                                        {menu.description?.slice(0, 50)}...
                                    </td>
                                    <td>{menu.category}</td>
                                    <td>₹{menu.price}</td>
                                    <td>{menu.quantity}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handleUpdateClick(menu)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(menu.menu_id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-muted">
                                    No menu items found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Update Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Update Menu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMenu && (
                        <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="item_name"
                                    value={selectedMenu.item_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="description"
                                    value={selectedMenu.description}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="price"
                                    value={selectedMenu.price}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="quantity"
                                    value={selectedMenu.quantity}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={selectedMenu.category}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Image URL</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="image_url"
                                    value={selectedMenu.image_url}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <div className="text-center">
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );

}

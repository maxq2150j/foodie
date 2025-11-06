import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { getAllMenus } from "../services/RestaurantService.js";
import { BASE_URL } from "../constants/APIConstant.js";



export function Home() {
    const [menus, setMenus] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [menusByRestaurant, setMenusByRestaurant] = useState({});



    useEffect(() => {
        fetchMenus();
    }, []);





    const grouped = {};
    const restaurantSet = new Set();



    const fetchMenus = async () => {
        try {
            const response = await getAllMenus();

            // Check if response is successful
            if (response.status !== 200) {
                console.error("Failed to fetch menus:", response.status);
                setMenusByRestaurant({});
                setRestaurants([]);
                return;
            }

            const menus = response.data || [];

            // If no menus, set empty state
            if (!menus || menus.length === 0) {
                setMenusByRestaurant({});
                setRestaurants([]);
                return;
            }

            // Group menus by restaurant
            const grouped = {};
            const restaurantSet = new Set();

            menus.forEach((menu) => {
                if (!grouped[menu.restaurant_id]) {
                    grouped[menu.restaurant_id] = [];
                    restaurantSet.add(menu.restaurant_id);
                }
                grouped[menu.restaurant_id].push(menu);
            });

            // Fetch restaurant details
            const restaurantPromises = Array.from(restaurantSet).map(async (restaurantId) => {
                try {
                    const res = await fetch(`${BASE_URL}/restaurant/${restaurantId}`);
                    if (res.ok) {
                        const data = await res.json();
                        return { restaurant_id: restaurantId, ...data };
                    }
                } catch (error) {
                    console.error(`Error fetching restaurant ${restaurantId}:`, error);
                }
                // Fallback: try to get restaurant name from menus
                const restaurantMenu = menus.find(m => m.restaurant_id === restaurantId);
                return {
                    restaurant_id: restaurantId,
                    name: restaurantMenu?.restaurant_name || `Restaurant ${restaurantId}`
                };
            });

            const restaurantDetails = await Promise.all(restaurantPromises);
            setRestaurants(restaurantDetails);
            setMenusByRestaurant(grouped);
        } catch (error) {
            console.error("Error fetching menus:", error);
        }
    };

    const getRestaurantName = (restaurantId) => {
        const restaurant = restaurants.find((r) => r.restaurant_id === restaurantId);
        return restaurant ? restaurant.name : `Restaurant ${restaurantId}`;
    };

    menus.forEach((menu) => {
        if (!grouped[menu.restaurant_id]) {
            grouped[menu.restaurant_id] = [];
            restaurantSet.add(menu.restaurant_id);
        }
        grouped[menu.restaurant_id].push(menu);
    });

    const addToCart = (menu, restaurantName) => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");

        const existingItemIndex = cart.findIndex(
            (item) => item.menu_id === menu.menu_id && item.restaurant_id === menu.restaurant_id
        );

        if (existingItemIndex >= 0) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                menu_id: menu.menu_id,
                restaurant_id: menu.restaurant_id,
                restaurant_name: restaurantName,
                item_name: menu.item_name,
                price: menu.price,
                image_url: menu.image_url,
                quantity: 1,
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Item added to cart!");
    };

    return (
        <Container className="mt-5 mb-5">

            <div
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "300px",
                    borderRadius: "15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    textAlign: "center",
                    marginBottom: "60px",

                }}
            >
                <h1 className="fw-bold">Are you hungry?</h1>
                <p className="fs-5">Don’t wait!!! Let’s start ordering food now!</p>

            </div>

            <h2 className="text-center mb-5 text-danger">🍴 Availabel Food</h2>

            {Object.keys(menusByRestaurant).length === 0 ? (
                <div className="text-center p-5">
                    <p>No menus available at the moment.</p>
                </div>
            ) : (
                Object.keys(menusByRestaurant).map((restaurantId) => (
                    <div key={restaurantId} className="mb-5">
                        <h3 className="mb-3 text-primary border-bottom pb-2">
                            {getRestaurantName(parseInt(restaurantId))}
                        </h3>
                        <Row className="g-4">
                            {menusByRestaurant[restaurantId].map((menu) => (

                                <Col key={menu.menu_id} lg={3} md={4} sm={6} xs={12}>
                                    <Card className="h-100 shadow-sm">
                                        <Card.Img
                                            variant="top"
                                            src={menu.image_url}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="fw-bold">{menu.item_name}</Card.Title>
                                            <Card.Text className="text-muted small flex-grow-1">
                                                {menu.description || "No description available"}
                                            </Card.Text>
                                            <div className="mb-2">
                                                <strong className="text-success">₹{menu.price}</strong>
                                                {menu.category && (
                                                    <span className="badge bg-secondary ms-2">{menu.category}</span>
                                                )}
                                            </div>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => addToCart(menu, getRestaurantName(parseInt(restaurantId)))}
                                            >
                                                Add to Cart
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))
            )}

        </Container>
    );

}

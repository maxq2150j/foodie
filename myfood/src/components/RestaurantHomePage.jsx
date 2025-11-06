import React from "react";

function RestaurantHomePage() {
    const heroImage =
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80"; // Nice restaurant image

    return (
        <div >



            <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 20px" }}>
                <div
                    style={{
                        display: "flex",
                        gap: "40px",
                        alignItems: "center",
                        background: "#fff",
                        borderRadius: "20px",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                        overflow: "hidden",
                    }}
                >

                    <div style={{ flex: 1 }}>
                        <img
                            src={heroImage}
                            alt="Restaurant"
                            style={{
                                width: "100%",
                                height: "400px",
                                objectFit: "cover",
                                filter: "brightness(0.95)",
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, padding: "40px" }}>
                        <h1
                            style={{
                                fontSize: "2.7rem",
                                color: "#e63946",
                                marginBottom: "15px",
                                fontWeight: "700",
                            }}
                        >
                            Welcome to Your Restaurant Portal 🍽️
                        </h1>
                        <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "20px" }}>
                            Manage your restaurant’s presence effortlessly! Add, update, or showcase your delicious dishes—all in one place.
                        </p>
                        <p style={{ fontSize: "1.05rem", color: "#666", marginBottom: "30px" }}>
                            Create an attractive online menu, impress food lovers, and grow your business with style.
                        </p>


                        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                            <button
                                style={{
                                    backgroundColor: "#e63946",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 26px",
                                    borderRadius: "8px",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    transition: "0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#c92a36")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#e63946")}
                            >
                                ➕ Add Item
                            </button>

                            <button
                                style={{
                                    backgroundColor: "#1d3557",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 26px",
                                    borderRadius: "8px",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    transition: "0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#16294d")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#1d3557")}
                            >
                                🍔 View Menu Card
                            </button>

                            <button
                                style={{
                                    backgroundColor: "#457b9d",
                                    color: "#fff",
                                    border: "none",
                                    padding: "12px 26px",
                                    borderRadius: "8px",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    transition: "0.3s",
                                }}
                                onMouseOver={(e) => (e.target.style.backgroundColor = "#356685")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "#457b9d")}
                            >
                                👀 Display Items
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <footer
                style={{
                    backgroundColor: "#1d3557",
                    color: "#fff",
                    textAlign: "center",
                    padding: "18px 0",
                    marginTop: "60px",
                    fontSize: "0.95rem",
                }}
            >
                © 2025 MyRestaurant | Crafted with ❤️ for food lovers
            </footer>
        </div>
    );
}

export default RestaurantHomePage;

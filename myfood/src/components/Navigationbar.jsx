import { FaSearch } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export function Navigationbar() {
    const navigate = useNavigate();
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const role = auth.role || "user";
    
    const handleLogout = () => {
        try {
            localStorage.removeItem('auth');
            localStorage.removeItem('cart');
        } catch (e) {
            // ignore
        }
        navigate('/login');
    };
    
    return (
        <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3 px-4">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold fs-3 text-danger" href="#">
                    FoodPort
                </a>

                <div
                    className="d-flex align-items-center border rounded-pill px-3 py-1 mx-auto"
                    style={{ width: "50%" }}
                >
                    <div className="d-flex align-items-center flex-grow-1 w-100">
                        <FaSearch className="text-secondary me-2" />
                        <input
                            className="form-control border-0 shadow-none"
                            type="search"
                        />
                    </div>
                </div>
                <div>
                    <Nav className="me-auto">
                        {role === "user" && (
                            <>
                                <LinkContainer to="/">
                                    <Nav.Link className="text-secondary">Home</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/cart">
                                    <Nav.Link className="text-secondary">Cart</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/about-us">
                                    <Nav.Link className="text-secondary">About Us</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/contact-us">
                                    <Nav.Link className="text-secondary">Contact Us</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                        {role === "restaurant" && (
                            <>
                                <LinkContainer to="/restaurant-home">
                                    <Nav.Link className="text-secondary">Home</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/restaurant-dashboard">
                                    <Nav.Link className="text-secondary">Dashboard</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/addMenus">
                                    <Nav.Link className="text-secondary">Add Menu</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to="/displayMenus">
                                    <Nav.Link className="text-secondary">View Menus</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                        {role === "admin" && (
                            <>
                                <LinkContainer to="/admin-dashboard">
                                    <Nav.Link className="text-secondary">Dashboard</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                        <Nav.Link className="text-secondary" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                            Logout
                        </Nav.Link>
                    </Nav>
                </div>
            </div>
        </nav>
    );
};



import { FaSearch } from "react-icons/fa";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export function Navigationbar() {
    const navigate = useNavigate();
    const handleLogout = () => {
        try {
            localStorage.removeItem('auth');
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
                        <LinkContainer to="/">
                            <Nav.Link className="text-secondary">Home</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/register-student">
                            <Nav.Link className="text-secondary">Contact</Nav.Link>
                        </LinkContainer>

                        <LinkContainer to="/students-list">
                            <Nav.Link className="text-secondary">About Us</Nav.Link>
                        </LinkContainer>

                        <Nav.Link className="text-secondary" style={{ cursor: 'pointer' }} onClick={handleLogout}>
                            Log out
                        </Nav.Link>

                        <LinkContainer to="/students-list">
                            <Nav.Link className="text-secondary" >Cart</Nav.Link>
                        </LinkContainer>
                    </Nav>
                </div>
            </div>
        </nav>
    );
};



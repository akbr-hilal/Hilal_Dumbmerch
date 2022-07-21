import React, { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { UserContext } from "../context/userContext";

function NavAdmin() {

    const [state, dispatch] = useContext(UserContext)

    let navigate = useNavigate()

    let activeClassName =
        "text-orange-nav text-decoration-none d-flex align-items-center fw-bolder me-3";

    let noActiveClassName =
        "text-white-nav text-decoration-none d-flex align-items-center fw-bolder me-3";

    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/")
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        {" "}
                        <Link to="/dashboard" className={"text-decoration-none"}>
                            <img
                                src={Logo}
                                alt="Logo DumbMerch"
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                            />{" "}
                            <span className="ms-2 text-white">DumbMerch</span>
                        </Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse
                        id="responsive-navbar-nav"
                        className={"justify-content-end bg-dark p-3 p-lg-0"}
                    >
                        <Nav className={" bg-collapse pt-lg-0 pt-md-1"}>
                            <NavLink
                                to="/list-category"
                                className={({ isActive }) =>
                                    isActive
                                        ? activeClassName
                                        : noActiveClassName
                                }
                            >
                                Category
                            </NavLink>
                            <NavLink
                                to="/list-product"
                                className={({ isActive }) =>
                                    isActive
                                        ? activeClassName
                                        : noActiveClassName
                                }
                            >
                                Product
                            </NavLink>
                            <NavLink
                                to="/chat-admin"
                                className={({ isActive }) =>
                                    isActive
                                        ? activeClassName
                                        : noActiveClassName
                                }
                            >
                                Chat
                            </NavLink>
                            <NavLink
                                to="/profile-admin"
                                className={({ isActive }) =>
                                    isActive
                                        ? activeClassName
                                        : noActiveClassName
                                }
                            >
                                Profile
                            </NavLink>
                            <Nav.Link
                                className={
                                    "btn btn-orange-nav text-white"
                                } 
                                onClick={logout}
                            >
                                Logout
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavAdmin;

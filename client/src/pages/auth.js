import { useContext, useState } from "react";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../assets/Logo.png";

import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import { UserContext } from "../context/userContext";

export default function Auth() {
    let navigate = useNavigate()
    const[state]= useContext(UserContext)

    // const checkAuth = () => {
    //     if(state.isLogin === true){
    //         navigate("/")
    //     }
    // }
    // checkAuth()

    const [isRegister, setIsRegister] = useState(false);

    const switchLogin = () => {
        setIsRegister(false);
    };

    const switchRegister = () => {
        setIsRegister(true);
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        {" "}
                        <Link to="/" className="text-decoration-none">
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
                        className="justify-content-end"
                    >
                        <Nav className=" bg-collapse pt-lg-0 pt-md-1">
                            <Nav.Link
                                className="text-white-nav text-decoration-none d-flex align-items-center fw-bolder me-3"
                                onClick={switchLogin}
                            >
                                Login
                            </Nav.Link>
                            <Nav.Link
                                className="text-white-nav text-decoration-none d-flex align-items-center fw-bolder me-3"
                                onClick={switchRegister}
                            >
                                Register
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="bg-dark formauthpage">
                <Container>
                    <Row className="pt-5 d-flex">
                        <Col className="py-3 text-white d-flex">
                            <div>
                                <div className="d-flex justify-content-center justify-content-lg-start">
                                    <img
                                        src={Logo}
                                        alt="Logo DumbMerch"
                                        height={160}
                                        className="mb-4"
                                    />
                                </div>
                                <div className="text-center text-lg-start">
                                    <h1 className="fw-bold">
                                        Easy, Fast, and Reliable
                                    </h1>
                                    <p className="">
                                        Go shopping for mechandise, just go to
                                        DumbMerch shooping, the biggest
                                        merchandise in <b>Indonesia</b>
                                    </p>
                                </div>
                            </div>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center py-5">
                            {isRegister ? <Register /> : <Login />}
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

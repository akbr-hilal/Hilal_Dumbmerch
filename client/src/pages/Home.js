import React from "react";
import Logo from "../assets/Logo.png";
import { Container } from "react-bootstrap";
import NavGuest from "../components/NavGuest";
import {Link} from 'react-router-dom'


function Home() {
    document.title = "DumbMerch"
    return (
        <>
            <NavGuest />
            <div className="bg-dark">
                <Container className="d-flex align-items-center justify-content-center landingpage">
                    <div>
                        <div className="d-flex justify-content-center mb-3">
                            <img src={Logo} alt="Logo DumbMerch" height={200}/>
                        </div>
                        <div className="text-center text-white">
                            <h1 className="fw-bold">DumMerch Shoping</h1>
                            <h3>Easy, Fast, and Reliable</h3>
                            <p>
                                Go shopping for mechandise, just go to DumbMerch shooping, the
                                biggest merchandise in <b>Indonesia</b>
                            </p>
                        </div>
                        <div className="text-center">
                            <Link to="/auth">
                            <button className="btn btn-orange-submit col-6">Get Started</button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default Home;

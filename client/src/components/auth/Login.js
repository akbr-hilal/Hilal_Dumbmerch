import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Alert, Form } from "react-bootstrap";

import { UserContext } from "../../context/userContext";

import { API } from "../../config/api";

export default function Login() {
    const title = "Login";
    document.title = "DumbMerch | " + title;

    let navigate = useNavigate();

    const [state, dispatch] = useContext(UserContext);

    const [mss, setMss] = useState(null);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const { email, password } = form;

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = useMutation(async e => {
        try {
            e.preventDefault();

            // Set Configuration
            const config = {
                headers: {
                    "Content-Type": "application/json",
                }
            };

            //Data Body
            const body = JSON.stringify(form);
            
            // Insert data
            const response = await API.post("/login", body, config);
            console.log(response);

            // Checking
            if (response?.status === 200) {
                // Send Data
                dispatch({
                    type: "LOGIN_SUCCESS",
                    payload: response.data.data,
                });

                // Status Check
                if (response.data.data.status === "admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/home");
                }
                const alert = (
                    <Alert variant="success">
                        Login Success
                    </Alert>
                );
                setMss(alert);
            } else {
                const alert = (
                    <Alert variant="danger">
                        Login Failed
                    </Alert>
                );
                setMss(alert);
            }
        } catch (error) {
            console.log(error);
            const alert = (
                <Alert variant="danger">
                    Login Error
                </Alert>
            );
            setMss(alert);
        }
    });

    return (
        <div>
            <Form
                className="bg-form rounded Form px-4 text-white"
                onSubmit={e => handleSubmit.mutate(e)}
            >
                {mss && mss}
                <h3 className="fw-bold mb-3 text-white">Login</h3>
                <Form.Group className="mb-2">
                    <Form.Label htmlFor="email">Your Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-5">
                    <Form.Label htmlFor="password">Your Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </Form.Group>
                <button className="btn col-12 btn-orange-submit">Login</button>
            </Form>
        </div>
    );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Alert, Form } from "react-bootstrap";

import { API } from "../../config/api";

export default function Register() {
    const title = "Register";
    document.title = "DumbMerch | " + title;

    let navigate = useNavigate();

    const [mss, setMss] = useState();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { name, email, password } = form;

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
                },
            };
            
            //Data Body
            const body = JSON.stringify(form);

            // Insert data
            const response = await API.post("/register", body, config);
            console.log(response);

            // Checking
            if (response.data.status === "success") {
                const alert = (
                    <Alert variant="success">
                        Success
                    </Alert>
                );
                setMss(alert);
                setForm({
                    name: "",
                    email: "",
                    password: "",
                });
            } else {
                const alert = (
                    <Alert variant="danger">
                        Register Failed
                    </Alert>
                )
                setMss(alert);
            }
        } catch (error) {
            console.log(error);
            const alert = <Alert variant="danger">Register Error</Alert>;
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
                <h3 className="fw-bold mb-3 text-white">Register</h3>

                <Form.Group className="mb-2">
                    <Form.Label htmlFor="name">Your Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        id="name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                    />
                </Form.Group>

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

                <Form.Group className="mb-2">
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
                <button className="btn col-12 btn-orange-submit">Register</button>
            </Form>
        </div>
    );
}

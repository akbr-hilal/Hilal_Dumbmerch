import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import NavAdmin from "../../components/NavAdmin";
import { API } from "../../config/api";
import { useMutation } from "react-query";

function AddCategory() {
    let navigate = useNavigate()
    
    const title = "Add Category";
    document.title = "DumbMerch | " + title;

    const [category, setCategory] = useState("")

    const handleChange = (e) => {
        setCategory(e.target.value)
    }

    const handleSubmit = useMutation(async e => {
        try {
            e.preventDefault()

            // Set Config
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            // Data Body
            const body = JSON.stringify({name: category})

            //Insert Category
            const response = await API.post("/category", body, config)
            console.log(response)

            //Navigate
            navigate("/list-category")
        } catch (error) {
            console.log(error)
        }
    })
    
    return (
        <div>
            <NavAdmin />
            <Container className="mt-3">
                <h2 className="fw-bold text-center text-orange mb-2">
                    Add Your Category
                </h2>
                <div className="d-flex justify-content-center">
                    <Form style={{ width: "600px" }} onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Group className="mb-3" controlId="formGroupTitle">
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Category Name"
                                name="category"
                                value={category}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="text-end">
                            <button className="btn btn-success col-5 mb-3">
                            Submit
                            </button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    );
}

export default AddCategory;

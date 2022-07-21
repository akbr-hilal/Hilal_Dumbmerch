import React, { useEffect, useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import NavAdmin from "../../components/NavAdmin";
import { API } from "../../config/api";

function AddProduct() {
    let navigate = useNavigate();

    const title = "Add Product";
    document.title = "DumbMerch | " + title;

    //Store All category
    const [categories, setCategories] = useState([]);

    // For save selected
    const [categoryId, setCategoryId] = useState([]);

    // For Preview Image
    const [preview, setPreview] = useState(null);

    // For Form
    const [form, setForm] = useState({
        img: "",
        name: "",
        desc: "",
        price: "",
        qty: "",
    });

    const [mss, setMss] = useState(null);

    // Fetching category data
    const getCategories = async () => {
        try {
            const response = await API.get("/category");
            setCategories(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    // For handle category selected
    const handleChangeCategoryId = e => {
        const id = e.target.value;
        const checked = e.target.checked;

        if (checked) {
            setCategoryId([...categoryId, parseInt(id)]);
        } else {
            let newCategoryId = categoryId.filter(categoryIdItem => {
                return categoryIdItem !== id;
            });
            setCategoryId(newCategoryId);
        }
    };

    // Handle chane data form
    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.type === "file" ? e.target.files : e.target.value,
        });

        // Create img url for preview
        if (e.target.type === "file") {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
    };

    const handleSubmit = useMutation(async e => {
        try {
            e.preventDefault();

            // Set Config
            const config = {
                method: "POST",
                headers: {
                    "Content-type": "multipart/form-data",
                },
            };

            // Store data
            const formData = new FormData();
            formData.set("img", form?.img[0], form?.img[0].name);
            formData.set("name", form.name);
            formData.set("desc", form.desc);
            formData.set("price", form.price);
            formData.set("qty", form.qty);
            formData.set("categoryId", categoryId);
            console.log(form);
            console.log(formData);

            const alert = (
                <Alert variant="success">
                    Add Product Success
                </Alert>
            );
            setMss(alert);

            // insert product
            await API.post("/products", formData, config);
            // console.log(response);

            navigate("/list-product");
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div>
            <NavAdmin />
            <Container className="mt-3">
                <h2 className="fw-bold text-center text-orange mb-2">
                    Add Your Product
                </h2>
                {mss}
                <div className="d-flex justify-content-center">
                    <Form
                        style={{ width: "600px" }}
                        onSubmit={e => handleSubmit.mutate(e)}
                    >
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name">Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Product Name"
                                id="name"
                                name="name"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name">
                                Product Description
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter Product Description"
                                rows={3}
                                id="desc"
                                name="desc"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="price">
                                Product Price
                            </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Product Price (Rp.)"
                                id="price"
                                name="price"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="stock">
                                Product Stock
                            </Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Product Stock"
                                id="stock"
                                name="qty"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Category</Form.Label>
                            <div>
                                {categories?.map((item, index) => (
                                    <label
                                        className="checkbox-inline me-4"
                                        key={index}
                                    >
                                        <input
                                            type="checkbox"
                                            value={item?.id}
                                            onClick={handleChangeCategoryId}
                                        />{" "}
                                        {item?.name}
                                    </label>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-5">
                            {preview && (
                                <div>
                                    <img
                                        src={preview}
                                        style={{
                                            maxWidth: "150px",
                                            objectFit: "cover",
                                        }}
                                        alt={preview}
                                    />
                                </div>
                            )}
                            <Form.Label>Upload Image Product</Form.Label>
                            <Form.Control
                                type="file"
                                id="upload"
                                name="img"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <div className="text-end">
                            <button
                                type="submit"
                                className="btn btn-success col-5 mb-3"
                            >
                                Add Product
                            </button>
                        </div>
                    </Form>
                </div>
            </Container>
        </div>
    );
}

export default AddProduct;

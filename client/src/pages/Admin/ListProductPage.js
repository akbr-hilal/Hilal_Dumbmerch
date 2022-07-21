import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";
import { useMutation } from "react-query";
// import ReactShowMoreText from "@podverse/react-show-more-text"
import rupiahFormat from "rupiah-format";

import imgEmpty from "../../assets/emptyImg.png";
import NavAdmin from "../../components/NavAdmin";
import DeleteData from "../../components/modal/DeleteData";

import { API } from "../../config/api";

function ListProductPage() {
    let navigate = useNavigate();

    const title = "Product List";
    document.title = "DumbMerch | " + title;

    //Var for del product
    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    //Modal confim del
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
    const [products, setProducts] = useState([])
    console.log(products)
    
    const getProducts = async() => {
        const response = await API.get("/products");
        setProducts(response.data.data)
    }

    useEffect(() => {
        getProducts()
    }, [])

    const addProduct = () => {
        navigate("/add-product");
    };

    const handleEdit = id => {
        navigate("/edit-product/" + id);
    };

    const handleDelete = id => {
        setIdDelete(id);
        handleShow();
    };

    const deleteById = useMutation(async id => {
        try {
            await API.delete(`/products/${id}`);
            getProducts()
        } catch (error) {
            console.log(error);
        }
    });

    useEffect(() => {
        if (confirmDelete) {
            //Close Modal
            handleClose();
            //Execute data product by id
            deleteById.mutate(idDelete);
            setConfirmDelete(null);
        }
    }, [confirmDelete]);

    return (
        <>
            <NavAdmin />
            <Container className="mt-3">
                <h2 className="fw-bold text-center text-orange mb-2">
                    Your Product List
                </h2>
                <div className="text-end mb-4">
                    <button className="btn btn-success" onClick={addProduct}>
                        Add Product
                    </button>
                </div>
                <div>
                    {products?.length !== 0 ? (
                        <Table
                            striped
                            bordered
                            hover
                            size="lg"
                            className="align-middle rounded"
                            responsive="sm"
                        >
                            <thead className="bg-product">
                                <tr className="bg-product">
                                    <th width="10px" className="text-center">
                                        No
                                    </th>
                                    <th width="60px" className="text-center">
                                        Photo
                                    </th>
                                    <th width="232px" className="text-center">
                                        Product Name
                                    </th>
                                    <th width="300px" className="text-center">
                                        Product Description
                                    </th>
                                    <th width="100px" className="text-center">
                                        Price
                                    </th>
                                    <th width="40px" className="text-center">
                                        Qty
                                    </th>
                                    <th className="text-center" width="232px">
                                        Action
                                </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="align-middle text-center">
                                            {index + 1}
                                        </td>
                                        <td className="align-middle">
                                            <img
                                                src={item.img}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                }}
                                                alt={item.name}
                                            />
                                        </td>
                                        <td className="align-middle">
                                            {item.name}
                                        </td>
                                        <td className="align-middle">
                                            {item.desc}
                                        </td>
                                        <td className="align-middle">
                                            {rupiahFormat.convert(item.price)}
                                        </td>
                                        <td className="align-middle">
                                            {item.qty}
                                        </td>
                                        <td className="align-middle text-center">
                                            <Button
                                                onClick={() => {
                                                    handleEdit(item.id);
                                                }}
                                                className="btn btn-success me-2"
                                                style={{ width: "100px" }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    handleDelete(item.id);
                                                }}
                                                className="btn btn-danger"
                                                style={{ width: "100px" }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <div className="text-center pt-5">
                            <img
                                src={imgEmpty}
                                className="img-fluid"
                                style={{ width: "250px" }}
                                alt="empty"
                            />
                            <div className="mt-3">No data product</div>
                        </div>
                    )}
                </div>
            </Container>
            <DeleteData
                setConfirmDelete={setConfirmDelete}
                show={show}
                handleClose={handleClose}
            />
        </>
    );
}

export default ListProductPage;

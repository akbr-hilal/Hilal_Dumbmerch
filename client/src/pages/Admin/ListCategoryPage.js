import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "react-query";

import imgEmpty from "../../assets/emptyImg.png";
import NavAdmin from "../../components/NavAdmin";
import DeleteData from "../../components/modal/DeleteData";

import { API } from "../../config/api";

function ListCategoryPage() {
    let navigate = useNavigate();

    const title = "Category List";
    document.title = "DumbMerch | " + title;

    //Var for del category
    const [idDelete, setIdDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    //Modal confm del
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let { data: categories, refetch } = useQuery(
        "categoriesCache",
        async () => {
            const response = await API.get("/category");
            return response.data.data;
        }
    );

    const addCategory = () => {
        navigate("/add-category");
    };

    const handleEdit = id => {
        navigate("/edit-category/" + id);
    };

    const handleDelete = id => {
        setIdDelete(id);
        handleShow();
    };

    const deleteById = useMutation(async id => {
        try {
            await API.delete(`/category/${id}`);
            refetch();
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
        <div>
            <NavAdmin />
            <Container className="mt-3">
                <h2 className="fw-bold text-center text-orange mb-2">
                    Your Category List
                </h2>
                <div className="text-end mb-4">
                    <button className="btn btn-success" onClick={addCategory}>
                        Add Category
                    </button>
                </div>
                <div>
                    {categories?.length !== 0 ? (
                        <Table
                            striped
                            bordered
                            size="lg"
                            className="align-middle rounded"
                            responsive="sm"
                        >
                            <thead className="bg-product">
                                <tr className="bg-product">
                                    <th className="text-center" width="20px">
                                        No
                                    </th>
                                    <th className="text-center">
                                        Name Category
                                    </th>
                                    <th className="text-center" width="232px">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {index + 1}
                                        </td>
                                        <td className="text-start">
                                            {item.name}
                                        </td>
                                        <td className="text-center">
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
                            <div className="mt-3">No data category</div>
                        </div>
                    )}
                </div>
            </Container>
            <DeleteData
                setConfirmDelete={setConfirmDelete}
                show={show}
                handleClose={handleClose}
            />
        </div>
    );
}

export default ListCategoryPage;

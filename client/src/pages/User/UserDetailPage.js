import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import { useMutation, useQuery } from "react-query";
import convertRupiah from "rupiah-format";

import NavUser from "../../components/NavUser";
import { API } from "../../config/api";

function UserDetailPage() {
    const title = "Detail Product";
    document.title = "DumbMerch | " + title;

    let { id } = useParams();
    let navigate = useNavigate();

    let { data: product } = useQuery("productsCache", async () => {
        const response = await API.get("/products/" + id);
        return response.data.data;
    });
    console.log(product)

    useEffect(() => {
        //change this to the script source you want to load, for example this is snap.js sandbox env
        const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
        //change this according to your client-key
        const myMidtransClientKey = "SB-Mid-client-R1bcjtDE-GWjLVLw";
      
        let scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        // optional if you want to set script attribute
        // for example snap.js have data-client-key attribute
        scriptTag.setAttribute("data-client-key", myMidtransClientKey);
      
        document.body.appendChild(scriptTag);
        return () => {
            document.body.removeChild(scriptTag);
        };
      }, []);


    const handleBuy = useMutation(async (e) => {
        try {
            e.preventDefault()

             // Configuration
             const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const data = {
                idProduct: product.id,
                idSeller: product.idUser,
                price: product.price,
            };
            console.log(data)
            // Data body
            const body = JSON.stringify(data);

            // Insert transaction data
            const response = await API.post("/transactions", body, config);
            console(response.payment.token)

            const token = response.payment.token

            window.snap.pay(token, {
                onSuccess: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile-user");
                },
                onPending: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                    navigate("/profile-user");
                },
                onError: function (result) {
                    /* You may add your own implementation here */
                    console.log(result);
                },
                onClose: function () {
                    /* You may add your own implementation here */
                    alert("you closed the popup without finishing the payment");
                },
              });
        } catch (error) {
            console.log(error);
        }
    });

   
    return (
        <div>
            <NavUser />
            <Container className="mt-5">
                <Row>
                    <Col>
                        <img src={product?.img} alt="" />
                    </Col>
                    <Col>
                        <div className="header-product text-orange">
                            <h2 className="fw-bold m-0"> {product?.name} </h2>
                            <p>
                                <small>
                                    Stock :
                                    <span className="fw-bold">
                                        {product?.qty}
                                    </span>
                                </small>
                            </p>
                        </div>
                        <div className="description-product mt-5">
                            {product?.desc}
                        </div>
                        <div className="my-5">
                            <div className="text-orange fs-4 fw-bold">
                                Price:
                            </div>
                            {convertRupiah.convert(product?.price)}
                        </div>
                        <div className="d-flex justify-content-center mt-5">
                            <button
                                className="btn btn-orange col-5"
                                onClick={(e) => handleBuy.mutate(e)}
                            >
                                Buy Now
                            </button>
                            <button className="btn btn-outline-orange text-orange ms-3 col-5" onClick={(e) => handleBuy.mutate(e)}>
                                Add Wishlist
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default UserDetailPage;

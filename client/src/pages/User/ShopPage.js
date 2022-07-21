import React, { useEffect, useState } from "react";
import { Container, Card} from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import { API } from "../../config/api";
import { useMutation, useQuery } from "react-query";
import NavUser from "../../components/NavUser";
import convertRupiah from "rupiah-format";

import imgEmpty from "../../assets/emptyImg.png";

function ShopPage() {

    const title = "Shop";
    document.title = "DumbMerch | " + title;
    
    // let navigate = useNavigate()
    // let {id} = useParams()
    const [products, setProducts] = useState([])
    const [searchBar, setSearchBar] = useState("")
    
    let getProducts = async() => {
        const response = await API.get("/products");
        setProducts(response.data.data)
    }

    useEffect(() => {
        getProducts()
    }, [])

    const data = products.filter(items => [items.id]).map(filterItem => {
        return {
            idProduct: filterItem.id,
            idSeller: filterItem.idUser,
            price: filterItem.price
        }
    }) 
    
    console.log(data)

    console.log(products)

    const handleBuy = useMutation(async (e) => {
        try {
            e.preventDefault()

            // Set Config
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }
            
            const data = products.filter(items => items.id).map(filterItem => {
                console.log(filterItem)
                return {
                    idProduct: filterItem.id,
                    idSeller: filterItem.idUser,
                    price: filterItem.price
                }
            })
        

            //Data body
            // const body = JSON.stringify(data)

            // Insert transaction data
            // const response = await API.post("/transactions", body, config)
            // console.log(response)

            // navigate("/profile-user")
        } catch (error) {
            console.log(error)
        }
    })

    
    return (
        <div>
            <NavUser />
            <Container className="pt-3">
                {/* Search */}
                <div className="d-flex justify-content-center">
                    <div className="col-5 mb-3">
                        <input type="text" placeholder="Enter a Product Name ..." className="form-control rounded" onChange={(e) => {setSearchBar(e.target.value)}}/>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-4 d-flex justify-content-center">
                    <div>
                        <button className="btn btn-orange">All</button>
                    </div>
                    <div>
                        <button className="btn btn-outline-orange ms-3">
                            Mouse
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-outline-orange ms-3">
                            Keyboard
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-outline-orange ms-3">
                            Monitor
                        </button>
                    </div>
                </div>

                {/* Product Card */}
                <div>
                    {products?.length !== 0 ? (
                        <>
                            <div className="row row-cols-md-4 row-cols-2 d-md-flex">
                                {products?.filter((item) => {
                                    if(searchBar === ""){
                                        return item
                                    } else if (item.name.toLowerCase().includes(searchBar.toLowerCase())){
                                        return item
                                    }
                                }).map((item, index) => (
                                    <div className="col mb-4" key={index}>
                                        <Card style={{ maxWidth: "16rem" }} className="bg-white shadow" >
                                            <Card.Img src={item.img}/>
                                            <Card.Body>
                                                <Card.Title>
                                                    <Link
                                                        to={`/products/` + item.id}
                                                        className="fw-bold text-decoration-none text-orange-shop"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                </Card.Title>
                                                <Card.Text>
                                                    {convertRupiah.convert(item.price)} <br />
                                                    Stock: {item.qty}
                                                </Card.Text>
                                            </Card.Body>
                                            <button className="btn btn-orange mb-2 mx-4" onClick={(e) => handleBuy.mutate(e, item.id)}>Buy Now</button>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div>
                            <div className="text-center pt-5 d-flex justify-content-center align-items-center">
                                <div>
                                    <img
                                        src={imgEmpty}
                                        className="img-fluid"
                                        style={{ width: "250px" }}
                                        alt="empty"
                                    />
                                    <div className="mt-3 fs-2">No data product</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default ShopPage;

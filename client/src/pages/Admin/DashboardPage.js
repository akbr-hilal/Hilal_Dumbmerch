import React, { useEffect, useState } from 'react'
import {Container} from 'react-bootstrap'
import dateFormat from 'dateformat';
import rupiahFormat from "rupiah-format";

import imgEmpty from "../../assets/emptyImg.png";
import NavAdmin from "../../components/NavAdmin";
import { API } from '../../config/api';

function DashboardPage() {
    const title = "Dashboard";
    document.title = "DumbMerch | " + title;

    const [seller, setSeller] = useState([])

    const getTransactionSeller = async () => {
        const response = await API.get("/transactions-seller")
        setSeller(response.data.data)
    }

    useEffect(() => {
        getTransactionSeller()
    }, [])

    return (
        <div>
            <NavAdmin />
            <Container className="pt-4">
                <h2 className="fw-bold text-orange text-center">Dashbord</h2>
                <div>
                    <h4>Your Seller</h4>
                    {seller?.length !== 0 ? (
                        <>
                        {seller?.map((item, index) => (
                            <div className="d-lg-flex p-3 shadow rounded mb-4" key={index}>
                                <div>
                                    <img src={item.product.img} className="card-img-top" alt="" style={{ width: "8rem" }}/>
                                </div>
                                <div className="ms-3 col-8">
                                    <h3 className="fw-bold text-orange my-0">{item.product.name}</h3>
                                    <small>Tanggal: {dateFormat(item.createdAt, 'dddd, dd mmm yyyy')}</small>
                                    <div className="mb-0 mt-2">Price: {rupiahFormat.convert(item.price)}</div>
                                    <div className="fw-semibold mt-5 mb-0 fs-5 text-orange">Sub Total: {rupiahFormat.convert(item.price)}</div>
                                </div>
                                <div className='d-flex align-items-end'>
                                    <div> Status: <span className={`status-transaction-${item.status} rounded px-3 py-1`}>{item.status}</span></div>
                                </div>
                            </div>
                        ))}
                    </>
                    ) : (
                        <div className="text-center pt-5">
                        <img
                            src={imgEmpty}
                            className="img-fluid"
                            style={{ width: "180px" }}
                            alt="empty data"
                        />
                        <div className="mt-3">No data transaction</div>
                    </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default DashboardPage
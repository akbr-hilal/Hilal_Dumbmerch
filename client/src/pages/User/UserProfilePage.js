import React, { useContext, useState } from 'react'
import { Col, Container, Row } from "react-bootstrap";
import { useQuery } from 'react-query';
import dateFormat from 'dateformat';
import rupiahFormat from "rupiah-format";
import { useNavigate } from 'react-router-dom';

import { API } from '../../config/api';
import { UserContext } from '../../context/userContext';
import AvatarBlank from "../../assets/AvatarBlank.jpg"
import NavUser from '../../components/NavUser'
import imgEmpty from "../../assets/emptyImg.png";


function UserProfilePage() {
    const title = "Profile"
    document.title = "DumbMerch | " + title;

    let navigate = useNavigate()

    const [state, dispatch] = useContext(UserContext)

    let {data: profile, refetch: profileRefetch} = useQuery('profileCache', async () => {

        const config = {
            headers: {
                Authorization: "Basic " + localStorage.token,
            },
        };

        const response = await API.get("/profile", config)
        console.log(response.data.data)
        return response.data.data
    })
    
    let { data: transaction } = useQuery('transactionsCache', async () => {
        const response = await API.get('/transactions');
        return response.data.data;
      });

      const handleEdit = id => {
        navigate("/edit-profile/user/" + id);
    };

      const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/")
      }

    return (
        <div>
            <NavUser />
            <Container className="pt-4">
                <Row>
                    <Col>
                        <Row>
                            <Col>
                                <img src={profile?.img ? profile.img : AvatarBlank} alt="ProfileIMG" className="card-img-top rounded" />
                            </Col>
                            <Col>
                                <h5 className="fw-bold text-orange">Name</h5>
                                <p>{state.user.name}</p>

                                <h5 className="fw-bold text-orange">Email</h5>
                                <p>{state.user.email}</p>

                                <h5 className="fw-bold text-orange">Phone</h5>
                                <p>{profile?.phone ? profile.phone : "-"}</p>

                                <h5 className="fw-bold text-orange">Gender</h5>
                                <p>{profile?.gender ? profile.gender : '-'}</p>

                                <h5 className="fw-bold text-orange">Address</h5>
                                <p>{profile?.address ? profile.address : '-'}</p>

                                
                            </Col>
                            <div className="mt-5 text-center">
                                    <button className="btn btn-orange col-12 col-lg-5 mb-3 mb-lg-0" onClick={() => {handleEdit(state?.user?.id)}}>Edit Profile</button>
                                    <button className="btn btn-danger col-12 col-lg-5 ms-0 ms-lg-2" onClick={logout}>Logout</button>
                            </div>
                        </Row>
                    </Col>
                    <Col>
                        <h2 className="text-orange fw-semibold">Transaction</h2>
                        {transaction?.length !== 0 ? (
                            <>
                                {transaction?.map((item, index) => (
                                    <div className="d-flex p-3 shadow rounded mb-4" key={index}>
                                        <div className='col-3'>
                                            <img src={item.product.img} className="card-img-top" alt="" style={{ width: "8rem" }}/>
                                        </div>
                                        <div className="ms-2 col-7">
                                            <small>Order ID: {item.id}</small>
                                            <h3 className="fw-bold text-orange my-0">{item.product.name}</h3>
                                            <small>{dateFormat(item.createdAt, 'dddd, dd mmm yyyy')}</small>
                                            <div className="mb-0 mt-2">Price: {rupiahFormat.convert(item.price)}</div>
                                            <div className="fw-semibold mt-5 mb-0 fs-5 text-orange">Sub Total: {rupiahFormat.convert(item.price)}</div>
                                        </div>
                                        <div className='col-2'>
                                            <div className="text-center mb-3"> 
                                                Status:
                                            </div>
                                            <div className={`status-transaction-${item.status} rounded h-75 d-flex align-items-center justify-content-center`}>
                                                {item.status}
                                            </div>
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
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default UserProfilePage
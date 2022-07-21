import React, { useContext } from 'react'
import { Col, Container, Row } from "react-bootstrap";
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import NavAdmin from '../../components/NavAdmin'
import AvatarBlank from "../../assets/AvatarBlank.jpg"
import { UserContext } from '../../context/userContext';
import { API } from '../../config/api';

function AdminProfile() {
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

    console.log(profile)


    const handleEdit = id => {
        navigate("/edit-profile/admin/" + id);
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
        <NavAdmin />
        <Container className="pt-4">
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

                    <div className="mt-5 text-center">
                        <button className="btn btn-orange col-12 col-lg-5 mb-3 mb-lg-0" onClick={() => {handleEdit(state?.user?.id)}}>Edit Profile</button>
                        <button className="btn btn-danger col-12 col-lg-5 ms-0 ms-lg-2" onClick={logout}>Logout</button>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default AdminProfile
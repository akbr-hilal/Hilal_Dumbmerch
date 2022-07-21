 import React, { useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {Routes, Route, useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext";

// Import Page
import {
    Home,
    Auth,
    DashboardPage,
    AdminChatPage,
    ListProductPage,
    ListCategoryPage,
    AdminProfilePage,
    AddProduct,
    AddCategory,
    EditProduct,
    EditCategory,
    EditProfile,
    ShopPage,
    UserWishlistPage,
    UserProfilePage,
    UserChatPage,
    UserDetailPage,
    UserEditProfile,
} from "./pages";

// import API & setAuthToken
import { API, setAuthToken } from "./config/api";

// Init token on axios
if (localStorage.token){
    setAuthToken(localStorage.token)
}

function App() {
    let navigate = useNavigate()
    const [state, dispatch] = useContext(UserContext)
    // console.clear()
    console.log(state)

    useEffect(() => {
        if (localStorage.token){
            setAuthToken(localStorage.token)
        }
        
        // Redirect Auth
        if (state.isLogin === false) {
            navigate("/")            
        } else {
            if (state.user.status === "admin") {
                navigate("/dashboard")
            } else if(state.user.status === "user") {
                navigate("/shop")
            }
        }
    }, [state])

    const checkUser = async() => {
        try {
            const response = await API.get("/check-auth")
            
            //  If token incorrect
            if(response.status === 404){
                return dispatch({
                    type: "AUTH_ERROR"
                })
            }
            
            //Get User
            let payload = response.data.data.user
            //Get Token
            payload.token = localStorage.token

            //Send data to useContext
            dispatch({
                type: "USER_SUCCESS",
                payload
            })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (localStorage.token) {
            checkUser();
        }
    }, []);

    return (
        <>
            <Routes>
                <Route exact path="/" element={<Home />} />
                <Route exact path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/chat-admin" element={<AdminChatPage />} />
                <Route path="/list-product" element={<ListProductPage />} />
                <Route path="/list-category" element={<ListCategoryPage />} />
                <Route path="/profile-admin" element={<AdminProfilePage />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
                <Route path="/add-category" element={<AddCategory />} />
                <Route path="/edit-category/:id" element={<EditCategory />} />
                <Route path="/edit-profile/admin/:id" element={<EditProfile />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/wishlist" element={<UserWishlistPage />} />
                <Route path="/profile-user" element={<UserProfilePage />} />
                <Route path="/chat-user" element={<UserChatPage />} />
                <Route path="/products/:id" element={<UserDetailPage />} />
                <Route path="/edit-profile/user/:id" element={<UserEditProfile />} />

            </Routes>
        </>
    );
}

export default App;

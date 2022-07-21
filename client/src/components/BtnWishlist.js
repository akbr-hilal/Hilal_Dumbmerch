import React from "react";

function BtnWishlist() {
    return (
        <>
            <button className={"btn btn-success me-4 mb-2 col-5"}>
                Buy Now
            </button>
            <button className={"btn btn-outline-danger mb-2 col-5"}>
                Delete
            </button>
            <button className={"btn btn-orange col-11"}>View Product</button>
        </>
    );
}

export default BtnWishlist;

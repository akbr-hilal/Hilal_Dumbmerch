import React from "react";
import BtnWishlist from "./BtnWishlist";

function WishlistProduct({ item }) {
    return (
        <>
            <tr>
                <td className="text-center">{item.id}</td>
                <td>{item.title}</td>
                <td>{item.price}</td>
                <td className="text-center"><BtnWishlist /></td>
            </tr>
        </>
    );
}

export default WishlistProduct;

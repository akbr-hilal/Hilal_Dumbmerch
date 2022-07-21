import React from "react";
import { Container, Table } from "react-bootstrap";
import NavUser from "../../components/NavUser";
import { product } from "../../fakeData/Data";
import WishlistProduct from "../../components/WishlistProduct";

function UserWishlistPage() {
    return (
        <div>
            <NavUser />
            <Container className="mt-3">
                <h2 className="fw-bold text-orange text-center mb-3">
                    Your Wishlist
                </h2>
                <Table
                    bordered
                    size="lg"
                    className="align-middle rounded"
                    responsive="sm"
                >
                    <thead className="bg-product">
                        <tr className="fw-bold">
                            <th className="text-center" width="60px">
                                No ID
                            </th>
                            <th className="text-center">Name Product</th>
                            <th className="text-center" width="232px">
                                Price
                            </th>
                            <th className="text-center" width="300px">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.map(item => (
                            <WishlistProduct item={item} key={item.id} />
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default UserWishlistPage;

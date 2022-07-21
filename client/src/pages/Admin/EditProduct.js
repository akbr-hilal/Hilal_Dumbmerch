import React, { useEffect, useState }from 'react'
import { Container, Form, Alert } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import CheckBox from '../../components/form/CheckBox'
import NavAdmin from '../../components/NavAdmin'
import { API } from '../../config/api'

function EditProduct() {
    const title = "Edit Product"
    document.title = "DumbMerch | " + title

    let navigate = useNavigate()
    const { id } = useParams();

    const [mss, setMss] = useState(null);
    const [categories, setCategories] = useState([])
    const [categoryId, setCategoryId] = useState([])
    const [preview, setPreview] = useState(null)
    const [product, setProduct] = useState({})
    
    const [form, setForm] = useState({
        img: "",
        name: "",
        desc: "",
        price: "",
        qty: "",
    })

    // Fetching data product by id form db
    let {data: products, refetch } = useQuery("productsCache", async () => {
        const response = await API.get("/products/" + id );
        return response.data.data
    });

    // Fetching data category all from db
    let {data: categoriesData, refetch: refetchCategories} = useQuery("categoriesCache", async () => {
        const response = await API.get("/category");
        setCategories(response.data.data)
    });

    useEffect(() => {
        if(products) {
            setPreview(products.img)
            setForm({
                ...form,
                name: products.name,
                desc: products.desc,
                price: products.price,
                qty: products.qty
            })
            setProduct(products)
        }

        if(categoriesData){
            setCategories(categoriesData)
        }
    }, [products])


    // Handle select category
    const handleChangeCategoryId = (e) => {
        const id = e.target.value
        const checked = e.target.checked

        if(checked === true){
            setCategoryId([...categoryId, parseInt(id)])
        } else { 
            let newCategoryId = categoryId.filter(categoryIdItem => { 
                return categoryIdItem !== id
            })
            console.log(newCategoryId)
            setCategoryId(newCategoryId)
        }
    }

    // Handle Change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: 
                e.target.type === "file" ? e.target.files : e.target.value,
        });

        // Create URL image for preview image
        if(e.target.type === "file"){
            let url = URL.createObjectURL(e.target.files[0])
            setPreview(url)
        }
    }

    // Handle Submit
    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault()

            // set config
            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                }
            }

            // Store data with FormData
            const formData = new FormData()
            if(form.img){
                formData.set("img", form?.img[0], form?.img[0]?.name)
            }
            formData.set("name", form.name);
            formData.set("desc", form.desc);
            formData.set("price", form.price);
            formData.set("qty", form.qty);
            formData.set("categoryId", categoryId);
            console.log(form);
            console.log(formData);

            // Insert update product Data
            const response = await API.patch('/products/' + product.id, formData, config);
            console.log(response);
            console.log(response.data);
            console.log(response.data.data);

            navigate("/list-product")
        } catch (error) {
            console.log(error)
            const alert = (
                <Alert variant="danger" style={{width: "400px"}}>
                    Add Product Error
                </Alert>
            );
            setMss(alert);
        }
    })

    useEffect(() => {
        const newCategoryId = product?.categories?.map((item) => {
            return (item.id)
        })
        setCategoryId(newCategoryId)
    }, [product])
    
    return (
        <>
            <NavAdmin />
            <Container className="mt-3">
                <h2 className="fw-bold text-center text-orange mb-2">
                    Edit Your Product
                </h2>
                <div className="d-flex justify-content-center">
                    {mss && mss}
                </div>
                <div className="d-flex justify-content-center">
                    <Form style={{ width: "600px" }} onSubmit={(e) => handleSubmit.mutate(e)}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name">Product Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Product Name" id="name" name="name" onChange={handleChange} value={form?.name} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="desc">Product Description</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter Product Description" rows={3} id="desc" name="desc" onChange={handleChange} value={form?.desc} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="price">Product Price</Form.Label>
                            <Form.Control type="number" placeholder="Enter Product Price (Rp.)" id="price" name="price" onChange={handleChange} value={form?.price} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="stock">Product Stock</Form.Label>
                            <Form.Control type="number" placeholder="Enter Product Stock" id="stock" name="qty" onChange={handleChange} value={form?.qty} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Category</Form.Label>
                            <div>
                                {product && categories?.map((item, index) => (
                                    <label key={index} className="checkbox-inline me-4">
                                        <CheckBox categoryId={categoryId} value={item?.id} handleChangeCategoryId={handleChangeCategoryId}/>
                                        <span className="ms-2">{item?.name}</span>
                                    </label>
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-5">
                            {preview && (
                                <div>
                                    <img src={preview} style={{ maxWidth: "150px", objectFit: "cover", }} alt="preview" />
                                </div>
                            )}
                            <Form.Label htmlFor="upload">Upload Image Product</Form.Label>
                            <Form.Control type="file" id="upload" name="img" onChange={handleChange} />
                        </Form.Group>
                        <div className="text-end">
                            <button type="submit" className="btn btn-success col-5 mb-3">Save</button>
                        </div>
                    </Form>

                </div>

            </Container>
        </>
    )
}

export default EditProduct
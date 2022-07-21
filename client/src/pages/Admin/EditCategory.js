import React, { useEffect, useState } from 'react'
import { Container, Form } from 'react-bootstrap'
import { useMutation, useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import NavAdmin from '../../components/NavAdmin'
import { API } from '../../config/api'

function EditCategory() {
    let title = "Edit Category"
    document.title = "DumbMerch | " + title

    let navigate = useNavigate()
    let { id } = useParams()

    // Create variabel for store categories
    const [category, setCategory] = useState({name: ""})

    // Fetching category
    let { data: categoryData } = useQuery("categoryCache", async() => {
      const response = await API.get("/category/" + id)
      return response.data.data.name
    })

    useEffect(() => {
      if(categoryData){
        console.log(categoryData)
        setCategory({ name: categoryData })
      }
    }, [categoryData])

    // Function handle value form
    const handleChange = (e) => {
      setCategory({
        ...category,
        name: e.target.value
      })
    }

    // Function handle submit form
    const handleSubmit = useMutation(async (e) => {
      try {
        e.preventDefault()

        const config = {
          headers: {
            "Content-type": "application/json"
          }
        }

        const body = JSON.stringify(category)

        await API.patch("/category/" + id, body, config)

        navigate("/list-category")
      } catch (error) {
        console.log(error)
      }
    })
  return (
    <div>
        <NavAdmin />
        <Container className="mt-3">
          <h2 className="fw-bold text-center text-orange mb-2">
              Edit Your Category
          </h2>
          <div className="d-flex justify-content-center">
              <Form style={{ width: "600px" }} onSubmit={(e) => handleSubmit.mutate(e)}>
                  <Form.Group className="mb-3" controlId="formGroupTitle">
                      <Form.Label>Category Name</Form.Label>
                      <Form.Control
                          type="text"
                          placeholder="Enter Category Name"
                          name="category"
                          value={category.name}
                          onChange={handleChange}
                      />
                  </Form.Group>
                  <div className="text-end">
                      <button className="btn btn-success col-5 mb-3">
                      Submit
                      </button>
                  </div>
              </Form>
          </div>
        </Container>
    </div>
  )
}

export default EditCategory
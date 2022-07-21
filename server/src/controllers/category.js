const {category, productcategory} = require("../../models")

// ADD CATEGORY
exports.addCategory = async(req, res) => {
    try {
        const newCategory = await category.create(req.body)

        res.status(200).send({
            status: "success",
            message: "Add Category Success",
            data: {
                id: newCategory.id,
                name: newCategory.name
            }
        })
    } catch (error) {
        console.log(error)
        
        res.status(400).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

// GET CATEGORY ALL
exports.getCategories = async(req, res) => {
    try {
        const data = await category.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        })

        res.status(200).send({
            status: "success",
            message: "List Category",
            data,
        })
    } catch (error) {
        console.log(error)

        res.status(400).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

// GET CATEGORY BY ID
exports.getCategory = async (req, res) => {
    try {
        const {id} = req.params
        const data = await category.findOne({
            where: {id},
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        })
        res.status(200).send({
            status: "success",
            message: `List category by id ${id}`,
            data
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
    try {
        const {id} = req.params
        const editCategory = await category.update(req.body, {
            where: {id},
        });
        res.status(200).send({
            status: "success",
            message: `Update data category id: ${id} finished`,
            data: {
                id: editCategory.id,
                name: editCategory.name
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

// DELETE CATEGORY
exports.delCategory = async(req, res) => {
    try {
        const {id} = req.params;

        await category.destroy ({
            where: {id}
        })
        
        await productcategory.destroy({
            where: {IdCategory: id}
        })
        res.status(200).send({
            status: "success",
            message: `Delete category id: ${id} success`
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: "failed",
            message: "Server Error"
        })
    }
}

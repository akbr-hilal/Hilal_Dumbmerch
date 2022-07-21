const { product, user, category, productcategory } = require("../../models");
const cloudinary = require("../utils/cloudinary")

// GET PRODUCT ALL
exports.getProducts = async (req, res) => {
    try {
        let data = await product.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["id", "password", "createdAt", "updatedAt"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: productcategory,
                        as: "bridge",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = data.map(item => {
            return {
                ...item,
                img: process.env.PATH_FILE + item.img,
            };
        });

        res.status(200).send({
            status: "success",
            message: "List Product",
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

// GET PRODUCT BY ID
exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let data = await product.findOne({
            where: { id },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["id", "password", "createdAt", "updatedAt"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: productcategory,
                        as: "bridge",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            img: process.env.PATH_FILE + data.img,
        };

        res.status(200).send({
            status: "success",
            message: `List Product by ${id}`,
            data,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

// ADD PRODUCT
exports.addProduct = async (req, res) => {
    try {
        let { categoryId } = req.body;

        if(categoryId){
            categoryId = categoryId.split(',');
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "dumb_merch",
            use_filename: true,
            unique_filename: false,
        })

        const data = {
            name: req.body.name,
            desc: req.body.desc,
            price: req.body.price,
            qty: req.body.qty,
            img: result.public_id,
            idUser: req.user.id
        }

        let newProduct = await product.create(data);

        if (categoryId) {
            const productCategoryData = categoryId.map((item) => {
                return {idProduct: newProduct.id, idCategory: parseInt(item)}
            })
            await productcategory.bulkCreate(productCategoryData)
        }

        let productData = await product.findOne({
            where: {
                id: newProduct.id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "category",
                    through: {
                        model: productcategory,
                        as: "bridge",
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        productData = JSON.parse(JSON.stringify(productData));

        res.status(200).send({
            status: "success",
            message: "add data product finished",
            data: {
                ...productData,
                img: process.env.PATH_FILE + productData
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let { categoryId } = req.body
        categoryId = await categoryId.split(",")

        const data = {
            name: req?.body?.name,
            desc: req?.body?.desc,
            price: req?.body?.price,
            img: req?.file?.filename,
            qty: req?.body?.qty,
            idUser: req?.user?.id
        }

        await productcategory.destroy({
            where: {
                idProduct: id
            }
        })

        let productCategoryData = []
        if(categoryId !== 0 && categoryId[0] !== ''){
            productCategoryData = categoryId.map((item) => {
                return{
                    idProduct: parseInt(id),
                    idCategory: parseInt(item)
                }
            })
        }
        if(productCategoryData.length !== 0){
            await productcategory.bulkCreate(productCategoryData)
        }

        await product.update(data, {
            where: { id },
        });
        res.status(200).send({
            status: "success",
            message: `Update data product ${id} finished`,
            data: {
                id,
                data,
                productCategoryData,
                img: req?.file?.filename
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

// DELETE PRODUCT
exports.delProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await product.destroy({
            where: { id },
        });
        await productcategory.destroy({
            where: {idProduct: id}
        })
        res.status(200).send({
            status: "success",
            message: `Delete product id ${id} success`,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

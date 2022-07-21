const { user, profile, product, transaction } = require("../../models");

exports.addUser = async (req, res) => {
    try {
        await user.create(req.body);

        res.status(200).send({
            status: "success",
            message: "add data user finished",
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        let users = await user.findAll({
            include: [
                {
                    model: profile,
                    as: "profile",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "idUser"],
                    },
                },
                {
                    model: product,
                    as: "product",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "idUser", "id"],
                    },
                },
                {
                    model: transaction,
                    as: "sellerTransactions",
                    attributes: {
                        exclude: [
                            "idSeller",
                            "createdAt",
                            "updatedAt",
                            "idUser",
                        ],
                    },
                },
                {
                    model: transaction,
                    as: "buyerTransactions",
                    attributes: {
                        exclude: [
                            "idBuyer",
                            "createdAt",
                            "updatedAt",
                            "idUser",
                        ],
                    },
                },
            ],
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
        });

        users = JSON.parse(JSON.stringify(users))

        users = users.map((item) =>{
            return {
                ...item,
                img: process.env.PATH_FILE + item.profile.img
            }
        })

        res.status(200).send({
            status: "success",
            message: "List Users",
            users,
        });

    } catch (error) {
        
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const users = await user.findAll({
            where: { id },
            include: [
                {
                    model: profile,
                    as: "profile",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "idUser", "id"],
                    },
                },
                {
                    model: product,
                    as: "product",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "idUser", "id"],
                    },
                },
                {
                    model: transaction,
                    as: "sellerTransactions",
                    attributes: {
                        exclude: [
                            "idSeller",
                            "createdAt",
                            "updatedAt",
                            "idUser",
                            "id",
                        ],
                    },
                },
                {
                    model: transaction,
                    as: "buyerTransactions",
                    attributes: {
                        exclude: [
                            "idBuyer",
                            "createdAt",
                            "updatedAt",
                            "idUser",
                            "id",
                        ],
                    },
                },
            ],
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            },
        });
        res.status(200).send({
            status: "success",
            message: "List Users by Id",
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        await user.update(req.body, {
            where: { id },
        });
        res.status(200).send({
            status: "success",
            message: `Update data user id ${id} finished`,
            data: req.body,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.delUser = async (req, res) => {
    try {
        const id = req.params.id;
        await user.destroy({
            where: { id },
        });

        res.status(200).send({
            status: "success",
            message: `Delete data user id ${id} finished`,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

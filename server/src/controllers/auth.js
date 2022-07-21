const { user, profile } = require("../../models");

// Import Depedencies
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const userExist = await user.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (userExist) {
            return res.status(400).send({
                status: "failed",
                message: "Email Already",
            });
        } else {
            const newUser = await user.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                status: "user",
            });

            await profile.create({
                idUser: newUser.id,
            });

            const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);

            res.status(200).send({
                status: "success",
                message: "Register Success",
                data: {
                    name: newUser.name,
                    email: newUser.email,
                    status: newUser.status,
                    token,
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().min(5).required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).send({
            error: {
                message: error.details[0].message,
            },
        });
    }

    try {
        const userExist = await user.findOne({
            where: {
                email: req.body.email,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });

        if (!userExist) {
            return res.status(400).send({
                status: "failed",
                message: "Email not found",
            });
        } else {
            const isValid = await bcrypt.compare(
                req.body.password,
                userExist.password
            );

            if (!isValid) {
                return res.status(400).send({
                    status: "failed",
                    message: "Password Wrong",
                });
            } else {
                const token = jwt.sign(
                    { id: userExist.id },
                    process.env.TOKEN_KEY
                );

                res.status(200).send({
                    status: "success",
                    message: "Login Success",
                    data: {
                        name: userExist.name,
                        email: userExist.email,
                        status: userExist.status,
                        token,
                    },
                });
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id;
        const dataUser = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });
        if (!dataUser) {
            return res.status(404).send({
                status: "failed",
            });
        }

        res.send({
            status: "success",
            data: {
                user: {
                    id: dataUser.id,
                    name: dataUser.name,
                    email: dataUser.email,
                    status: dataUser.status,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.status({
            status: "failed",
            message: "Server Error",
        });
    }
};

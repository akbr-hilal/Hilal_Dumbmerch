const { profile } = require("../../models");

exports.getProfiles = async (req, res) => {
    try {
        const idUser = req.user.id;

        let data = await profile.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });

        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            img: data.img ? process.env.PATH_FILE + data.img : null,
        }


        res.send({
            status: "success",
            message: "List Profile",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getProfile = async(req, res) => {
    try {
        let idUser = req.user.id;

        let data = await profile.findOne({
            where: {
                idUser
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });
        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            img: data.img ? process.env.PATH_FILE + data.img : null,
        };

        res.send({
            status: "success",
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
}

exports.updateProfile = async(req, res) => {
    try {
        let {id} = req.params
        let idUser = req.user.id
        // userId = await userId.split(",")

        let data = {
            phone: req?.body?.phone,
            gender: req?.body?.gender,
            address: req?.body?.address,
            img: req?.file?.filename,
        }

        await profile.update(data, {
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });
        data = JSON.parse(JSON.stringify(data));

        data = {
            ...data,
            img: data.img ? process.env.PATH_FILE + data.img : null,
        };

        res.send({
            status: "success",
            message: `Update Data Profile by id: ${id} Finished`,
            data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
}


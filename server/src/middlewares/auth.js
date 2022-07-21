const jwt = require("jsonwebtoken");

exports.auth = (req, res, cb) => {
    const authHeader = req.header("Authorization")
    const token = authHeader && authHeader.split(' ')[1]

    console.log(token)

    if(!token){
        return res.status(401).send({
            status: "failed",
            message: "Unauthorization"
        })
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
        req.user = verified
        cb()
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: "failed",
            message: "Invalid Tokens"
        })
    }
}
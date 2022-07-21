const {transaction, product, user, profile} = require("../../models")
const convertRupiah = require("rupiah-format")
const midtransClient = require("midtrans-client");
const nodemailer = require("nodemailer")

exports.getTransactions = async(req, res) => {
    try {
        const idBuyer = req.user.id;
        let data = await transaction.findAll({
            where: {idBuyer},
            include: [
                {
                    model: product,
                    as: "product",
                    attributes: {
                        exclude: [
                            "price",
                            "qty",
                            "idUser",
                            "createdAt",
                            "updatedAt",
                            "desc"
                        ]
                    }
                },
                {
                    model: user,
                    as: "buyer",
                    attributes: {
                        exclude: [
                            "password",
                            "status",
                            "createdAt",
                            "updatedAt"
                        ]
                    }
                },
                {
                    model: user,
                    as: "seller",
                    attributes: {
                        exclude: [
                            "status",
                            "password",
                            "createdAt",
                            "updatedAt"
                        ]
                    }
                }
            ],
            attributes: {
                exclude: [
                    "idProduct",
                    "idBuyer",
                    "idSeller",
                    "updatedAt"
                ]
            }
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                product: {
                    ...item.product,
                    img: process.env.PATH_FILE + item.product.img
                }
            }
        })

        res.status(200).send({
            status: "success",
            message: "List transaction",
            data,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        })
    }
}

exports.getTransactionsSeller = async(req, res) => {
    try {
        const idSeller = req.user.id;
        let data = await transaction.findAll({
            where: {idSeller},
            include: [
                {
                    model: product,
                    as: "product",
                    attributes: {
                        exclude: [
                            "price",
                            "qty",
                            "idUser",
                            "createdAt",
                            "updatedAt",
                            "desc"
                        ]
                    }
                },
                {
                    model: user,
                    as: "buyer",
                    attributes: {
                        exclude: [
                            "password",
                            "status",
                            "createdAt",
                            "updatedAt"
                        ]
                    }
                },
                {
                    model: user,
                    as: "seller",
                    attributes: {
                        exclude: [
                            "status",
                            "password",
                            "createdAt",
                            "updatedAt"
                        ]
                    }
                }
            ],
            attributes: {
                exclude: [
                    "idProduct",
                    "idBuyer",
                    "idSeller",
                    "updatedAt"
                ]
            }
        })

        data = JSON.parse(JSON.stringify(data))

        data = data.map((item) => {
            return {
                ...item,
                product: {
                    ...item.product,
                    img: process.env.PATH_FILE + item.product.img
                }
            }
        })

        res.status(200).send({
            status: "success",
            message: "List transaction",
            data,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            status: "failed",
            message: "Server Error",
        })
    }
}

exports.addTransaction = async(req, res) => {
    try {
        let data = req.body
        
        data = {
            id: parseInt(data.idProduct + Math.random().toString().slice(3, 8)),
            ...data,
            idBuyer: req.user.id,
            status: "pending"
        }

        // Insert transaction
        const newData = await transaction.create(data)

        // Get user buyer data
        const buyerData = await user.findOne({
            where: {
                id: newData.idBuyer,
            },
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["idUser", "createdAt", "updatedAt"]
                }
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"]
            }
        })

        // Create snap API
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY
        })

        // Create parameter
        let parameter = {
            transaction_details: {
                order_id: newData.id,
                gross_amount: newData.price,
            },
            credit_card: {
                secure: true,
            },
            customer_details: {
                full_name: buyerData?.name,
                email: buyerData?.email,
                phone: buyerData?.profile?.phone,
            },
        }

        // Create transaction
        const payment = await snap.createTransaction(parameter)
        console.log(payment)

        res.status(200).send({
            status: "success",
            message: "add data transaction finished",
            payment,
            product: {
                id: data.idProduct
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

const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

const core = new midtransClient.CoreApi()

core.apiConfig.set({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
})

/**
 *  Handle update transaction status after notification
 * from midtrans webhook
 * @param {string} status
 * @param {transactionId} transactionId
 */

exports.notification = async (req, res) => {
    try {
        const statusResponse = await core.transaction.notification(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        console.log(statusResponse);

        if (transactionStatus == "capture") {
            if (fraudStatus == "challenge") {
                sendEmail("pending", orderId)
                updateTransaction("pending", orderId);
                res.status(200);
            } else if (fraudStatus == "accept") {
                sendEmail("success", orderId)
                updateProduct(orderId);
                updateTransaction("success", orderId);
                res.status(200);
            }
        } else if (transactionStatus == "settlement") {
            sendEmail("success", orderId)
            updateTransaction("success", orderId);
            res.status(200);
        } else if (transactionStatus == "cancel" || transactionStatus == "deny" || transactionStatus == "expire") {
            sendEmail("failed", orderId)
            updateTransaction("failed", orderId);
            res.status(200);
        } else if (transactionStatus == "pending") {
            sendEmail("pending", orderId)
            updateTransaction("pending", orderId);
            res.status(200);
        }
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

const updateTransaction = async (status, transactionId) => {
    await transaction.update(
        {
            status,
        },
        {
            where: {
                id: transactionId,
            },
        }
    );
};

const updateProduct = async (orderId) => {
    const transactionData = await transaction.findOne({
        where: {
            id: orderId
        }
    })

    const productData = await product.findOne({
        where: {
            id: transactionData.idProduct
        }
    })

    const qty = productData.qty - 1;
    await product.update(
        {
            qty
        },
        {
            where: {
                id: productData.id
            }
        }
    )
}

const sendEmail = async(status, transactionId) => {
    // Config service email account
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SYSTEM_EMAIL,
            pass: process.env.SYSTEM_PASSWORD,
        }
    })

    // GET TRANSACTION DATA
    let data = await transaction.findOne({
        where: {
            id: transactionId
        },
        include: [
            {
                model: user,
                as: "buyer",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "password", "status"],
                },
            },
            {
                model: product,
                as: "product",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser", "qty", "price", "desc"],
                },
            }
        ]
    })

    data = JSON.parse(JSON.stringify(data))

    data = {
        ...data,
        product: {
            ...data.product,
            img: process.env.PATH_FILE + data.product.img
        }
    }

    // Email option content
    const mailOptions = {
        from: process.env.SYSTEM_EMAIL,
        to: data.buyer.email,
        subject: "Payment Status",
        text: "Your payment is: " + status,
        html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Document</title>
                </head>
                <body>
                    <div style="text-align:center;">
                        <h2>Product payment</h2>
                        <p style="color:orangered;">Order id: ${data.id}</p>
                    </div>
                    <div>
                        <ul style="list-style-type:none;">
                            <li>Name : ${data.product.name}</li>
                            <li>Total payment: ${convertRupiah.convert(data.price)}</li>
                            <li>Status : <b><span style="color:orangered;">${status}</span></b></li>
                        </ul>  
                    </div>
                </body>
                </html>`
    }

    // Send an email if there is a change in the transaction
    if(data.status !== status){
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) throw err
            console.log("Email sent: " + info.response)

            return res.send({
                status: "Success",
                message: info.response
            })
        })
    }
}
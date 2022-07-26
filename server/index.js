// Importd .env and Express
require("dotenv").config();
const express = require("express");

const cors = require("cors")

// Import package socket.io
const http = require('http')
const {Server} = require('socket.io');

// import router
const router = require("./src/routes/routes");

const app = express();

// add after app initializations
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})
require('./src/socket')(io)

const port = 5050;

app.use(express.json());
app.use(cors())

// add end point & router
app.use("/api/v1", router);
app.use("/uploads", express.static("uploads"));

server.listen(port, () => console.log(`Server Run on port ${port}`));
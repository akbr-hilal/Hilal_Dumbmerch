const express = require("express");

const router = express.Router();

// Controllers
// Controller
const {
    addUser,
    getUsers,
    getUser,
    updateUser,
    delUser,
} = require("../controllers/user");
const {
    getProducts,
    getProduct,
    addProduct,
    updateProduct,
    delProduct,
} = require("../controllers/product");
const {
    getTransactions,
    addTransaction,
    getTransactionsSeller,
    notification,
} = require("../controllers/transaction");
const {
    addCategory,
    getCategories,
    getCategory,
    updateCategory,
    delCategory,
} = require("../controllers/category");
const { register, login, checkAuth } = require("../controllers/auth");
const { getProfiles, getProfile, updateProfile } = require("../controllers/profile");

// Middlewares
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Routes
// User
router.post("/user", addUser);
router.get("/user", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", delUser);

//Profile
router.get("/profiles/:id", auth, getProfiles)
router.get("/profile", auth, getProfile)
router.patch("/profile/:id", auth, uploadFile("img"), updateProfile)

// Category
router.post("/category", auth, addCategory);
router.get("/category", auth, getCategories);
router.get("/category/:id", auth, getCategory);
router.patch("/category/:id", auth, updateCategory);
router.delete("/category/:id", auth, delCategory);

// Product
router.get("/products", auth, getProducts);
router.get("/products/:id", auth, getProduct);
router.post("/products", auth, uploadFile("img"), addProduct);
router.patch("/products/:id", auth, uploadFile("img"), updateProduct);
router.delete("/products/:id", auth, delProduct);

//Transaction
router.get("/transactions", auth, getTransactions);
router.get("/transactions-seller", auth, getTransactionsSeller);
router.post("/transactions", auth, addTransaction);
router.post("/notification", notification);

// Register Login
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth)

module.exports = router;

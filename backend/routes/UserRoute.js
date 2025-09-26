const express = require("express");
const router = express.Router();
//Insert Model
const User = require("../models/UserModel");
//Insert User Controller
const UserController = require("../controllers/UserControllers"); 

router.get("/",UserController.getAllUsers);
router.post("/",UserController.addUser);
router.get("/:id",UserController.getById);
router.put("/:id",UserController.updateUser);
router.delete("/:id",UserController.deleteUser);
router.post("/login", UserController.loginUser);

//export
module.exports = router;
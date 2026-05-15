const {addUser} =require("../controller/userController.js")
const express =require("express");
const router = express.Router()


router.post("/create", addUser)


module.exports = router
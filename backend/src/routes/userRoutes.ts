import {
createUser,
loginUser,
getUsers,
getUserById,
updateUser,
deleteUser
} from "../controllers/userController";
import { tokenExtractor } from "../middlewares/middleware";

const express = require("express");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/all", tokenExtractor, getUsers);
router.get("/", tokenExtractor, getUserById);
router.put("/", tokenExtractor, updateUser);
router.delete("/:id", tokenExtractor, deleteUser);

module.exports = router;

import { getHabits, createHabit, updateHabit, deleteHabit } from "../controllers/habitController";
import { tokenExtractor } from "../middlewares/middleware";

const express = require("express");
const router = express.Router();

router.get("/", tokenExtractor, getHabits);
router.post("/", tokenExtractor, createHabit);
router.put("/:id", tokenExtractor, updateHabit);
router.delete("/:id", tokenExtractor, deleteHabit);

module.exports = router;

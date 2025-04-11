import { getEvents, createEvent, updateEvent, deleteEvent } from "../controllers/eventController";
import { tokenExtractor } from "../middlewares/middleware";

const express = require("express");
const router = express.Router();

router.get("/", tokenExtractor, getEvents);
router.post("/", tokenExtractor, createEvent);
router.put("/:id", tokenExtractor, updateEvent);
router.delete("/:id", tokenExtractor, deleteEvent);

module.exports = router;

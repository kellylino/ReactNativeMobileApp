import { Types } from "mongoose";
import { CustomError } from "../utils/CustomError";

const EventModel = require('../models/Event');

const getAllEvents = async (userId: Types.ObjectId) => await EventModel.find({ user_id: userId });

const createEvent = async (eventData: any) => {
    const newEvent = new EventModel(eventData);
    return await newEvent.save();
};

const updateEvent = async (eventId: Types.ObjectId, eventData: any, userId: Types.ObjectId) => {
    try {
        const event = await EventModel.findById(eventId)
        console.log("event find: ", event);
        if (!event) {
            throw new CustomError(400, "Habit not found");
        }

        if (!event.user_id.equals(userId)) {
            throw new CustomError(403, "You are not authorized to update this habit");
        }

        const updatedEvent = await EventModel.findByIdAndUpdate(
            eventId,
            { $set: eventData },
            { new: true, runValidators: true }
        );

        console.log("event updated to database: ", updatedEvent);

        return updatedEvent;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }

        throw new CustomError(500, "Internal Server Error");
    }
};

const deleteEvent = async (eventId: Types.ObjectId, userId: Types.ObjectId) => {
    const event = await EventModel.findById(eventId)
    console.log("deleted event id: ", eventId);
    if (!event.user_id.equals(userId)) {
        throw new CustomError(403, "You are not authorized to update this event");
    }
    await EventModel.findOneAndDelete(eventId);
};

export default { getAllEvents, createEvent, updateEvent, deleteEvent };
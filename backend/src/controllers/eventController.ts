import { Request, Response } from "express";
import eventService from "../services/eventService";
import { eventSchema, EventData, AuthenticatedRequest } from "../types/type";
import { z } from 'zod';
import { Types } from "mongoose";

export const getEvents = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user_id;
        const userObjectId = new Types.ObjectId(userId);
        const events = await eventService.getAllEvents(userObjectId);
        console.log("get event -> ", events);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error });
    }
};

export const createEvent = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user_id;
        const validatedData = eventSchema.parse({ ...req.body, user_id: userId }) as EventData;
        console.log("validatedData event -> ", validatedData);
        const event = await eventService.createEvent(validatedData);
        console.log("new event -> ", event);
        res.status(201).json(event);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: error.errors[0].message });
        } else {
            res.status(500).json({ message: "Error creating Event", error });
        }
    }
};

export const updateEvent = async (req: AuthenticatedRequest, res: Response) => {
    const eventId = req.params.id;
    const eventObjectId = new Types.ObjectId(eventId);

    try {
        const userId = req.user_id;
        const userObjectId = new Types.ObjectId(userId);
        const validatedData = eventSchema.partial().parse(req.body) as Partial<EventData>;
        const event = await eventService.updateEvent(eventObjectId, validatedData, userObjectId);
        //console.log("event controller: ",event);
        res.json(event);
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Validation error", errors: error.errors });
        } else {
            res.status(500).json({ message: "Error updating event", error });
        }
    }
};

export const deleteEvent = async (req: AuthenticatedRequest, res: Response) => {
    const eventId = req.params.id;
    const eventObjectId = new Types.ObjectId(eventId);

    try {
        const userId = req.user_id;
        const userObjectId = new Types.ObjectId(userId);
        await eventService.deleteEvent(eventObjectId, userObjectId);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting event", error });
    }
};

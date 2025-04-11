import { Response } from "express";
import habitService from "../services/habitService";
import { habitSchema, HabitData, AuthenticatedRequest } from "../types/type";
import { z } from 'zod';
import { CustomError } from "../utils/CustomError";
import { Types } from "mongoose";

export const getHabits = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user_id; // Extract user_id from the authenticated user
    const userObjectId = new Types.ObjectId(userId);
    const habits = await habitService.getAllHabits(userObjectId);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error fetching habits", error });
  }
};

export const createHabit = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user_id;
    const validatedData = habitSchema.parse({ ...req.body, user_id: userId }) as HabitData;
    const habit = await habitService.createHabit(validatedData);
    console.log("new habit -> ", habit);
    res.status(201).json(habit);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
};

export const updateHabit = async (req: AuthenticatedRequest, res: Response) => {
  const habitId = req.params.id;
  console.log("req: ", req.params.id);

  try {
    const userId = req.user_id;
    const userObjectId = new Types.ObjectId(userId);
    console.log("user ID: ", userObjectId);
    const validatedData = habitSchema.partial().parse(req.body) as Partial<HabitData>;
    console.log("update habit: ", validatedData);
    const habitObjectId = new Types.ObjectId(habitId);
    const habit = await habitService.updateHabit(habitObjectId, validatedData, userObjectId);
    res.json(habit);
  } catch (error: any) {
    const statusCode = error instanceof CustomError && error.status ? error.status : 500;
    const message = error.message || "Error updating habit";
    return res.status(statusCode).json({ message });
  }
};

export const deleteHabit = async (req: AuthenticatedRequest, res: Response) => {
  const habitId = req.params.id;

  try {
    const userId = req.user_id;
    const userObjectId = new Types.ObjectId(userId);
    const habitObjectId = new Types.ObjectId(habitId);
    await habitService.deleteHabit(habitObjectId, userObjectId);
    console.log("habit deleted")
    res.json({ message: "Habit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting habit", error });
  }
};


import { HabitData } from "../types/type";
import { CustomError } from "../utils/CustomError";
import { Types } from "mongoose";

const HabitModel = require('../models/Habit');

const getAllHabits = async (userId: Types.ObjectId) => await HabitModel.find({ user_id: userId });

const createHabit = async (habitData: HabitData) => {
    const newHabit = new HabitModel(habitData);
    return await newHabit.save();
};

const updateHabit = async (habitId: Types.ObjectId, habitData: Partial<HabitData>, userId: Types.ObjectId) => {
    try {
        const habit = await HabitModel.findById(habitId)

        if (!habit) {
            throw new CustomError(400, "Habit not found");
        }

        if (!habit.user_id.equals(userId)) {
            throw new CustomError(403, "You are not authorized to update this habit");
        }

        const updatedHabit = await HabitModel.findByIdAndUpdate(
            habitId,
            { $set: habitData },
            { new: true, runValidators: true }
        );

        return updatedHabit;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }

        throw new CustomError(500, "Internal Server Error");
    }
};

const deleteHabit = async (habitId: Types.ObjectId, userId: Types.ObjectId) => {
    const habit = await HabitModel.findById(habitId)
    if (!habit.user_id.equals(userId)) {
        throw new CustomError(403, "You are not authorized to update this habit");
    }
    await HabitModel.findOneAndDelete(habitId);
};

export default { getAllHabits, createHabit, updateHabit, deleteHabit };
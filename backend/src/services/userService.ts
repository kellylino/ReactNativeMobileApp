import { Types } from "mongoose";
import { UserData } from "../types/type";
import { CustomError } from "../utils/CustomError";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const UserModel = require('../models/User');
const HabitModel = require('../models/Habit');
const EventModel = require('../models/Event');

const createUser = async (userData: UserData) => {
    try {
        const existingUser = await UserModel.findOne({ email: userData.email });

        if (existingUser) {
            throw new CustomError(400, "User with this email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = new UserModel({ ...userData, password: hashedPassword });

        return await newUser.save();
    } catch (error) {
        console.log("create user service: ", error);
        if (error instanceof CustomError) {
            throw error;
        }

        throw new CustomError(500, "Internal Server Error");
    }
};

const loginUser = async (email: string, password: string) => {
    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new CustomError(400, "Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new CustomError(400, "Invalid email or password");
        }

        const token = jwt.sign({ userId: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: "365d" });

        return { token, user };

    } catch (error) {
        console.error(error);

        if (error instanceof CustomError) {
            throw error;
        }

        throw new CustomError(500, "Internal Server Error");
    }
};

const updateUser = async (id: Types.ObjectId, userData: Partial<UserData>) => {
    return await UserModel.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
    );
};

const getAllUsers = async () => await UserModel.find();

const getUserById = async (id: Types.ObjectId) => await UserModel.findById(id);

const deleteUser = async (id: Types.ObjectId) => {
    await UserModel.findByIdAndDelete(id);
    // Delete the user's habits
    await HabitModel.deleteMany({ user_id: id });
    // Delete the user's events
    await EventModel.deleteMany({ user_id: id });
};

export default { getAllUsers, getUserById, createUser, loginUser, updateUser, deleteUser };

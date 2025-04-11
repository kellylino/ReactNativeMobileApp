import { Request, Response } from "express";
import userService from "../services/userService";
import { userSchema, UserData, AuthenticatedRequest } from "../types/type";
import { z } from "zod";
import habitService from "../services/habitService";
import { defaultHabits } from "./defaultHabitsData";
import { Types } from "mongoose";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, Email and password are required" });
    }
    const defaultImageUrl = "https://habitstack.s3.eu-north-1.amazonaws.com/default_profile.png";
    const validatedData = userSchema.parse({
      ...req.body,
      profile_img: defaultImageUrl,
    }) as UserData;
    const user = await userService.createUser(validatedData);
    const userHabits = defaultHabits.map(habit => ({
      ...habit,
      user_id: user._id.toString(),
    }));

    for (const habit of userHabits) {
      await habitService.createHabit(habit);
    }
    res.status(201).json(user);
  } catch (error) {
    console.error("error", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const { token, user } = await userService.loginUser(email, password);
    res.json({ token, user });
  } catch (error: any) {
    console.error("error", error);
    const statusCode = error.status; // Fixes the issue
    const message = error.message;
    return res.status(statusCode).json({ message });
    // if (error instanceof Error) {
    //     res.status(500).json({ message: "Login failed", error: error.message });
    // } else {
    //     res.status(500).json({ message: "An unknown error occurred" });
    // }
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  // const userId = z.number().safeParse(parseInt(req.params.id));
  // if (!userId.success) {
  //     return res.status(400).json({ message: "Invalid user ID" });
  // }

  try {
    const userId = new Types.ObjectId(req.user_id);
    console.log("user ID: ", userId)
    const validatedData = userSchema.partial().parse(req.body) as Partial<UserData>; // Partial validation
    const user = await userService.updateUser(userId, validatedData);
    console.log("user controller: ", user)
    res.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.errors[0].message });
    } else {
      res.status(500).json({ message: "Error updating user", error });
    }
  }
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  //const userId = z.number().safeParse(parseInt(req.params.id));
  // if (!userId.success) {
  //     return res.status(400).json({ message: "Invalid user ID" });
  // }

  try {
    const userId = new Types.ObjectId(req.user_id);
    const user = await userService.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  // const userId = z.number().safeParse(parseInt(req.params.id));
  // if (!userId.success) {
  //     return res.status(400).json({ message: "Invalid user ID" });
  // }

  try {
    const userId = new Types.ObjectId(req.user_id);

    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // 404 means "Not Found"
    }

    await userService.deleteUser(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
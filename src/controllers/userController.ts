import { Request, Response } from "express";
import User, { IUser, Profile } from "../models/users";
import Data, { IData } from "../models/data";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../middleware/authmiddleware";

// create user
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: IUser = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Get all users

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page: number = parseInt(req.query.page as string) || 1;
  const limit: number = parseInt(req.query.limit as string) || 2;
  try {
    const users: IUser[] = await User.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    const count = await User.countDocuments().exec();
    res
      .status(200)
      .json({ users, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

// Get User by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An Unknown error occured" });
    }
  }
};

// Update a user by ID
export const updateUserByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An Unknown error occured" });
    }
  }
};

// Delete user by ID

export const deleteUserByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user: IUser | null = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(204).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An Unknown error occured" });
    }
  }
};

// Register User route
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, age } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, age });
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send("Error registering user");
  }
};

// User login route
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Cannot find user");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(403).send("Incorrect password");

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ accessToken });
  } catch (err) {
    res.status(500).send("Error logging in");
  }
};

// My profile route
export const ProfileUserData = async (req: Request, res: Response) => {
  try {
    const { tag, content } = req.body;
    const user = (req as any).user as IUser;
    const profile = new Profile({
      user,
      profile_tag: tag,
      profile_content_type: content,
    });
    await profile.save();
    res.json({ message: `Welcome ${user.name}`, profile });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const user = (req as any).user as IUser; // Assuming user information is stored in req.user after authentication

  try {
    const profile = await Profile.findOne({ user: user._id }).populate("user"); // Populate 'user' field if needed

    if (!profile) {
      return res.status(404).json({ error: "Profile Data not found" });
    }

    res.json({ profile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

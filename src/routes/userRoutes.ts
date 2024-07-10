import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUserByID,
  deleteUserByID,
  registerUser,
  loginUser,
  ProfileUserData,
  getUserProfile,
} from "../controllers/userController";
import {
  authenticateToken,
  IsAdmin,
  IsUser,
} from "../middleware/authmiddleware";

const router: Router = Router();

router.post("/users", createUser);
router.post("/register", registerUser);
router.post("/profile", authenticateToken, ProfileUserData);
router.get("/user_profile", authenticateToken, IsAdmin, getUserProfile);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserByID);
router.delete("/users/:id", deleteUserByID);

export default router;

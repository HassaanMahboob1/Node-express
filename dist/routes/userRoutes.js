"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = (0, express_1.Router)();
router.post("/users", userController_1.createUser);
router.post("/register", userController_1.registerUser);
router.post("/profile", authmiddleware_1.authenticateToken, userController_1.ProfileUserData);
router.get("/user_profile", authmiddleware_1.authenticateToken, authmiddleware_1.IsAdmin, userController_1.getUserProfile);
router.post("/login", userController_1.loginUser);
router.get("/users", userController_1.getAllUsers);
router.get("/users/:id", userController_1.getUserById);
router.put("/users/:id", userController_1.updateUserByID);
router.delete("/users/:id", userController_1.deleteUserByID);
exports.default = router;
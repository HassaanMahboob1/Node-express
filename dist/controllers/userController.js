"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.ProfileUserData = exports.loginUser = exports.registerUser = exports.deleteUserByID = exports.updateUserByID = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const users_1 = __importStar(require("../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authmiddleware_1 = require("../middleware/authmiddleware");
// create user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new users_1.default(req.body);
        yield user.save();
        res.status(201).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.createUser = createUser;
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    try {
        const users = yield users_1.default.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        const count = yield users_1.default.countDocuments().exec();
        res
            .status(200)
            .json({ users, totalPages: Math.ceil(count / limit), currentPage: page });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.getAllUsers = getAllUsers;
// Get User by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(req.params.id);
        res.status(200).json(user);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An Unknown error occured" });
        }
    }
});
exports.getUserById = getUserById;
// Update a user by ID
const updateUserByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An Unknown error occured" });
        }
    }
});
exports.updateUserByID = updateUserByID;
// Delete user by ID
const deleteUserByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findByIdAndDelete(req.params.id);
        if (user) {
            res.status(204).json(user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An Unknown error occured" });
        }
    }
});
exports.deleteUserByID = deleteUserByID;
// Register User route
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, age } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new users_1.default({ name, email, password: hashedPassword, age });
        yield user.save();
        res.status(201).send(user);
    }
    catch (err) {
        res.status(400).send("Error registering user");
    }
});
exports.registerUser = registerUser;
// User login route
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield users_1.default.findOne({ email });
        if (!user)
            return res.status(400).send("Cannot find user");
        const validPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!validPassword)
            return res.status(403).send("Incorrect password");
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, authmiddleware_1.SECRET_KEY, { expiresIn: "1h" });
        res.json({ accessToken });
    }
    catch (err) {
        res.status(500).send("Error logging in");
    }
});
exports.loginUser = loginUser;
// My profile route
const ProfileUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tag, content } = req.body;
        const user = req.user;
        const profile = new users_1.Profile({
            user,
            profile_tag: tag,
            profile_content_type: content,
        });
        yield profile.save();
        res.json({ message: `Welcome ${user.name}`, profile });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.ProfileUserData = ProfileUserData;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // Assuming user information is stored in req.user after authentication
    try {
        const profile = yield users_1.Profile.findOne({ user: user._id }).populate("user"); // Populate 'user' field if needed
        if (!profile) {
            return res.status(404).json({ error: "Profile Data not found" });
        }
        res.json({ profile });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.getUserProfile = getUserProfile;

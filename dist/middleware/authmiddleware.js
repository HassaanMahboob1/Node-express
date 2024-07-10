"use strict";
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
exports.IsUser = exports.IsAdmin = exports.authenticateToken = exports.SECRET_KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
exports.SECRET_KEY = "abcd";
// Middleware to check JWT
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res.sendStatus(401); // No token found
    try {
        const decoded = jsonwebtoken_1.default.verify(token, exports.SECRET_KEY);
        const user = yield users_1.default.findById(decoded.userId).select("-password");
        if (!user)
            return res.sendStatus(404); // User not found
        req.user = user;
        next();
    }
    catch (err) {
        return res.sendStatus(403); // Invalid token
    }
});
exports.authenticateToken = authenticateToken;
const IsAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log((_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
    if (((_c = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === "ADMIN") {
        next();
    }
    return res.status(401).send("Unauthorized!");
});
exports.IsAdmin = IsAdmin;
const IsUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === null || _b === void 0 ? void 0 : _b.toUpperCase()) === "USER") {
        next();
    }
    return res.status(401).send("Unauthorized!");
});
exports.IsUser = IsUser;

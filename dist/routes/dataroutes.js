"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dataController_1 = require("../controllers/dataController");
const authmiddleware_1 = require("../middleware/authmiddleware");
const router = (0, express_1.Router)();
router.post("/data", authmiddleware_1.authenticateToken, dataController_1.dataUser);
exports.default = router;

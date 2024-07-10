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
exports.dataUser = void 0;
const data_1 = __importDefault(require("../models/data"));
const dataUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { my_story, my_other_name, my_other_id } = req.body;
    try {
        const data = new data_1.default({ my_story, my_other_name, my_other_id });
        yield data.save();
        res.status(201).send(data);
    }
    catch (err) {
        res.status(400).send("Error creating data");
    }
});
exports.dataUser = dataUser;

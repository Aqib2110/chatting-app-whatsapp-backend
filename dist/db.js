"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageModel = exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    }
});
const messageSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    roomId: {
        type: String,
        required: true
    },
    seen: {
        type: Boolean,
        required: true
    }
});
exports.userModel = mongoose_2.default.model('User', userSchema);
exports.messageModel = mongoose_2.default.model('Message', messageSchema);

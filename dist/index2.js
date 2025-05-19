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
const ws_1 = require("ws");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const db_2 = require("./db");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const jwtSecret = "ILOVEALLAH";
dotenv_1.default.config();
app.use(express_1.default.json());
const MONGOURI = process.env.MONGOURI;
mongoose_1.default.connect(MONGOURI).then(() => {
    console.log("connected to mongodb successfully");
}).catch(() => {
    console.log("connection to mongodb is failed");
});
const wss = new ws_1.WebSocketServer({ port: 8080 });
const allSockets = [];
wss.on("connection", (socket) => {
    console.log("connected to websocket");
    socket.on("error", (err) => {
        console.log(err);
    });
    console.log(allSockets);
    socket.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        const parsedMessage = JSON.parse(message.toString());
        console.log("message jencuierhui", parsedMessage);
        const roomId = Math.ceil(Math.random() * 8999 + 1000).toString();
        if (parsedMessage.type == "join") {
            const user = allSockets.find(user => user.roomId.senderId == parsedMessage.payload.senderId && user.roomId.receiverId == parsedMessage.payload.receiverId ||
                user.roomId.senderId == parsedMessage.payload.receiverId && user.roomId.receiverId == parsedMessage.payload.senderId);
            if (user) {
                allSockets.push({
                    socket: socket,
                    roomId: {
                        senderId: parsedMessage.payload.senderId,
                        roomConnect: user.roomId.roomConnect,
                        receiverId: parsedMessage.payload.receiverId
                    }
                });
            }
            else {
                allSockets.push({
                    socket: socket,
                    roomId: {
                        senderId: parsedMessage.payload.senderId,
                        roomConnect: roomId,
                        receiverId: parsedMessage.payload.receiverId
                    }
                });
            }
        }
        else if (parsedMessage.type == "chat") {
            const room = yield db_2.messageModel.findOne({
                $or: [
                    {
                        senderId: parsedMessage.payload.senderId,
                        receiverId: parsedMessage.payload.receiverId,
                    },
                    {
                        senderId: parsedMessage.payload.receiverId,
                        receiverId: parsedMessage.payload.senderId,
                    }
                ]
            });
            if (room) {
                yield db_2.messageModel.create({
                    content: parsedMessage.payload.message,
                    senderId: parsedMessage.payload.senderId,
                    receiverId: parsedMessage.payload.receiverId,
                    roomId: room.roomId
                });
            }
            else {
                yield db_2.messageModel.create({
                    content: parsedMessage.payload.message,
                    senderId: parsedMessage.payload.senderId,
                    receiverId: parsedMessage.payload.receiverId,
                    roomId: roomId
                });
            }
            const mySocket = allSockets.find(s => s.socket == socket);
            if (!mySocket)
                return;
            const roomSockets = allSockets.filter(sock => sock.roomId.roomConnect == mySocket.roomId.roomConnect);
            roomSockets.forEach(soc => {
                soc.socket.send(JSON.stringify({
                    message: parsedMessage.payload.message,
                    senderId: parsedMessage.payload.senderId
                }));
            });
        }
    }));
    socket.on("close", () => {
        console.log("client disconnecteed");
        return allSockets.splice(0, allSockets.length, ...allSockets.filter(s => s.socket !== socket));
    });
});
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return;
    }
    else {
        try {
            yield db_1.userModel.create({
                username,
                email,
                password
            });
            res.json({
                message: "sign up successfully"
            });
        }
        catch (error) {
            res.json({
                error: error
            });
        }
    }
}));
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield db_1.userModel.findOne({
            email
        });
        if (!user) {
            res.json({
                message: "invalid credentials",
            });
            return;
        }
        else {
            if (user.password == password) {
                const token = jsonwebtoken_1.default.sign({
                    _id: user._id
                }, jwtSecret, {
                    expiresIn: '1h'
                });
                res.json({
                    message: "Login successfully",
                    token: token,
                    id: user._id
                });
            }
        }
    }
    catch (error) {
        res.json({
            error: error
        });
    }
}));
//@ts-ignore
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (decoded) {
            //@ts-ignore
            req.user = decoded;
            next();
        }
        else {
            return res.status(401).json({ error: "Invalid token" });
        }
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
    app.post("/contacts", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = req.body;
        try {
            const username = yield db_1.userModel.find({
                email: user
            });
            res.json({
                user: username
            });
        }
        catch (error) {
            res.json({
                error: error
            });
        }
    }));
};
//@ts-ignore
app.post("/mycontacts", authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { receiverId } = req.body;
        if (!receiverId) {
            return res.status(400).json({ error: "receiverId is required" });
        }
        const messages = yield db_2.messageModel.find({
            $or: [
                { senderId: receiverId },
                { receiverId: receiverId }
            ]
        })
            .populate('senderId')
            .populate('receiverId');
        if (messages.length == 0) {
            return;
        }
        const userMap = new Map();
        messages.forEach((msg) => {
            const sender = msg.senderId;
            const receiver = msg.receiverId;
            if ((sender === null || sender === void 0 ? void 0 : sender._id) && !userMap.has(sender._id.toString())) {
                userMap.set(sender._id.toString(), sender);
            }
            if ((receiver === null || receiver === void 0 ? void 0 : receiver._id) && !userMap.has(receiver._id.toString())) {
                userMap.set(receiver._id.toString(), receiver);
            }
        });
        res.json({
            messages: messages,
            users: Array.from(userMap.values())
        });
    }
    catch (error) {
        res.json({
            error: error
        });
    }
}));
app.listen(3000, () => {
    console.log("app is listening at http://localhost:3000");
});

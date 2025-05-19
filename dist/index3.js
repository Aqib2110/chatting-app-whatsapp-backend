"use strict";
// import mongoose from "mongoose";
// import jwt from 'jsonwebtoken'
// import cors from "cors";
// import { userModel } from "./db";
// import { messageModel } from "./db";
// import express, { RequestHandler } from "express";
// import dotenv from "dotenv";
// const app = express();
// app.use(cors());
// const jwtSecret = "ILOVEALLAH";
// dotenv.config();
// app.use(express.json());
// const MONGOURI = process.env.MONGOURI as string;
// mongoose.connect(MONGOURI).then(()=>{
//   console.log("connected to mongodb successfully")
// }).catch(()=>{
//   console.log("connection to mongodb is failed")
// })
// app.post("/signup",async(req,res)=>{
// const {username,email,password} = req.body;
// if(!username || !email || !password){
//   return;
// }
// else{
//   try {
//     await userModel.create({
//     username,
//     email,
//     password
//   })
//   res.json({
//     message:"sign up successfully"
//   })
// }
//   catch (error) {
//      res.json({
//     error:error
//   })
//   }
// }
// })
// app.post("/signin",async(req,res)=>{
// try {
//   const {email,password} = req.body;
// const user = await userModel.findOne({
//   email
// })
// if(!user){
//    res.json({
//       message:"invalid credentials",
//     })
//   return;
// }
// else{
// if(user.password == password)
//   {
//     const token = jwt.sign({
//     _id : user._id
//     },jwtSecret,{
//       expiresIn:'1h'
//     })
//   res.json({
//       message:"Login successfully",
//       token:token,
//       id:user._id
//     })
// }
// }
// } catch (error) {
//   res.json({
//     error:error
//   })
// }
// })
// //@ts-ignore
// const authMiddleware: RequestHandler = (req, res, next) => {
// const token = req.headers.authorization?.split(' ')[1];
// if (!token) 
// {
//   return res.status(401).json({ error: "No token provided" });
// }
// try {
//   const decoded = jwt.verify(token,jwtSecret);
//   //@ts-ignore
//  req.user = decoded;
//   next();
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
// } catch (err) {
//   return res.status(403).json({ error: "Invalid token" });
// }}
// app.post("/contacts",authMiddleware,async(req,res)=>{
//   const {user} = req.body;
// try {
//   const username = await userModel.find({
//   email:user
// })
// res.json({
//  user:username
// })
// } catch (error) {
//   res.json({
//  error:error
// })}})
// //@ts-ignore
// app.post("/mycontacts",authMiddleware, async (req, res) => {
//   try {
//      const { receiverId } = req.body;
//   if (!receiverId) {
//     return res.status(400).json({ error: "receiverId is required" });
//   }
//   const messages = await messageModel.find({
//     $or: [
//       { senderId: receiverId },
//       { receiverId: receiverId }
//     ]
//   })
//   .populate('senderId')
//   .populate('receiverId');
// if(messages.length == 0)
//   {
//   return;
// }
//   const userMap = new Map<string, any>();
//   messages.forEach((msg) => {
//     const sender = msg.senderId;
//     const receiver = msg.receiverId;
//     if (sender?._id && !userMap.has(sender._id.toString())) {
//       userMap.set(sender._id.toString(), sender);
//     }
//     if (receiver?._id && !userMap.has(receiver._id.toString())) {
//       userMap.set(receiver._id.toString(), receiver);
//     }
//   });
//   res.json({
//     messages:messages,
//     users: Array.from(userMap.values()) 
//   });
//   } catch (error) {
//      res.json({
//  error:error
// })
//   }
// });
// app.post("/chat",authMiddleware,async(req,res)=>{
//   try {
//       const {receiveid,senderid} = req.body;
//     const messages = await messageModel.find({
//     $or: [
//         {
//             senderId: senderid,
//             receiverId:receiveid,
//         },
//         {
//             senderId: receiveid,
//             receiverId:senderid,
//         }
//     ]
// })
// res.json({
//     messages:messages
// })
//   } catch (error) {
//     res.json({
//     error:error
// })
//   }
// })
// app.post("/message",authMiddleware,async(req,res)=>{
// try {
//     const {senderId,receiverId,content} = req.body;
// const roomId = Math.ceil(Math.random() * 8999 + 1000).toString();
// const room = await messageModel.findOne({
//     $or: [
//         {
//             senderId: senderId,
//             receiverId:receiverId,
//         },
//         {
//             senderId: receiverId,
//             receiverId:senderId,
//         }
//     ]
// })
// if(room)
// {
// await messageModel.create({
//     content:content,
//     senderId:senderId,
//     receiverId:receiverId,
//     roomId:room.roomId
// })
// res.json({
//     message:"chat send successfully"
// })
// }
// else{
//    await messageModel.create({
//     content:content,
//     senderId:senderId,
//     receiverId:receiverId,
//     roomId:roomId
// })
// res.json({
//     message:"chat send successfully"
// }) 
// }
// } catch (error) 
// {
//    res.json({
//     error:error
// })  
// }
// })
// app.listen(3000,()=>{
//   console.log("app is listening at http://localhost:3000")
// })
// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import dotenv from "dotenv";
// import express, { RequestHandler } from "express";
// import { userModel } from "./db";
// import { messageModel } from "./db";
// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());
// const jwtSecret = "ILOVEALLAH";
// const MONGOURI = process.env.MONGOURI as string;
// console.log(MONGOURI)
// mongoose.connect(MONGOURI).then(() => {
//   console.log("Connected to MongoDB successfully");
// }).catch((err) => {
//   console.error("Connection to MongoDB failed", err);
// });
// //@ts-ignore
// const authMiddleware: RequestHandler = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }
//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     // @ts-ignore
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: "Invalid token" });
//   }
// };
// //@ts-ignore
// app.post("/signup", async (req, res) => {
//   const { username, email, password } = req.body;
//   if (!username || !email || !password) {
//     return res.status(400).json({ error: "Missing required fields" });
//   }
//   try {
//     await userModel.create({ username, email, password });
//     res.json({ message: "Sign up successful" });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
// //@ts-ignore
// app.post("/signin", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await userModel.findOne({ email });
//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//     const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "1h" });
//     res.json({
//       message: "Login successful",
//       token,
//       id: user._id
//     });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
// app.post("/contacts", async (req, res) => {
//   const { user } = req.body;
//   try {
//     const username = await userModel.find({ email: user });
//     res.json({ user: username });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
// // Get My Contacts by Messages
// //@ts-ignore
// app.post("/mycontacts", async (req, res) => {
//   const { receiverId } = req.body;
//   if (!receiverId) {
//     return res.json({ error: "receiverId is required" });
//   }
//   try {
//     const messages = await messageModel.find({
//       $or: [
//         { senderId: receiverId },
//         { receiverId: receiverId }
//       ]
//     }).populate('senderId').populate('receiverId');
//     if (messages.length === 0) {
//       return res.json({ message: [] });
//     }
//     const userMap = new Map<string, any>();
//     messages.forEach((msg) => {
//       const sender = msg.senderId;
//       const receiver = msg.receiverId;
//       if (sender?._id && !userMap.has(sender._id.toString())) {
//         userMap.set(sender._id.toString(), sender);
//       }
//       if (receiver?._id && !userMap.has(receiver._id.toString())) {
//         userMap.set(receiver._id.toString(), receiver);
//       }
//     });
//     res.json({
//       messages,
//       users: Array.from(userMap.values())
//     });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
// app.post("/chat", async (req, res) => {
//   const { receiveid, senderid } = req.body;
//   try {
//     const messages = await messageModel.find({
//       $or: [
//         { senderId: senderid, receiverId: receiveid },
//         { senderId: receiveid, receiverId: senderid }
//       ]
//     });
//     res.json({ messages });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
// app.post("/message", async (req, res) => {
//   const { senderId, receiverId, content } = req.body;
// console.log(senderId,receiverId,content)
//   try {
//     const existingRoom = await messageModel.findOne({
//       $or: [
//         { senderId:senderId, receiverId:receiverId },
//         { senderId: receiverId, receiverId: senderId }
//       ]
//     });
//     const roomId = existingRoom ? existingRoom.roomId : Math.ceil(Math.random() * 8999 + 1000).toString();
//     await messageModel.create({
//       content,
//       senderId,
//       receiverId,
//       roomId
//     });
//     res.json({ message: "Chat sent successfully" });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });
// app.listen(3000, () => {
//   console.log("App is listening at http://localhost:3000");
// });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const db_2 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const jwtSecret = "ILOVEALLAH";
const MONGOURI = process.env.MONGOURI;
mongoose_1.default.connect(MONGOURI)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch((err) => console.error("Connection to MongoDB failed", err));
//@ts-ignore
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        //@ts-ignore
        req.user = decoded;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
};
//@ts-ignore
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        yield db_1.userModel.create({ username, email, password });
        res.status(201).json({ message: "Sign up successful" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
//@ts-ignore
app.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.userModel.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, jwtSecret, { expiresIn: "1h" });
        res.status(200).json({
            message: "Login successful",
            token,
            id: user._id
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
//@ts-ignore
app.post("/contacts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req.body;
    if (!user) {
        return res.status(400).json({ error: "User email is required" });
    }
    try {
        const username = yield db_1.userModel.find({ email: user });
        res.status(200).json({ user: username });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
//@ts-ignore
app.post("/mycontacts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiverId } = req.body;
    if (!receiverId) {
        return res.status(400).json({ error: "receiverId is required" });
    }
    try {
        const messages = yield db_2.messageModel.find({
            $or: [
                { senderId: receiverId },
                { receiverId: receiverId }
            ]
        }).populate('senderId').populate('receiverId');
        if (messages.length === 0) {
            return res.status(200).json({ message: [] });
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
        res.status(200).json({
            messages,
            users: Array.from(userMap.values())
        });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
//@ts-ignore
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { receiveid, senderid } = req.body;
    if (!receiveid || !senderid) {
        return res.status(400).json({ error: "Both receiveid and senderid are required" });
    }
    try {
        const messages = yield db_2.messageModel.find({
            $or: [
                { senderId: senderid, receiverId: receiveid },
                { senderId: receiveid, receiverId: senderid }
            ]
        });
        res.status(200).json({ messages });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
//@ts-ignore
app.post("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) {
        return res.status(400).json({ error: "senderId, receiverId and content are required" });
    }
    try {
        const existingRoom = yield db_2.messageModel.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });
        const roomId = existingRoom ? existingRoom.roomId : Math.ceil(Math.random() * 8999 + 1000).toString();
        yield db_2.messageModel.create({ content, senderId, receiverId, roomId });
        res.status(201).json({ message: "Chat sent successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
app.listen(3000, () => {
    console.log("App is listening at http://localhost:3000");
});

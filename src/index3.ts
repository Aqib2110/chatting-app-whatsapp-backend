import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { userModel } from "./db";
import { messageModel } from "./db";

dotenv.config();
const app = express();
app.use(cors());
// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin:"*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const jwtSecret = "ILOVEALLAH";
const MONGOURI = process.env.MONGOURI as string;

mongoose.connect(MONGOURI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("Connection to MongoDB failed", err));

//@ts-ignore
// const authMiddleware: RequestHandler = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "No token provided" });
//   }

//   try {
//     const decoded = jwt.verify(token, jwtSecret);
//     //@ts-ignore
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: "Invalid token" });
//   }
// };
//@ts-ignore

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await userModel.create({ username, email, password });
    res.status(201).json({ message: "Sign up successful" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//@ts-ignore

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      token,
      id: user._id
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//@ts-ignore

app.post("/contacts", async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ error: "User email is required" });
  }

  try {
    const username = await userModel.find({ email: user });
    res.status(200).json({ user: username });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//@ts-ignore

app.post("/mycontacts", async (req, res) => {
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ error: "receiverId is required" });
  }

  try {
    const messages = await messageModel.find({
      $or: [
        { senderId: receiverId },
        { receiverId: receiverId }
      ]
    }).populate('senderId').populate('receiverId');

    if (messages.length === 0) {
      return res.status(200).json({ message: [] });
    }

    const userMap = new Map<string, any>();
    messages.forEach((msg) => {
      const sender = msg.senderId;
      const receiver = msg.receiverId;

      if (sender?._id && !userMap.has(sender._id.toString())) {
        userMap.set(sender._id.toString(), sender);
      }

      if (receiver?._id && !userMap.has(receiver._id.toString())) {
        userMap.set(receiver._id.toString(), receiver);
      }
    });

    res.status(200).json({
      messages,
      users: Array.from(userMap.values())
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//@ts-ignore

app.post("/chat", async (req, res) => {
  const { receiveid, senderid } = req.body;

  if (!receiveid || !senderid) {
    return res.status(400).json({ error: "Both receiveid and senderid are required" });
  }

  try {
    const messages = await messageModel.find({
      $or: [
        { senderId: senderid, receiverId: receiveid },
        { senderId: receiveid, receiverId: senderid }
      ]
    });

    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//@ts-ignore
app.post("/chatseen", async (req, res) => {
  const { receiveid, senderid } = req.body;
  if (!receiveid || !senderid) {
    return res.status(400).json({ error: "Both receiveid and senderid are required" });
  }
  try {
    await messageModel.updateMany({
      receiverId:senderid,
      senderId:receiveid,
    },{$set:{
      seen:true
    }});
    res.status(200).json({ message:'updated' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
//@ts-ignore
app.post("/message", async (req, res) => {
  const { senderId, receiverId, content,createdAt,seen } = req.body;
console.log(senderId, receiverId, content);
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ error: "senderId, receiverId and content are required" });
  }

  try {
    const existingRoom = await messageModel.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });
    const roomId = existingRoom ? existingRoom.roomId : Math.ceil(Math.random() * 8999 + 1000).toString();

    await messageModel.create({ content, senderId, receiverId,roomId,createdAt,seen });
    res.status(201).json({ message: "Chat sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
});

app.listen(3000, () => {
  console.log("App is listening at http://localhost:3000");
});

import { WebSocketServer,WebSocket } from "ws";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import cors from "cors";
import { userModel } from "./db";
import { messageModel } from "./db";
import express, { RequestHandler } from "express";
import dotenv from "dotenv";
const app = express();
app.use(cors());
const jwtSecret = "ILOVEALLAH";
dotenv.config();
app.use(express.json());
const MONGOURI = process.env.MONGOURI as string;
mongoose.connect(MONGOURI).then(()=>{
  console.log("connected to mongodb successfully")
}).catch(()=>{
  console.log("connection to mongodb is failed")
})
const wss = new WebSocketServer({port:8080});
interface UserId{
  senderId:string,
  roomConnect:string,
  receiverId:string
}
interface User{
    socket:WebSocket,
    roomId:UserId,
}
const allSockets:User[] = [];

wss.on("connection",(socket)=>{
console.log("connected to websocket");
socket.on("error",(err)=>{
console.log(err);
})
console.log(allSockets);
socket.on("message",async(message)=>{
const parsedMessage = JSON.parse(message.toString());
console.log("message jencuierhui",parsedMessage);
const roomId = Math.ceil(Math.random() * 8999 + 1000).toString();
if(parsedMessage.type == "join")
{
  const user = allSockets.find(user=>user.roomId.senderId == parsedMessage.payload.senderId && user.roomId.receiverId == parsedMessage.payload.receiverId || 
    user.roomId.senderId == parsedMessage.payload.receiverId && user.roomId.receiverId == parsedMessage.payload.senderId)
    if(user){
     allSockets.push({
  socket:socket,
  roomId:{
    senderId:parsedMessage.payload.senderId,
    roomConnect:user.roomId.roomConnect,
    receiverId:parsedMessage.payload.receiverId
  }
}) 
    }
    else{
allSockets.push({
  socket:socket,
  roomId:{
    senderId:parsedMessage.payload.senderId,
    roomConnect:roomId,
    receiverId:parsedMessage.payload.receiverId
  }
})
    }
}
else if(parsedMessage.type == "chat")
    {  
const room = await messageModel.findOne({
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
})
if(room){
        await messageModel.create({
        content:parsedMessage.payload.message,
        senderId:parsedMessage.payload.senderId,
        receiverId:parsedMessage.payload.receiverId,
        roomId:room.roomId
        })
}
else{
 await messageModel.create({
        content:parsedMessage.payload.message,
        senderId:parsedMessage.payload.senderId,
        receiverId:parsedMessage.payload.receiverId,
        roomId:roomId
      })
} 
   const mySocket = allSockets.find(s=>s.socket == socket);
   if(!mySocket) return;
  const roomSockets = allSockets.filter(sock=>sock.roomId.roomConnect == mySocket.roomId.roomConnect);
  roomSockets.forEach(soc=>{
    soc.socket.send(JSON.stringify({
        message:parsedMessage.payload.message,
        senderId:parsedMessage.payload.senderId
      }));
  });
    }
})

socket.on("close",()=>{
console.log("client disconnecteed");
return allSockets.splice(0, allSockets.length, ...allSockets.filter(s=>s.socket !== socket));
})
})
app.post("/signup",async(req,res)=>{
const {username,email,password} = req.body;
if(!username || !email || !password){
  return;
}
else{
  try {
    await userModel.create({
    username,
    email,
    password
  })
  res.json({
    message:"sign up successfully"
  })
}
  catch (error) {
     res.json({
    error:error
  })
  }
}
})
app.post("/signin",async(req,res)=>{
try {
  const {email,password} = req.body;
const user = await userModel.findOne({
  email
})
if(!user){
   res.json({
      message:"invalid credentials",
    })
  return;
}
else{
if(user.password == password)
  {
    const token = jwt.sign({
    _id : user._id
    },jwtSecret,{
      expiresIn:'1h'
    })
  res.json({
      message:"Login successfully",
      token:token,
      id:user._id
    })
}
}
} catch (error) {
  res.json({
    error:error
  })
}
})
//@ts-ignore
const authMiddleware: RequestHandler = (req, res, next) => {
const token = req.headers.authorization?.split(' ')[1];
console.log(token);
if (!token) 
{
  return res.status(401).json({ error: "No token provided" });
}
try {
  const decoded = jwt.verify(token, jwtSecret);
  if(decoded)
  {
  //@ts-ignore
 req.user = decoded;
  next();
  }
 else{
   return res.status(401).json({ error: "Invalid token" });
 }
 
} catch (err) {
  return res.status(401).json({ error: "Invalid token" });
}
app.post("/contacts",authMiddleware,async(req,res)=>{
  const {user} = req.body;
try {
  const username = await userModel.find({
  email:user
})
res.json({
 user:username
})
  
} catch (error) {
  res.json({
 error:error
})
}})}
//@ts-ignore
app.post("/mycontacts",authMiddleware, async (req, res) => {
  try {
     const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ error: "receiverId is required" });
  }
  const messages = await messageModel.find({
    $or: [
      { senderId: receiverId },
      { receiverId: receiverId }
    ]
  })
  .populate('senderId')
  .populate('receiverId');

if(messages.length == 0)
  {
  return;
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

  res.json({
    messages:messages,
    users: Array.from(userMap.values()) 
  });
  } catch (error) {
     res.json({
 error:error
})
  }
});
app.listen(3000,()=>{
  console.log("app is listening at http://localhost:3000")
})
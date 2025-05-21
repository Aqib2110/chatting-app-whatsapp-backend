import { Schema } from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema({
    username:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        required:true,
        type:String
    }
})
const messageSchema = new Schema({
   content:{
    type:String,
    required:true
   },
   senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   },
   receiverId:{
   type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
   },
   roomId:{
    type:String,
    required:true
   },
   seen:{
    type:Boolean,
    required:true
   }
})
export const userModel = mongoose.model('User',userSchema);
export const messageModel = mongoose.model('Message',messageSchema);

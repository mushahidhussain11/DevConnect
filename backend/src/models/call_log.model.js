import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  callType: {
     type: String, 
     enum: ["audio", "video"], 
     required: true 
    },
  status: {
    type: String,
    enum: ["missed", "ended", "rejected", "ongoing"],
    required: true,
  },
  
}, { timestamps: true });


const CallLog = mongoose.model("CallLog", callLogSchema);
export default CallLog;
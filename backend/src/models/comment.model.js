import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    text: {
        type: String,
        reuiqred: true
    },
}, { timestamps: true });

export default mongoose.model("Comment", commentSchema);
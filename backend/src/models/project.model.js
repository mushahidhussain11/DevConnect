import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  techStack: {
    type: [String], // e.g. ['React', 'Node.js', 'MongoDB']
    default: []
  },
  repoLink: {
    type: String,
    trim: true
  },
  liveDemoLink: {
    type: String,
    trim: true
  },
  thumbnails: {
    type: [String], // Array of image URLs (Cloudinary, etc.)
    default: []
  },
  tags: {
    type: [String], // e.g. ['AI', 'Open Source', 'Portfolio']
    index: true
  },
  reactions: {
      like: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      love: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      innovative: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      celebrate: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ]
    },
    numberOfComments : {
      type: Number,
      default: 0
    }
  
  
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;

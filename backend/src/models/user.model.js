import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: function () {
      // Only require password if user is not using OAuth
      return !this.googleId && !this.facebookId;
    },
  },
  role: {
    type: String,
    default: null
  },
  profilePic: {
    type: String,
    default: ''
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  numberOfPosts: {
    type: Number,
    default: 0
  },
  numberOfProjects: {
    type: Number,
    default: 0
  },
  onlineStatus: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: String,
    default: null
  },
  facebookId: {
    type: String,
    default: null
  },

  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpiresAt: {
    type: Date,
  },
  
  lastSeen: {
    type: Date,
    default: Date.now
  },
  socketId: {
    type: String,
    default: null
  },
  
		resetPasswordExpiresAt: Date,
},{timestamps: true});

userSchema.pre("save", async function(next) {

    if(!this.isModified("password")) return next();

    try {

        const salt  = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    }catch (error) {
        next(error)
    }
   
});

const User = mongoose.model("User", userSchema);

export default User;
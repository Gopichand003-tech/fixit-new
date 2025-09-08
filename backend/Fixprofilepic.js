import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js"; // adjust path if needed

dotenv.config(); // make sure MONGO_URI is in your .env

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB");

    // Find users with profilePic missing leading "/"
    const users = await User.find({ profilePic: { $regex: /^uploads\// } });

    console.log(`Found ${users.length} users to update.`);

    for (const user of users) {
      user.profilePic = "/" + user.profilePic;
      await user.save();
      console.log(`✅ Fixed: ${user.name || user._id}`);
    }

    console.log("All profilePic paths fixed!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

run();

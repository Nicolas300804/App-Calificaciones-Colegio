const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const connectDB = require("../config/db");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();

    const createdUser = await User.create([
      {
        username: "admin",
        password: "123", // Will be hashed by pre-save middleware
        fullName: "Admin User",
        role: "admin",
        contactInfo: { email: "admin@example.com" },
      },
      {
        username: "teacher1",
        password: "123",
        fullName: "John Doe",
        role: "teacher",
        contactInfo: { email: "teacher@example.com" },
      },
    ]);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}

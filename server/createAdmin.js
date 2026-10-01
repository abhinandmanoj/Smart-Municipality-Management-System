const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.role = "Admin";
      existingAdmin.isActive = true;

      await existingAdmin.save();

      console.log("Admin already exists.");
      console.log("Admin role updated successfully.");

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      name: "Municipality Admin",
      email: email,
      password: hashedPassword,
      role: "Admin",
      department: "Administration",
      phone: "",
      profileImage: "",
      isActive: true,
    });

    await admin.save();

    console.log("");
    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log("Email    : admin@gmail.com");
    console.log("Password : Admin@123");
    console.log("Role     : Admin");
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
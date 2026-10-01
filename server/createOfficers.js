const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

const officers = [
  {
    name: "Road & Transport Officer",
    email: "road.officer@smartmunicipality.com",
    password: "Officer@123",
    department: "Road & Transport",
  },

  {
    name: "Waste Management Officer",
    email: "waste.officer@smartmunicipality.com",
    password: "Officer@123",
    department: "Waste Management",
  },

  {
    name: "Water Supply Officer",
    email: "water.officer@smartmunicipality.com",
    password: "Officer@123",
    department: "Water Supply",
  },

  {
    name: "Electrical Officer",
    email: "electrical.officer@smartmunicipality.com",
    password: "Officer@123",
    department: "Electrical",
  },

  {
    name: "Drainage & Sewage Officer",
    email: "drainage.officer@smartmunicipality.com",
    password: "Officer@123",
    department: "Drainage & Sewage",
  },

  {
    name: "Public Health Officer",
    email: "health.officer@smartmunicipality.com",
    password: "Officer@123",
    department: "Public Health",
  },

  {
    name: "Parks & Public Spaces Officer",
    email: "parks.officer@smartmunicipality.com",
    password: "Officer@123",
    department: "Parks & Public Spaces",
  },
];

const createOfficers = async () => {
  try {
    // ==============================
    // CONNECT TO MONGODB
    // ==============================

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // ==============================
    // CREATE OFFICERS
    // ==============================

    for (const officer of officers) {
      const existingOfficer = await User.findOne({
        email: officer.email,
      });

      // ------------------------------
      // IF ACCOUNT ALREADY EXISTS
      // ------------------------------

      if (existingOfficer) {
        existingOfficer.name = officer.name;
        existingOfficer.role = "Officer";
        existingOfficer.department = officer.department;
        existingOfficer.isActive = true;

        // Update password
        existingOfficer.password = await bcrypt.hash(
          officer.password,
          10
        );

        await existingOfficer.save();

        console.log(
          `Updated: ${officer.email} -> ${officer.department}`
        );

        continue;
      }

      // ------------------------------
      // HASH PASSWORD
      // ------------------------------

      const hashedPassword = await bcrypt.hash(
        officer.password,
        10
      );

      // ------------------------------
      // CREATE ACCOUNT
      // ------------------------------

      await User.create({
        name: officer.name,
        email: officer.email,
        password: hashedPassword,
        role: "Officer",
        department: officer.department,
        phone: "",
        profileImage: "",
        isActive: true,
      });

      console.log(
        `Created: ${officer.email} -> ${officer.department}`
      );
    }

    console.log("");
    console.log("======================================");
    console.log("ALL OFFICER ACCOUNTS CREATED");
    console.log("======================================");

    officers.forEach((officer) => {
      console.log("");
      console.log(`Department: ${officer.department}`);
      console.log(`Email: ${officer.email}`);
      console.log(`Password: ${officer.password}`);
    });

    console.log("");
    console.log("Officer creation completed.");

    process.exit(0);
  } catch (error) {
    console.error("Officer Creation Error:", error);
    process.exit(1);
  }
};

createOfficers();
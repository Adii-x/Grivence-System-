const dns = require("dns");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const TEST_PASSWORD = "Test@1234";

const users = [
  {
    name: "Test Student",
    email: "student.test@grievease.com",
    role: "student",
    department: "Computer Science",
    studentId: "CS2026001",
    year: "3rd Year",
  },
  {
    name: "Test Staff",
    email: "staff.test@grievease.com",
    role: "staff",
    department: "Civil Engineering",
    assignedDept: "Civil Engineering",
  },
  {
    name: "Test Admin",
    email: "admin.test@grievease.com",
    role: "admin",
    department: "Administration",
  },
];

const seed = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  for (const user of users) {
    await User.updateOne(
      { email: user.email },
      {
        $set: {
          ...user,
          password: hashedPassword,
          isActive: true,
          loginAttempts: 0,
          lockUntil: null,
        },
      },
      { upsert: true }
    );
  }

  console.log("Test users seeded successfully.");
  console.log("Student: student.test@grievease.com / Test@1234");
  console.log("Staff:   staff.test@grievease.com / Test@1234");
  console.log("Admin:   admin.test@grievease.com / Test@1234");

  await mongoose.disconnect();
};

seed()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Failed to seed test users:", error.message);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  });

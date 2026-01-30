const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/grades", require("./routes/gradeRoutes"));
app.use("/api/export", require("./routes/exportRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

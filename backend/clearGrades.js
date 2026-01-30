const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const clearGrades = async () => {
  try {
    await connectDB();

    const Grade = require("./models/Grade");

    console.log("Eliminando todas las calificaciones...");
    const result = await Grade.deleteMany({});
    console.log(`✅ ${result.deletedCount} calificaciones eliminadas`);

    console.log(
      "\n✨ Base de datos lista para el nuevo sistema de calificaciones",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

clearGrades();

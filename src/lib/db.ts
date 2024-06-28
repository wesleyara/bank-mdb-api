import mongoose from "mongoose";
import { DATABASE_URL } from "../utils/constants";


const connectToDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB", error);
  }
};

export { connectToDatabase };

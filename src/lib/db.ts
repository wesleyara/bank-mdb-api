import mongoose from "mongoose";

const uri = "mongodb://root:admin@localhost:27017";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri, {
      user: "root",
      pass: "admin",
    });
    console.log("Conectado ao MongoDB");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB", error);
  }
};

export { connectToDatabase };

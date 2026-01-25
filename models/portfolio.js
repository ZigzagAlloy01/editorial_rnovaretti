import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  author: {
    name: { type: String, required: true },
    image: { type: String, required: true },
    role: { type: String, default: "Autor" }
  },
  book: {
    title: { type: String, required: true },
    image: { type: String, required: true },
    genre: { type: String, required: true }
  }
}, { timestamps: true });

export default mongoose.model("portfolio", portfolioSchema);

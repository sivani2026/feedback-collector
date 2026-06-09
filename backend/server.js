const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/feedbackCollector";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.post("/addFeedback", async (req, res) => {
  try {
    const { name, message, rating } = req.body;

    if (!name?.trim() || !message?.trim()) {
      return res.status(400).json({ error: "Name and feedback message are required." });
    }

    const feedback = await Feedback.create({
      name,
      message,
      rating: Number(rating) || 5,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ error: "Failed to save feedback." });
  }
});

app.get("/feedbacks", async (_req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: "Failed to load feedbacks." });
  }
});

app.delete("/feedback/:id", async (req, res) => {
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!deletedFeedback) {
      return res.status(404).json({ error: "Feedback not found." });
    }

    res.json({ message: "Feedback deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete feedback." });
  }
});
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Feedback Collector running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
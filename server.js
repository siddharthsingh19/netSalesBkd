require("dotenv").config(); // Load .env file variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const FormData = require("./models/FormData"); // Import the FormData model

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON request bodies

const mongoURI = process.env.MONGO_URI; // Use the URI from .env file

// MongoDB connection
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// API to save form data with date
app.post("/api/saveFormData", async (req, res) => {
  try {
    const formData = req.body;

    // Ensure all the necessary fields are numbers, defaulting to 0 if missing
    const noteCount = [
      (formData[500] || 0) * 500,
      (formData[100] || 0) * 100,
      (formData[50] || 0) * 50,
      (formData[10] || 0) * 10,
      (formData[5] || 0) * 5,
      (formData[2] || 0) * 2,
      (formData[1] || 0) * 1,
    ];

    const totalNotes = noteCount.reduce((acc, value) => acc + value, 0);

    const CDamount =
      noteCount[2] +
      noteCount[3] +
      noteCount[4] +
      noteCount[5] +
      noteCount[6] +
      400; // Add 400 for C/D

    const Drawer =
      noteCount[0] + noteCount[1] + (formData.previnDrawer || 0) - 400; // Subtract 400 for C/D

    // Ensure all required fields are numbers or fallback to 0 if missing
    const finalAmount =
      totalNotes -
      (Number(formData["CDsub"]) || 0) +
      (Number(formData["due"]) || 0) +
      (Number(formData["paytm"]) || 0) +
      (Number(formData["CDadd"]) || 0);

    // Create the data object to save to MongoDB
    const dataToSave = {
      ...formData,
      totalNotes, // Save totalNotes to MongoDB
      CDamount, // Save CDamount to MongoDB
      Drawer, // Save Drawer to MongoDB
      finalAmount, // Save finalAmount to MongoDB
      date: new Date().toISOString(), // Adding the current date
    };

    // Create a new FormData instance with the calculated data
    const newFormData = new FormData(dataToSave);

    // Save the form data to MongoDB
    await newFormData.save();

    res.status(200).json({ message: "Data saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving data" });
  }
});

// API to fetch all form data
app.get("/api/getFormData", async (req, res) => {
  try {
    const allFormData = await FormData.find(); // Retrieve all entries from the FormData collection
    res.status(200).json(allFormData); // Send the data as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Export the app for Vercel serverless function
module.exports = async (req, res) => {
  // Ensure MongoDB is connected before handling any request
  await connectToMongoDB();
  app(req, res); // Call express handler for the request
};

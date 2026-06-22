const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    cropType: {
      type: String,
      required: true,
    },

    plotSize: {
      type: Number,
      required: true,
    },

    location: {
      type: {
        type: String,
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

farmerSchema.index({ location: "2dsphere" });

const Farmer = mongoose.model("Farmer", farmerSchema);

app.get("/", (req, res) => {
  res.send("Farmer Registry API Running");
});

app.get("/farmers", async (req, res) => {
  try {
    const farmers = await Farmer.find().sort({ createdAt: -1 });
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/farmers", async (req, res) => {
  try {
    const farmer = await Farmer.create(req.body);
    res.status(201).json(farmer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/farmers/:id", async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(farmer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/farmers/:id", async (req, res) => {
  try {
    await Farmer.findByIdAndDelete(req.params.id);

    res.json({
      message: "Farmer Deleted Successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/farmers/nearby", async (req, res) => {
  try {
   const { lat, lng, km = 5 } = req.query;

  console.log("Nearby Search:");
  console.log("Lat:", lat);
  console.log("Lng:", lng);
  console.log("KM:", km);

    const farmers = await Farmer.find({
      location: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: km * 1000,
        },
      },
    });
    console.log("Found Farmers:", farmers.length);
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
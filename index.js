const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");
const Update = require("./model/updateModel");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const background = require("./model/heroBgModel");
const Admin = require("./model/adminModel");
app.use(
  cors({
    origin: [
      "*",
      "http://localhost:5500/",
      "http://127.0.0.1:5173",
      "http://192.168.1.100:5173",
    ],
  })
);

const port = process.env.PORT || 8080;
connectDB();
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// cloudinary config
cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.API_Key,
  api_secret: process.env.API_Secret,
  secure: true,
});

app.get("/login", (req, res) => {
  res.render("signup");
});

app.get("/", async (req, res) => {
  res.send("hello World");
});

app.post("/updatePopup", async (req, res) => {
  const { url, name } = req.body;
  const update = Update.create({
    url: url,
    name: name,
  });

  if (update) {
    res.status(201).json("Success");
  } else {
    console.log(error);
    res.status(400).json("Error , Please Try Again");
  }
});

// deleteupdate
app.get("/updatePopup/delete/:id", async (req, res) => {
  const dlt = await Update.findByIdAndDelete(req.params.id);
  if (dlt) {
    res.status(201).json("Success");
  } else {
    console.log(error);
    res.status(400).json("Error , Please Try Again");
  }
});

app.get("/updatePopup", async (req, res) => {
  const data = (await Update.find({})).reverse();
  res.status(201).json(data);
});

// backgroundImagePage

app.post("/background", async (req, res) => {
  const { type, url } = req.body;
  console.log(type, url);
  const bg = await background.findByIdAndUpdate(
    type,
    {
      url: url,
    },
    { new: true }
  );
  console.log(bg);
  if (bg) {
    res.status(201).json("Success");
  } else {
    console.log(error);
    res.status(400).json("Error , Please Try Again");
  }
});

app.get("/bg", async (req, res) => {
  const data = (await background.find({})).reverse();

  res.status(201).json(data);
});

// Admin

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.create({ email, password });
  if (admin) {
    res.status(201).json(admin);
  } else {
    res.status(400).json("Error");
  }
});
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && admin.password === password) {
    res.status(201).json({
      id: admin._id,
      email: admin.email,
    });
  } else {
    res.status(400).json("email or passsword wrong");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
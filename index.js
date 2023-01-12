const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const fileUpload = require("express-fileupload");
const Update = require("./model/updateModel");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const background = require("./model/heroBgModel");
app.use(
  cors({
    origin: "*",
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
  const data = (await Update.find({})).reverse();
  res.render("index", { data });
});

app.post("/updatePopup", async (req, res) => {
  const file = req.files.photo;
  console.log(file);
  await cloudinary.uploader.upload(
    file.tempFilePath,
    { folder: "thekamodaResort" },
    (err, result) => {
      // console.log(result);
      // res.send(result.url);
      const update = Update.create({
        url: result.url,
        name: file.name,
      });
      if (update) {
        res.redirect("/");
      }
    }
  );
});

// deleteupdate
app.get("/updatePopup/delete/:id", async (req, res) => {
  const dlt = await Update.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.get("/updatePopup", async (req, res) => {
  const data = (await Update.find({})).reverse();
  res.status(201).json(data);
});

// backgroundImagePage
app.get("/background", async (req, res) => {
  const data = (await background.find({})).reverse();
  console.log(data);
  res.render("background", { data });
});

app.post("/background", async (req, res) => {
  const file = req.files.photo;
  const type = req.body.type;
  console.log(type);

  const url = await cloudinary.uploader.upload(
    file.tempFilePath,
    { folder: "thekamodaResort/background" },
    (err, result) => {
      return result;
    }
  );

  console.log(url);
  const id = await background.findOne({ type });

  const bg = await background.findByIdAndUpdate(
    id._id,
    {
      url: url.url,
    },
    { new: true }
  );
  console.log(id);
  if (bg) {
    res.redirect("/background");
  }
});

app.get("/bg", async (req, res) => {
  const data = (await background.find({})).reverse();

  res.status(201).json(data);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

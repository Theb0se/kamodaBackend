const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const Update = require("./model/updateModel");
const cors = require("cors");
const background = require("./model/heroBgModel");
const Admin = require("./model/adminModel");
app.use(
  cors({
    origin: [
      "*",
      "http://192.168.1.100:3000",
      "https://thekamodaresort.com/",
      "https://thekamodaresort.com/admin",
    ],

    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const port = process.env.PORT || 8080;
connectDB();
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.get("/login", cors(), (req, res) => {
  res.render("signup");
});

app.get("/", cors(), async (req, res) => {
  res.send("hello the kamoda resort 2");
});

app.post("/updatePopup", cors(), async (req, res) => {
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
app.get("/updatePopup/delete/:id", cors(), async (req, res) => {
  const dlt = await Update.findByIdAndDelete(req.params.id);
  if (dlt) {
    res.status(201).json("Success");
  } else {
    console.log(error);
    res.status(400).json("Error , Please Try Again");
  }
});

app.get("/updatePopup", cors(), async (req, res) => {
  const data = (await Update.find({})).reverse();
  res.status(201).json(data);
});

// backgroundImagePage

app.post("/background", cors(), async (req, res) => {
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

app.get("/bg", cors(), async (req, res) => {
  const data = (await background.find({})).reverse();

  res.status(201).json(data);
});

// Admin

app.post("/signup", cors(), async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.create({ email, password });
  if (admin) {
    res.status(201).json(admin);
  } else {
    res.status(400).json("Error");
  }
});
app.post("/signin", cors(), async (req, res) => {
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

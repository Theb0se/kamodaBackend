const express = require("express");
const connectDB = require("./config/db");
const app = express();
require("dotenv").config();
const Update = require("./model/updateModel");
const cors = require("cors");
const background = require("./model/heroBgModel");
const Admin = require("./model/adminModel");
const Feedback = require("./model/feedbackModel");
const nodemailer = require("nodemailer");

app.use(
  cors({
    origin: [
      "*",
      "http://192.168.1.100:3000",
      "http://192.168.1.100:5500",
      "http://192.168.1.101:3000",
      "http://192.168.1.101:5500",
      "http://192.168.1.102:3000",
      "http://192.168.1.102:5500",
      "https://thekamodaresort.com",
      "https://thekamodaresort.com/admin",
    ],

    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

let transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
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
  console.log(req.socket.remoteAddress);
  console.log(req.ip);

  res.send(`${req.ip} and ${req.socket.remoteAddress}`);
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

// Post Feedback
app.post("/feedback", cors(), async (req, res) => {
  const {
    name,
    number,
    checkin,
    duration,
    hearAbout,
    ReservationType,
    VisitPurpose,
    ServiceQuality,
    Cleanliness,
    Food,
    StaffBehaviour,
    OverallExperience,
    OtherSuggestion,
  } = req.body;

  console.log(
    name,
    number,
    checkin,
    duration,
    hearAbout,
    ReservationType,
    VisitPurpose,
    ServiceQuality,
    Cleanliness,
    Food,
    StaffBehaviour,
    OverallExperience,
    OtherSuggestion
  );

  let info = await transporter.sendMail({
    from: `${name} <kamodafeedback@theb0se.com>`, // sender address
    to: "rishabhbose3@gmail.com", // list of receivers
    subject: `New Feedback From ${name}`, // Subject line
    html: `
    <p><b>Name : ${name}</b></p>
    <p><b>Number : ${number}</b></p>
    <p><b>Check-in Date : ${checkin}</b></p>
    <p><b>Duration Of Stay : ${duration}</b></p>
    <p><b>Reservation  : ${ReservationType} </b></p>
    <p><b>Purpose of Visit : ${VisitPurpose}</b></p>
    <p><b>Service Quality : ${ServiceQuality}</b></p>
    <p><b>Staff Behaviour : ${StaffBehaviour}</b></p>
    <p><b>Food : ${Food}</b></p>
    <p><b>Cleanliness : ${Cleanliness}</b></p>
    <p><b>Overall Experience : ${OverallExperience}</b></p>
    <p><b>Other Suggestion : ${OtherSuggestion}</b></p>
    
    `, // html body
  });
  if (info) {
    console.log("success");
  } else {
    console.log("error");
  }

  const feedback = await Feedback.create({
    name,
    number,
    checkin,
    duration,
    hearAbout,
    ReservationType,
    VisitPurpose,
    ServiceQuality,
    Cleanliness,
    Food,
    StaffBehaviour,
    OverallExperience,
    OtherSuggestion,
  });
  if (feedback) {
    console.log(feedback);
    res.status(201).json(feedback);
  } else {
    res.status(400).json("Error");
  }
});

// get all feedbacks
app.get("/feedback", cors(), async (req, res) => {
  const feedback = (await Feedback.find({})).reverse();
  if (feedback) {
    res.status(201).json(feedback);
  } else {
    res.status(400).json("Error");
  }
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

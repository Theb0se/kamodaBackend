const { default: mongoose } = require("mongoose");
const adminModel = mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminModel);

module.exports = Admin;

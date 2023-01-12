const { default: mongoose } = require("mongoose");
const bgModel = mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, required: true, default: "Welcome" },
  },
  { timestamps: true }
);

const background = mongoose.model("background", bgModel);

module.exports = background;

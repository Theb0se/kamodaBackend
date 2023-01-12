const { default: mongoose } = require("mongoose");
const updateModel = mongoose.Schema(
  {
    url: { type: String, required: true },
    name: { type: String, required: true, default: "hello" },
  },
  { timestamps: true }
);

const Update = mongoose.model("Update", updateModel);

module.exports = Update;

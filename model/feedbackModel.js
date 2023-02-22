const { default: mongoose } = require("mongoose");
const feedbackModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true },
    checkin: { type: Date, required: true },
    duration: { type: Number, required: true },
    hearAbout: { type: String, required: true },
    ReservationType: { type: String, required: true },
    VisitPurpose: { type: String, required: true },
    ServiceQuality: { type: String, required: true },
    Cleanliness: { type: String, required: true },
    Food: { type: String, required: true },
    StaffBehaviour: { type: String, required: true },
    OverallExperience: { type: String, required: true },
    OtherSuggestion: { type: String, default: "no" },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackModel);

module.exports = Feedback;

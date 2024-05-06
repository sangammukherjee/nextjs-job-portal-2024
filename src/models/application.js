import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  recruiterUserID: String,
  name: String,
  email: String,
  candidateUserID: String,
  status: Array,
  jobID: String,
  jobAppliedDate: String,
});

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);

export default Application;

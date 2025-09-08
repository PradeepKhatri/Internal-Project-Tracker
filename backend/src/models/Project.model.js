import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
});
const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    milestone: {
      start: {
        planned: { type: Date, required: true },
        actual: { type: Date },
      },
      brdSignOff: {
        planned: { type: Date, required: true },
        actual: { type: Date },
      },
      designApproval: {
        planned: { type: Date, required: true },
        actual: { type: Date },
      },
      uatSignOff: {
        planned: { type: Date, required: true },
        actual: { type: Date },
      },
      deployment: {
        planned: { type: Date, required: true },
        actual: { type: Date },
      },
    },
    currentStage: {
      type: String,
      required: true,
      enum: [
        "Ideation",
        "Requirement",
        "Development",
        "Testing",
        "UAT",
        "Go live",
      ],
      default: "Ideation",
    },
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectPartner: {
      type: String,
      trim: true,
    },
    files: {
      type: [FileSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;

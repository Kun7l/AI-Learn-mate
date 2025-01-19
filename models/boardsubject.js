import mongoose from "mongoose";

const boardsubjects = new mongoose.Schema({
  std: String,
  subject:String
});

export const boardSubjects = mongoose.model("boardsubjects", boardsubjects);

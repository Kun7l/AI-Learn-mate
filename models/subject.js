import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name:String
});

export const Subject = mongoose.model("subject",subjectSchema);
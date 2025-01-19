import mongoose from "mongoose";

const subtopicSchema = new mongoose.Schema({
    name:String,
    subject:String
});

export const SubTopic = mongoose.model("subtopic",subtopicSchema);
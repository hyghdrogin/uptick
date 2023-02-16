import { Schema, model } from "mongoose";
import { NoteInterface } from "../utilities/interfaces";

const noteSchema = new Schema(
  {
    owner: { type: String },
    heading: { type: String },
    noteField: { type: String }
  },
  { timestamps: true }
);

export default model<NoteInterface>("Note", noteSchema);

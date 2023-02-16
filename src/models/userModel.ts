import { Schema, model } from "mongoose";
import { UserInterface } from "../utilities/interfaces";

const userSchema = new Schema(
  {
    userName: { type: String, unique: true },
    email: {
      type: String, unique: true, nullable: false, lowercase: true, maxlength: 50
    },
    password: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<UserInterface>("User", userSchema);

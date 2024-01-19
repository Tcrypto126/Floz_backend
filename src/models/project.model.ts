import mongoose, { Document, Schema, model } from "mongoose"

interface IProject extends Document {
  name: string;
  status: boolean;
  color: string;
  userId: string;
  phase: string;
  dueDate: Date;
  updatedAt: Date;
  createdAt: Date;
}
const schema = new Schema({
  name: { type: String, unique: true, required: true },
  status: { type: Boolean, default: true },
  phase: { type: String, enum: ["25% SD","25% SD","50% SD","75% SD","100% SD","25% DD","50% DD","75% DD","100% DD","25% CD","50% CD","75% CD","100% CD"]},
  color: {type: String, default:'#349989'},
  userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
  dueDate: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Project = model("Project", schema);

export { Project, IProject };
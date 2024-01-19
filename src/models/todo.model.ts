import mongoose, { Document, Schema, model } from "mongoose"

interface ITodo extends Document {
  title?: string;
  description: string;
  assignedPerson: string;
  dueDate: Date;
  status: string;
  projectId: typeof mongoose.Schema.ObjectId;
  meetingId: typeof mongoose.Schema.ObjectId;
  updatedAt?: Date;
  createdAt?: Date;
}

const schema: Schema<ITodo> = new Schema({
  title: { type: String },
  description: { type: String },
  assignedPerson: {type: String},
  dueDate: { type: Date },
  status: { type: String, enum: ['pending', 'completed'] },
  projectId: { type: mongoose.Schema.ObjectId, ref: 'Project' },
  meetingId: { type: mongoose.Schema.ObjectId, ref: 'Meeting' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Todo = model("Todo", schema);

export { Todo, ITodo };
import mongoose, { Document, Schema, model } from "mongoose"

interface IPerson extends Document {
  role: string; // what`s type of role?
  name: string;
  email: string;
  phone: string;
  projectId: typeof mongoose.Schema.ObjectId;
  organization: string;
  updatedAt: Date;
  createdAt: Date;
}

const schema: Schema<IPerson> = new Schema({
  role: { type: String, enum: ['Architect', 'PM', 'General Contrator', 'Client', 'Sub Contrator', 'Engineer', 'Owner'] },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  organization: { type: String },
  projectId: { type: mongoose.Schema.ObjectId, ref: 'Project' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Person = model("Person", schema);

export { Person, IPerson };
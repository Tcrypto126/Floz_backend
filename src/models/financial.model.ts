import mongoose, { Document, Schema, model } from "mongoose"

interface IFinancial extends Document {
  contractor: string;
  estimatedCost: number;
  acutalCost: number;
  type: string;
  projectId: typeof mongoose.Schema.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const schema: Schema<IFinancial> = new Schema({
  contractor: { type: String },
  type: { type: String },
  estimatedCost: { type: Number },
  acutalCost: { type: Number },
  projectId: { type: mongoose.Schema.ObjectId, ref: 'Project' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Financial = model("Financial", schema);

export { Financial, IFinancial };
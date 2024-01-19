import mongoose, { Document, Schema, model } from "mongoose"

interface ITranscript extends Document {
  transcript: string;
  transcriptSummary: string;
  emailSummary: string;
  todos: Object;
  meetingId: typeof mongoose.Schema.ObjectId;
  documentId: typeof mongoose.Schema.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const schema: Schema<ITranscript> = new Schema({
  transcript: { type: String },
  transcriptSummary: { type: String },
  emailSummary: { type: String },
  todos: { type: Object },
  meetingId: { type: mongoose.Schema.ObjectId, ref: 'Meeting' },
  documentId: { type: mongoose.Schema.ObjectId, ref: 'Document' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Transcript = model("Transcript", schema);

export { Transcript, ITranscript };
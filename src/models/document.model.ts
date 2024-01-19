import mongoose, { Document, Schema, model } from "mongoose"

interface IDocument extends Document {
  s3Key: string,
  s3Bucket: string,
  fileName:string,
  url:string,
  path: string;
  type: string;
  projectId: Schema.Types.ObjectId;
  meetingId: Schema.Types.ObjectId;
  lastAccessed: Date;
  updatedAt: Date;
  createdAt: Date;
}

const schema = new Schema<IDocument>({
  s3Key: { type: String },
  s3Bucket: { type: String },
  fileName:{type:String},
  url:{type:String},
  path: { type: String },
  type: { type: String },
  lastAccessed: { type: Date },
  projectId: { type: mongoose.Schema.ObjectId, ref: 'Project' },
  meetingId: { type: mongoose.Schema.ObjectId, ref: 'Meeting' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const DocumentModel = model<IDocument>("Document", schema);

export { DocumentModel, IDocument };
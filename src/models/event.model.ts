import mongoose, { Document, Schema, model } from "mongoose"

interface IEvent extends Document {
  eventId: string;
  projectId: typeof mongoose.Schema.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const schema: Schema<IEvent> = new Schema({
  eventId: { type: String },
  projectId: { type: mongoose.Schema.ObjectId, ref: 'Project' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Event = model("Event", schema);

export { Event, IEvent };
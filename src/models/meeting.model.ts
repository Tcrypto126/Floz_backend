import mongoose, { Document, Schema, model } from "mongoose"

interface IMeeting extends Document {
  date: Date;
  summary: string;
  audioURL: string;
  favourite: boolean;
  topic: string;
  assignPeopleMap:Object;
  googleEventId: string;
  googleMeetingUrl: string;
  period:number;
  projectId: typeof mongoose.Schema.ObjectId;
  members: [typeof mongoose.Schema.ObjectId];
  updatedAt: Date;
  createdAt: Date;
}

const schema: Schema<IMeeting> = new Schema({
  date: { type: Date },
  summary: { type: String },
  audioURL: { type: String },
  favourite: { type: Boolean, default: false },
  topic: { type: String, default: 'Topic' },
  googleEventId: { type: String },
  assignPeopleMap: {type: Object},
  googleMeetingUrl: { type: String },
  period: { type: Number, default: 30 },
  projectId: { type: mongoose.Schema.ObjectId, ref: 'Project' },
  members: [{ type: mongoose.Schema.ObjectId, ref: 'Person' }],
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const Meeting = model("Meeting", schema);

export { Meeting, IMeeting };
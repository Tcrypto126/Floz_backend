import { Document, Schema, model } from "mongoose"

interface IUser extends Document {
  name: string;
  email: string;
  organization: string;
  oAuthToken: string;
  oAuthTokenForEmail:string;
  lastLogin: Date;
  updatedAt: Date;
  createdAt: Date;
}

interface IUpdateUser {
  name?: string;
  email?: string;
  organization?: string;
  oAuthToken?: string;
  refreshToken?: string;
  oAuthTokenForEmail?:string;
  lastLogin?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

const schema = new Schema({
  name: { type: String, },
  email: { type: String, unique: true, required: true },
  organization: { type: String, },
  oAuthToken: { type: String, unique: true },
  refreshToken: { type: String },
  OAuthTokenForEmail: {type: String },
  lastLogin: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const User = model("User", schema);

export { User, IUser, IUpdateUser };

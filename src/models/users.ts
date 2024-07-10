import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  age: number;
  role: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  role: { type: String },
});

const UserProfile: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  profile_tag: { type: String },
  profile_content_type: { type: String },
});
export const Profile = mongoose.model("Profile", UserProfile);
export default mongoose.model<IUser>("User", UserSchema);

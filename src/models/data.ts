import mongoose, { Document, Schema } from "mongoose";

export interface IData extends Document {
  my_story: string;
  my_other_name: string;
  my_other_id: number;
}

const UserData: Schema = new Schema({
  my_story: { type: String, required: true },
  my_other_name: { type: String, required: true },
  my_other_id: { type: Number, required: true },
});

export default mongoose.model<IData>("Data", UserData);

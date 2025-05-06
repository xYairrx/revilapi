import { Document, model, Schema, Types } from "mongoose";

interface ICharacters extends Document {
  name: string;
  description: string;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  occupations: string[];
  games: Types.ObjectId[];
  organizations?: Types.ObjectId[];
}

const characterSchema = new Schema<ICharacters>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  age: { type: Number, required: true },
  nationality: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  occupations: [{ type: String, required: true }],
  games: [{ type: Types.ObjectId, ref: "Games" }],
  organizations: { type: [String] },
});

const Characters = model<ICharacters>("Characters", characterSchema);
export default Characters;

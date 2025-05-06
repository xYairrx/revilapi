import { Document, model, Schema, Types } from "mongoose";

interface IGames extends Document {
  title: string;
  releaseYear: number;
  platforms: string[];
  genre: string;
  description: string;
  mainCharacters: Types.ObjectId[];
  enemies?: string[];
  locations?: string[];
  developer: string;
}

const gamesSchema = new Schema<IGames>({
  title: { type: String, required: true, unique: true },
  releaseYear: { type: Number, required: true },
  platforms: { type: [String], required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  mainCharacters: [{ type: Types.ObjectId, ref: "Characters", required: true }],
  enemies: { type: [String] },
  locations: { type: [String] },
  developer: { type: String, required: true },
});

const Games = model<IGames>("Games", gamesSchema);
export default Games;

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { databaseConnection } from "./config/database";
import characterRoutes from "./modules/characters/routes/characters.routes";
import gamesRoutes from "./modules/games/routes/games.routes";

dotenv.config();

const app = express();
databaseConnection();
app.use(cors());
app.use(express.json());

app.use("/api/v1", gamesRoutes);
app.use("/api/v1", characterRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

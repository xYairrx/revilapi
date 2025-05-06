import { Router } from "express";
import {
  createGame,
  deleteGameById,
  getAllGames,
  getGameById,
  updateGameById,
  updateGameByIdPatch,
} from "../controllers/games.controller";

const router = Router();

router.post("/games/create", createGame);
router.get("/games", getAllGames);
router.get("/games/:id", getGameById);
router.put("/games/update/:id", updateGameById);
router.patch("/games/update/:id", updateGameByIdPatch);
router.delete("/games/:id", deleteGameById);

export default router;

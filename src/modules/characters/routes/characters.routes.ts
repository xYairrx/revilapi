import { Router } from "express";
import {
  createCharacter,
  getAllCharacters,
} from "../controllers/characters.controller";

const router = Router();

router.post("/characters/create", createCharacter);
router.get("/characters", getAllCharacters);

export default router;

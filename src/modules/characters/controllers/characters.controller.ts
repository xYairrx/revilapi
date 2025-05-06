import { Request, Response } from "express";
import mongoose from "mongoose";
import Characters from "../models/characters.model";

/**
 * @description Create a new Character
 * @route POST /api/v1/characters/create
 * @access public
 * @body {string} name - The name of the character
 * @body {string} description - The description/history of the character
 * @body {number} age - The age of the character
 * @body {string} nationality - The nacionality of the character
 * @body {string} height - The height of the character.
 * A string is used to accommodate different units of measurement
 *  (centimeters, meters, inches, etc.).
 * @body {string} weight - The weight of the character. Same idea as height (pounds, etc).
 * @body {string[]} occupations - The different occupations of the character.
 * @body {string[]} games - The games where the character appear.
 * @returns {object} Return the created character object otherwise an error.
 *
 */
export const createCharacter = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requiredFields = [
    "name",
    "description",
    "age",
    "nationality",
    "height",
    "weight",
    "occupations",
    "games",
  ];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      res.status(400).json({
        message: `The field "${field}" is required`,
      });
      return;
    }
  }

  try {
    const {
      name,
      description,
      age,
      nationality,
      height,
      weight,
      occupations,
      games,
    } = req.body;

    if (
      games &&
      !games.every((id: string) => mongoose.Types.ObjectId.isValid(id))
    ) {
      res.status(400).json({
        message: "Invalid game ID(s) in the 'games' field",
      });
      return;
    }

    const newCharacter = new Characters({
      name,
      description,
      age,
      nationality,
      height,
      weight,
      occupations,
      games,
    });

    await newCharacter.save();
    await newCharacter.populate("games");
    res.status(201).json(newCharacter);
  } catch (error) {
    console.error("Error creating character", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllCharacters = async (
  req: Request,
  res: Response
): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page < 1 || limit < 1) {
    res
      .status(400)
      .json({ message: "Page and limit must be positive numbers" });
    return;
  }

  const skip = (page - 1) * limit;

  try {
    const totalCharacters = await Characters.countDocuments();
    const characters = await Characters.find()
      .skip(skip)
      .limit(limit)
      .populate("games", "title");

    res.status(200).json({
      page,
      limit,
      totalCharacters,
      characters,
    });
  } catch (error) {
    console.error("Error trying to get games", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

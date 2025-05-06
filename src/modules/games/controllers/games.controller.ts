import { Request, Response } from "express";
import mongoose from "mongoose";
import Games from "../models/games.model";

/**
 * @description Create a new game
 * @route POST /api/v1/games/create
 * @access public
 * @body {string} title - The title of the game
 * @body {number} releaseYear - The release date of the game
 * @body {string[]} platforms - The plataforms where the game was released
 * @body {string} genre - The genre of the game
 * @body {string} description - The description of the game
 * @body {string} developer - The developer of the game
 * @body {string[]} mainCharacters - The main characters of the game
 * @returns {object} Return the created game object otherwise an error
 */
export const createGame = async (
  req: Request,
  res: Response
): Promise<void> => {
  const requiredFields = [
    "title",
    "releaseYear",
    "platforms",
    "genre",
    "description",
    "developer",
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
    const { title, releaseYear, platforms, genre, description, developer } =
      req.body;
    const newGame = new Games({
      title,
      releaseYear,
      platforms,
      genre,
      description,
      developer,
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error creating game", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Get all games from the database providing
 * @route GET /api/v1/games
 * @access public
 * @query {number} page - The page number for pagination (default : 1)
 * @query {number} limit - The limit of result per page (default : 10)
 * @returns {object} Returns a paginated list of the games
 *
 */
export const getAllGames = async (
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
    const totalGames = await Games.countDocuments();
    const games = await Games.find()
      .skip(skip)
      .limit(limit)
      .populate("mainCharacters", "name");

    res.status(200).json({
      page,
      limit,
      totalGames,
      games,
    });
  } catch (error) {
    console.error("Error trying to get games", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Get the game by providing the id
 * @route GET /api/v1/game/:id
 * @access public
 * @returns {object} Return the specific game by the id
 */
export const getGameById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid GameID format" });
      return;
    }

    const game = await Games.findById(id);

    if (!game) {
      res.status(404).json({
        message: "GameID Not Found",
      });
      return;
    }

    res.status(200).json(game);
  } catch (error) {
    console.error("Error getting game by id", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

/**
 * @describe Get the provided id and detelete the game
 * @route DELETE /api/v1/game/:id
 * @returns {object} Return a confirmation message of the deleted game
 *
 */
export const deleteGameById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid GameID format" });
      return;
    }

    const findGame = await Games.findByIdAndDelete(id);

    if (!findGame) {
      res.status(404).json({ message: "GameID Not Found" });
      return;
    }

    res.status(200).json({ message: "Game Deleted Correctly" });
  } catch (error) {
    console.error("Error trying to delete game", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Update an existing game
 * @route PUT /api/v1/game/update/:id
 * @returns {object} Returns the updated game object or an error message
 */
export const updateGameById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid GameID format" });
      return;
    }

    const requiredFields = [
      "title",
      "releaseYear",
      "platforms",
      "genre",
      "description",
      "developer",
      "mainCharacters",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        res.status(400).json({
          message: `The field "${field}" is required`,
        });
        return;
      }
    }

    const {
      title,
      releaseYear,
      platforms,
      genre,
      description,
      developer,
      mainCharacters,
    } = req.body;

    const updatedGame = await Games.findByIdAndUpdate(
      id,
      {
        title,
        releaseYear,
        platforms,
        genre,
        description,
        developer,
        mainCharacters,
      },
      { new: true }
    );
    if (!updatedGame) {
      res.status(404).json({ message: "GameID Not Found" });
      return;
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Error updating game", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @description Update an existing game (partial update)
 * @route PATCH /api/v1/game/update/:id
 * @returns {object} Returns the updated game object or an error message
 */
export const updateGameByIdPatch = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid GameID format" });
      return;
    }

    const {
      title,
      releaseYear,
      platforms,
      genre,
      description,
      developer,
      mainCharacters,
    } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (releaseYear) updateData.releaseYear = releaseYear;
    if (platforms) updateData.platforms = platforms;
    if (genre) updateData.genre = genre;
    if (description) updateData.description = description;
    if (developer) updateData.developer = developer;
    if (mainCharacters) updateData.mainCharacters = mainCharacters;

    const updatedGame = await Games.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedGame) {
      res.status(404).json({ message: "GameID Not Found" });
      return;
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    console.error("Error updating game", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

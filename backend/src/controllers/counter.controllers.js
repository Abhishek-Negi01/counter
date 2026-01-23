import { Counter } from "../models/counter.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const incrementCounter = asyncHandler(async (req, res) => {
  const { word } = req.body;

  if (!word) {
    throw new ApiError(400, "word is required");
  }

  const counter = await Counter.findOneAndUpdate(
    {
      word: word.toLowerCase(),
      userId: req.user._id,
    },
    {
      $inc: { count: 1 },
    },
    {
      new: true,
      upsert: true,
    }
  );

  if (!counter) {
    throw new ApiError(500, "error while updating or creating counter");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, counter, "Counter incremented successfully"));
});

const getAllCounters = asyncHandler(async (req, res) => {
  const counters = await Counter.find({
    userId: req.user._id,
  });

  if (!counters) {
    throw new ApiError(500, "error while fetching counters");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, counters, "counters fetched successfully"));
});

const getCounter = asyncHandler(async (req, res) => {
  const { word } = req.params;

  const counter = await Counter.findOne({
    word: word.toLowerCase(),
    userId: req.user._id,
  });

  if (!counter) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { word: word.toLowerCase(), count: 0 },
          "counter not found"
        )
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, counter, "counter fetched successfully"));
});

const resetCounter = asyncHandler(async (req, res) => {
  const { word } = req.params;

  const counter = await Counter.findOneAndUpdate(
    {
      word: word.toLowerCase(),
      userId: req.user._id,
    },
    { count: 0 },
    { new: true }
  );

  if (!counter) {
    throw new ApiError(404, "counter not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, counter, "counter reset successfully"));
});

export { incrementCounter, getAllCounters, getCounter, resetCounter };

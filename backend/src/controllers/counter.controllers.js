import { Counter } from "../models/counter.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const incrementCounter = asyncHandler(async (req, res) => {
  const { word } = req.body;

  if (!word) {
    throw new ApiError(400, "word is required");
  }

  let counter = await Counter.findOne({
    word: word.toLowerCase(),
    userId: req.user._id,
  });

  if (!counter) {
    // Create new counter
    counter = await Counter.create({
      word: word.toLowerCase(),
      userId: req.user._id,
    });
  }

  await counter.incrementCounter();

  return res
    .status(200)
    .json(new ApiResponse(200, counter, "Counter incremented successfully"));
});

const getAllCounters = asyncHandler(async (req, res) => {
  const counters = await Counter.find({
    userId: req.user._id,
  }).sort({ lastCountDate: -1 });

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
          { word: word.toLowerCase(), count: 0, todayCount: 0 },
          "Counter not found"
        )
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, counter, "counter fetched successfully"));
});

const resetCounter = asyncHandler(async (req, res) => {
  const { word } = req.params;

  const counter = await Counter.findOne({
    word: word.toLowerCase(),
    userId: req.user._id,
  });

  if (!counter) {
    throw new ApiError(404, "counter not found");
  }

  await counter.resetCounter();

  return res
    .status(200)
    .json(new ApiResponse(200, counter, "counter reset successfully"));
});

const getTodayStats = asyncHandler(async (req, res) => {
  const stats = await Counter.getTodayStats(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats[0] || {}, "Today's stats fetched successfully")
    );
});

const getWeeklyTrend = asyncHandler(async (req, res) => {
  const trend = await Counter.getWeeklyTrend(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, trend, "Weekly trend fetched successfully"));
});

const getMonthlyTrend = asyncHandler(async (req, res) => {
  const trend = await Counter.getMonthlyTrend(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, trend, "Monthly trend fetched successfully"));
});

const getAllTimeStats = asyncHandler(async (req, res) => {
  const stats = await Counter.getAllTimeStats(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        stats[0] || {},
        "All-time stats fetched successfully"
      )
    );
});

export {
  incrementCounter,
  getAllCounters,
  getCounter,
  resetCounter,
  getTodayStats,
  getWeeklyTrend,
  getMonthlyTrend,
  getAllTimeStats,
};

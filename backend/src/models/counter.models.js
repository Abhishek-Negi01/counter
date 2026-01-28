import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    // Daily Analytics - Reset every day
    todayCount: {
      type: Number,
      default: 0,
    },
    lastCountDate: {
      type: Date,
      default: Date.now,
    },

    // Historical tracking for charts
    dailyHistory: [
      {
        date: {
          type: Date,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],

    // Metadata
    category: {
      type: String,
      default: "general",
    },
    lastResetDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes
counterSchema.index({ word: 1, userId: 1 }, { unique: true });
counterSchema.index({ userId: 1, lastCountDate: -1 });

// Increment method
counterSchema.methods.incrementCounter = function () {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const lastCountStart = new Date(
    this.lastCountDate.getFullYear(),
    this.lastCountDate.getMonth(),
    this.lastCountDate.getDate()
  );

  // Reset daily count if it's a new day
  if (todayStart.getTime() !== lastCountStart.getTime()) {
    // Save yesterday's count to history
    if (this.todayCount > 0) {
      this.dailyHistory.push({
        date: lastCountStart,
        count: this.todayCount,
      });
    }

    this.todayCount = 0;
  }

  // Increment counters
  this.count += 1;
  this.todayCount += 1;
  this.lastCountDate = today;

  return this.save();
};

counterSchema.methods.resetCounter = function () {
  this.count = 0;
  this.todayCount = 0;
  this.lastResetDate = new Date();
  this.dailyHistory = [];
  return this.save();
};

// Get today's stats
counterSchema.statics.getTodayStats = function (userId) {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        lastCountDate: { $gte: todayStart },
      },
    },
    {
      $group: {
        _id: null,
        totalTodayCount: { $sum: "$todayCount" },
        activeWords: { $sum: 1 },
        totalLifetimeCount: { $sum: "$count" },
      },
    },
  ]);
};

// Get weekly trend
counterSchema.statics.getWeeklyTrend = function (userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$dailyHistory",
    },
    {
      $match: {
        "dailyHistory.date": {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$dailyHistory.date",
            },
          },
        },
        totalCount: { $sum: "$dailyHistory.count" },
      },
    },
    {
      $sort: { "_id.date": 1 },
    },
  ]);
};

// Get monthly trend (all months)
counterSchema.statics.getMonthlyTrend = function (userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$dailyHistory",
    },
    {
      $group: {
        _id: {
          year: { $year: "$dailyHistory.date" },
          month: { $month: "$dailyHistory.date" },
        },
        totalCount: { $sum: "$dailyHistory.count" },
        days: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ]);
};

// Get yearly trend (all years)
counterSchema.statics.getYearlyTrend = function (userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$dailyHistory",
    },
    {
      $group: {
        _id: {
          year: { $year: "$dailyHistory.date" },
        },
        totalCount: { $sum: "$dailyHistory.count" },
        days: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1 },
    },
  ]);
};

// Get all-time stats
counterSchema.statics.getAllTimeStats = function (userId) {
  return this.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        totalLifetimeCount: { $sum: "$count" },
        totalWords: { $sum: 1 },
        oldestRecord: { $min: "$createdAt" },
        newestRecord: { $max: "$lastCountDate" },
      },
    },
  ]);
};

export const Counter = mongoose.model("Counter", counterSchema);

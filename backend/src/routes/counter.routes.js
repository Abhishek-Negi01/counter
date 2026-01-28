import { Router } from "express";
import {
  incrementCounter,
  getAllCounters,
  getCounter,
  resetCounter,
  getTodayStats,
  getWeeklyTrend,
  getMonthlyTrend,
  getAllTimeStats,
} from "../controllers/counter.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// all routes are protect here

router.use(verifyJWT);

// counter operations
router.route("/increment").post(incrementCounter);
router.route("/").get(getAllCounters);
router.route("/:word").get(getCounter);
router.route("/reset/:word").put(resetCounter);

// Analytics endpoints
router.route("/analytics/today").get(getTodayStats);
router.route("/analytics/weekly").get(getWeeklyTrend);
router.route("/analytics/monthly").get(getMonthlyTrend);
router.route("/analytics/all-time").get(getAllTimeStats);

export default router;

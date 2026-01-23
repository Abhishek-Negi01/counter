import { Router } from "express";
import {
  incrementCounter,
  getAllCounters,
  getCounter,
  resetCounter,
} from "../controllers/counter.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// all routes are protect here

router.use(verifyJWT);

router.route("/increment").post(incrementCounter);
router.route("/").get(getAllCounters);
router.route("/:word").get(getCounter);
router.route("/reset/:word").put(resetCounter);

export default router;

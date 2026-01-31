import { Router } from "express";

import { upload } from "../middlewares/upload.middlewares.js";
import { processSTT } from "../controllers/stt.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/process").post(verifyJWT, upload.single("audio"), processSTT);

export default router;

import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { normalizeAndCount } from "../utils/normalization.js";
import { Counter } from "../models/counter.models.js";

export const processSTT = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio uploaded" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const audioPath = path.resolve(req.file.path);
    const userId = req.user._id;

    exec(
      `python speech-to-text/whisper_service.py "${audioPath}"`,
      async (err, stdout, stderr) => {
        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);

        if (err) {
          return res.status(500).json({
            error: "Whisper failed",
            details: stderr,
          });
        }

        let parsed;
        try {
          parsed = JSON.parse(stdout);
        } catch {
          return res.status(500).json({
            error: "Invalid whisper output",
            raw: stdout,
          });
        }

        const text = parsed.text;

        // const words = text
        //   .toLowerCase()
        //   .replace(/[^\w\s]/g, "")
        //   .split(/\s+/);

        // Get user's current words as allowed set
        const userCounters = await Counter.find({ userId }).select("word");
        const allowedWords = new Set(userCounters.map((c) => c.word));
        // Pipeline: tokenize → normalize → filter → count
        const tokens = text
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/);

        const speechCounts = normalizeAndCount(tokens, allowedWords);

        // Batch database updates
        const updatedCounts = await batchUpdateCounters(userId, speechCounts);

        res.json({
          transcript: text,
          wordCounts: updatedCounts,
        });
      },
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "STT processing error",
    });
  }
};

// Optimized batch counter updates
const batchUpdateCounters = async (userId, speechCounts) => {
  if (Object.keys(speechCounts).length === 0) return {};

  const words = Object.keys(speechCounts);
  const existingCounters = await Counter.find({
    userId,
    word: { $in: words },
  });

  const bulkOps = [];
  const updatedCounts = {};
  const now = new Date();

  for (const [word, count] of Object.entries(speechCounts)) {
    const existing = existingCounters.find((c) => c.word === word);

    if (existing) {
      bulkOps.push({
        updateOne: {
          filter: { _id: existing._id },
          update: {
            $inc: { count: count, todayCount: count },
            $set: { lastCountDate: now },
          },
        },
      });
      updatedCounts[word] = existing.count + count;
    }
  }

  if (bulkOps.length > 0) {
    await Counter.bulkWrite(bulkOps);
  }

  return updatedCounts;
};

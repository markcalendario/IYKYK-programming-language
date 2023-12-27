import express from "express";
import { handleDownloadSessionCode } from "./codes.handlers.js";
const router = express.Router();

router.get("/download/:sessionId", handleDownloadSessionCode);

export default router;

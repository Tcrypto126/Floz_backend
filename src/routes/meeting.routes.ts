import { Router } from "express";
import {
  createOne,
  takeOneById,
  takeAll,
  updateOneById,
  deleteById,
  getAllMeetings,
  getMeetingData,
  generateEmail
} from "../controller/meeting/meeting.controller";

const router = Router();

router.get("/:id", takeOneById);
router.get("/:meetingId/meetingData", getMeetingData);
router.get("/", takeAll);
router.get("/all_meetings/:id", getAllMeetings);
router.post("/", createOne);
router.patch("/:id", updateOneById);
router.delete("/:id", deleteById);
router.post("/:id/generateEmail", generateEmail);

export default router;

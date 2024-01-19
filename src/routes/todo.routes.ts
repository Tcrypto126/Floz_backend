import { Router } from "express";
import {
  createOne,
  takeOneById,
  takeAll,
  updateOneById,
  deleteById,
  deleteByMeetingId,
  fetchAllByProjectId
} from "../controller/todo/todo.controller";

const router = Router();

router.get("/:id", takeOneById);
router.get("/", takeAll);
router.get("/all/:projectId", fetchAllByProjectId);
router.post("/", createOne);
router.patch("/:id", updateOneById);
router.delete("/:id", deleteById);
router.delete("/meeting/:id", deleteByMeetingId);

export default router;

import { Router } from "express";
import {
  createOne,
  takeOneById,
  takeAll,
  updateOneById,
  deleteById,
} from "../controller/transcript/transcript.controller";

const router = Router();

router.get("/:id", takeOneById);
router.get("/", takeAll);
router.post("/", createOne);
router.patch("/:id", updateOneById);
router.delete("/:id", deleteById);

export default router;

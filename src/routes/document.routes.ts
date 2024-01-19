import { Router } from "express";
import {
  createOne,
  takeOneById,
  takeAll,
  updateOneById,
  deleteById,
  allDocument
} from "../controller/document/document.controller";

const router = Router();

router.get("/:id", takeOneById);
router.get("/", takeAll);
router.get("/:projectId/all", allDocument);
router.post("/", createOne);
router.patch("/:id", updateOneById);
router.delete("/:id", deleteById);

export default router;

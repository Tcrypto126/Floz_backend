import { Router } from "express";
import {
  signIn,
  signUp,
  takeUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserMeetings,
  getUserTodos
} from "../controller/user/user.controller";

const router = Router();

router.get("/:id", takeUser);
router.get("/:id/meetings", getUserMeetings);
router.get("/:id/todos", getUserTodos);
router.get("/", getUsers);
router.post("/signIn", signIn)
router.post("/", signUp);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;

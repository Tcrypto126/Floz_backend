import { Router } from "express";
import usersRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import documentRoutes from "./document.routes"
import financialRoutes from "./financial.routes";
import meetingRoutes from "./meeting.routes";
import personRoutes from "./person.routes";
import transcriptRoutes from "./transcript.routes";
import todoRoutes from "./todo.routes";
import eventRoutes from "./event.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/projects", projectRoutes);
router.use("/documents", documentRoutes);
router.use("/financial", financialRoutes);
router.use("/meetings", meetingRoutes);
router.use("/persons", personRoutes);
router.use("/transcripts", transcriptRoutes);
router.use("/todos", todoRoutes);
router.use("/events", eventRoutes);

export default router;

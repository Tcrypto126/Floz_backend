require("dotenv").config();
import { Router, Request } from "express";
import {
  createOne,
  takeOneById,
  takeAll,
  updateOneById,
  deleteById,
  uploadMetingAudio,
  uploadProjectFile
} from "../controller/project/project.controller";

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: "us-east-1",
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "floz-audio-documents",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: any, cb: (arg0: null, arg1: string) => void) {
      cb(null, `audio/${req.params.id}_${req.body.meetingId}_${file.originalname}`);
    },
  }),
});

const uploadFile = multer({
  storage: multerS3({
    s3,
    bucket: "floz-audio-documents",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: Request, file: any, cb: (arg0: null, arg1: string) => void) {
      cb(null, `documents/${req.params.id}_${file.originalname}`);
    },
  }),
});
const router = Router();

router.get("/:id", takeOneById);
router.get("/", takeAll);
router.post("/", createOne);
router.post("/:id/uploadAudio", upload.single("meetingAudio"), uploadMetingAudio);
router.post("/:id/uploadFile", uploadFile.array("documentFiles",5), uploadProjectFile);
router.patch("/:id", updateOneById);
router.delete("/:id", deleteById);

export default router;

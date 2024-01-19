import { Project, Meeting, Transcript, DocumentModel, Todo } from "../../models";
import { ITodo } from "../../models/todo.model";
import { IProject } from "../../models/project.model";
import { transcribeS3File } from "../../deepgram/transcribe";
import { getTranscriptSummary, getToDosFromSummary } from "../../chatgpt/chat";
import logger from "../../tools/winston";
import { IDocument } from "../../models/document.model";
import { S3 } from "aws-sdk";
const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: "us-east-1",
});
interface file {
  fieldname: string,
  originalname: string,
  mimetype: string,
  size: number,
  bucket: string,
  key: string,
  contentType: string,
  location: string,
};

export const getById = async (_id: string) => {
  try {
    const data = await Project.findById(_id);
    return data;
  } catch (error) {

  }
};

export const findMany = async (query: any) => {
  try {
    const data = await Project.find(query);
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: IProject) => {
  try {
    const data = await Project.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: IProject) => {
  try {
    const data = Project.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteOne = async (_id: string) => {
  try {
    const response = Project.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadAndSaveMeetingData = async (projectId: string, meetingId: string, audio: file) => {
  try {
    let document: IDocument | null;
    const existingDocument = await DocumentModel.findOne({
      projectId,
      meetingId,
      type: { $in: [/audio/i, /video/i] }
    });

    if (existingDocument && existingDocument._id) {
      document = await DocumentModel.findOneAndUpdate(
        { _id: existingDocument._id },
        {
          s3Key: audio.key,
          s3Bucket: audio.bucket,
          fileName: audio.key.split('_')[1],
          path: audio.location,
          type: audio.mimetype,
        },
        { new: true } // This option returns the updated document
      );
    } else {
      document = await DocumentModel.create({
        s3Key: audio.key,
        s3Bucket: audio.bucket,
        fileName: audio.key.split('_')[1],
        path: audio.location,
        type: audio.mimetype,
        projectId,
        meetingId
      });
    }

    if (!document) {
      throw new Error("Document not found");
    }
    logger.info("Document created");

    logger.info("Transcribing audio...");
    const { transcript: transcribedText, paragraph: transcriptBySpeaker } = await transcribeS3File(
      audio.bucket,
      audio.key,
      audio.mimetype
    )
    logger.info("Transcribed audio.");

    if (transcribedText) {
      let trascriptObj: any;
      const existingTranscript = await Transcript.findOne({
        meetingId,
        documentId: document._id,
      });

      if (existingTranscript && existingTranscript._id) {
        trascriptObj = await Transcript.findOneAndUpdate(
          { _id: existingTranscript._id },
          {
            transcript: transcribedText,
            transcriptSummary: transcriptBySpeaker,
            $unset: {
              emailSummary: 1,
              todos: 1
            }
          },
          { new: true } // This option returns the updated document
        );
      } else {
        trascriptObj = await Transcript.create({
          transcript: transcribedText,
          documentId: document._id,
          transcriptSummary: transcriptBySpeaker,
          meetingId
        });
      }

      if (!trascriptObj) {
        throw new Error("Transcript not found or could not be created");
      }

      getTranscriptSummary(transcribedText).then(summary => {
        return Transcript.findByIdAndUpdate({ _id: trascriptObj?._id }, {
          emailSummary: summary
        });
      }).catch(error => {
        logger.info("Error occured while creating meeting summary.");
        logger.error(error);
      })

      getToDosFromSummary(transcriptBySpeaker).then(todos => {
        const todoObj = JSON.parse(todos);
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 3);

        const assignPeopleMap:Record<string,string> = {};

        const tasks: any[] = [];
        for (const speaker in todoObj) {
          assignPeopleMap[speaker] = '';
          todoObj[speaker].todolist.forEach((todo: any, index: number) => {
            tasks.push({
              title:`Task ${index + 1}`,
              assignedPerson:speaker,
              description: todo.task,
              dueDate: dueDate,
              status: "pending",
              projectId,
              meetingId,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          });
        }

        if (tasks.length > 0) {
          Todo.deleteMany({ meetingId, projectId }).then(() => Todo.create(tasks));
        }
        Meeting.findByIdAndUpdate({_id: meetingId}, {
          assignPeopleMap: assignPeopleMap
        });
        return Transcript.findByIdAndUpdate({ _id: trascriptObj?._id }, {
          todos: todoObj
        });
      }).catch(error => {
        logger.info("Error occured while creating summary and todos.");
        logger.error(error);
      });
    }

    return { meetingId };
  } catch (error) {
    throw error;
  }
};


export const uploadAndSaveProjectFileData = async (projectId: string, file: file) => {
  try {
    let document: IDocument | null;
    const signedUrl = await s3.getSignedUrlPromise("getObject", {
      Bucket: file?.bucket, // Replace with your bucket name
      Key: file?.key,
      Expires: 60 * 5 // URL expires in 5 minutes
    });
    console.log('signed url ===>>>', signedUrl);

    document = await DocumentModel.create({
      s3Key: file.key,
      s3Bucket: file.bucket,
      fileName: file.key.split('_')[1],
      url: signedUrl,
      path: file.location,
      type: file.mimetype,
      projectId,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    logger.info("Document created");

    return { document };
  } catch (error) {
    throw error;
  }
};
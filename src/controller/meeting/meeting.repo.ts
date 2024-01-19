require("dotenv").config();
import { Meeting, Transcript, DocumentModel } from "../../models";
import { IMeeting } from "../../models/meeting.model";
import { generateEmail } from  "../../chatgpt/chat";
import { S3 } from "aws-sdk";
const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: "us-east-1",
});

export const getById = async (_id: string) => {
  try {
    const data = await Meeting.findById(_id).populate("members");
    return data;
  } catch (error) {
    
  }
};

export const findMany = async (query: any) => {
  try {
    const data = await Meeting.find(query).sort({date:-1, favourite:1});
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: IMeeting) => {
  try {
    const data = await Meeting.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: IMeeting) => {
  try {
    const data = Meeting.findByIdAndUpdate(_id, body, {
      new: true,
    }).populate('members');
    return data;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = Meeting.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const generateMeetingData = async (meetingId: string) => {
  try {
    const meetingObj = await Meeting.findById(meetingId).exec();

    if (!meetingObj) {
      throw new Error("Meeting not found");
    }

    // Check if document exist for this meeting
    const meetingDoc = await DocumentModel.findOne({ meetingId, projectId: meetingObj.projectId }).exec();

    if (!meetingDoc) {
      throw new Error("Document not found");
    }

    const transcriptObj = await Transcript.findOne({ meetingId }).exec();

    if (!transcriptObj) {
      throw new Error("Transcript not found");
    }

    const document = await DocumentModel.findById(transcriptObj?.documentId).exec();

    const signedUrl = await s3.getSignedUrlPromise("getObject", {
      Bucket: document?.s3Bucket, // Replace with your bucket name
      Key: document?.s3Key,
      Expires: 60 * 5 // URL expires in 5 minutes
    });

    return { ...JSON.parse(JSON.stringify(transcriptObj)), audioFileUrl: signedUrl };
  } catch (error) {
    throw error;
  }
}

export const generateEmailContent = async (role: string, name: string, summary: string) => {
  try {
    const emailContent = await generateEmail(role, name, summary);
    return emailContent;
  } catch (error) {
    throw error;
  }
}


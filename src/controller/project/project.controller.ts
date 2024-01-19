require("dotenv").config();
import { Request, Response } from "express";
import { response } from "../../types/response-body.type";
import {
  getById,
  findMany,
  updateOne,
  deleteOne,
  create,
  uploadAndSaveMeetingData,
  uploadAndSaveProjectFileData
} from "./project.repo";
import { file } from "googleapis/build/src/apis/file";

interface MulterRequest extends Request {
  file: {
    fieldname: string,
    originalname: string,
    mimetype: string,
    size: number,
    bucket: string,
    key: string,
    contentType: string,
    location: string,
  };
}

export const takeOneById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const data = await getById(id);
    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "Not found", data });
  } catch (error) {

    return response(res, 500, { message: "Error", data: error });
  }
}

export const takeAll = async (req: Request, res: Response) => {
  const query = req.query;

  try {
    const data = await findMany(query);
    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "All", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

export const createOne = async (req: Request, res: Response) => {
  try {
    const data = await create(req.body);

    return response(res, 200, { message: "Created", data: null });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

export const updateOneById = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const data = await updateOne(req.params.id, body);

    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "Updated", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};


export const deleteById = async (req: Request, res: Response) => {
  const _id = req.params.id;
  try {
    const data = await deleteOne(_id);

    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "Deleted", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

export const uploadMetingAudio = async (req: Request, res: Response) => {
  const _id = req.params.id;
  const audio = (req as MulterRequest).file;
  const meetingId = req.body.meetingId;
  try {
    const data = await uploadAndSaveMeetingData(_id, meetingId, audio);

    console.log(data);
    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "Uploaded and transcribed", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

export const uploadProjectFile = async (req: Request, res: Response) => {
  const _id = req.params.id;
  const files = (req as any).files;
  try {
    const uploadPromises = files.map(async (file: any) => {
      return await uploadAndSaveProjectFileData(_id, file);
    });

    const uploadedFilesData = await Promise.all(uploadPromises);

    console.log(uploadedFilesData);
    return response(res, 200, { message: "Uploaded files successfully", data: uploadedFilesData });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};


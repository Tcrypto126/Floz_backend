import { Request, Response } from "express";
import { response } from "../../types/response-body.type";
import {
  getById,
  findMany,
  updateOne,
  deleteOne,
  create
} from "./document.repo";
import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: "us-east-1",
});

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
  const query = req.params;
  try {
    const data = await findMany(query);
    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "All", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

export const allDocument = async (req: Request, res: Response) => {

  try {
    const data: any = await findMany({
      projectId: req.params.projectId,
      type: { $nin: [/audio/i, /video/i] }
    });
    // Update data URL with promises
    const updateUrlPromises = data.map((item: any) => {
      return new Promise(async (resolve, reject) => {
        const signedUrl = await s3.getSignedUrl("getObject", {
          Bucket: item?.s3Bucket, // Replace with your bucket name
          Key: item?.s3Key, // Replace with your object key
          Expires: 60 * 60 * 24 // URL expires in 24 hours (1 day)
        });
        item.url = signedUrl;
        resolve(item);
      });
    });

    // Wait for all promises to resolve
    const updatedData = await Promise.all(updateUrlPromises);
    if (!updatedData) return response(res, 404, { message: "Not found", data:updatedData });

    return response(res, 200, { message: "All", data:updatedData });
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


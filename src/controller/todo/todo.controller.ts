import { Request, Response } from "express";
import { response } from "../../types/response-body.type";
import {
  getById,
  findMany,
  updateOne,
  deleteOne,
  create,
  deleteMany
} from "./todo.repo";
import logger from "../../tools/winston";

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
  logger.info('Cleaning up and exiting Process. Received Signal - [%o]', req);
  try {
    const data = await findMany(query);
    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "All", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

export const fetchAllByProjectId = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  logger.info('Cleaning up and exiting Process. Received Signal - [%o]', req);
  try {
    const data = await findMany({ projectId });
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

    return response(res, 200, { message: "Created", data: data });
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

export const deleteByMeetingId = async (req: Request, res: Response) => {
  const _id = req.params.id;
  try {
    const data = await deleteMany({ meetingId: [_id] });

    if (!data) return response(res, 404, { message: "Not found", data });

    return response(res, 200, { message: "Deleted", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

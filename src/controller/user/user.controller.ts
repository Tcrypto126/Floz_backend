import { Request, Response } from "express";
import { response } from "../../types/response-body.type";
import { IUser } from "../../models/user.model";
import {
  getUserById,
  findMany,
  updateOne,
  deleteOne,
  create,
  getUserByEmail,
  getMeetingsByUserId,
  getTodosByUserId
} from "./user.repo";

export const takeUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const data = await getUserById(id);
    if (!data) return response(res, 404, { message: "User not found", data });
    
    return response(res, 200, { message: "User found", data });
  } catch (error) {
    
    return response(res, 500, { message: "Error", data: error });
  }
}

const  signIn = async ( req: Request, res: Response) => {
  let data = null;
  try {
    const body: IUser  = req.body; 

    const user = await getUserByEmail(body.email);
  if (user){
     data = await updateOne(user._id, { lastLogin: new Date() });
    return response(res, 200, { message: "User Last Login Updated", data: data });
  }
  
    data = await create(body);
    return response(res, 200, { message: "New User Created", data: data });
    
   } catch (error) {
      console.log(error);
      return response(res, 500, { message: "Error", data: error });
   }
}

const getUsers = async (req: Request, res: Response) => {
  const query = req.query;

  try {
    const data = await findMany(query);
    if (!data) return response(res, 404, { message: "Users not found", data });

    return response(res, 200, { message: "All Users", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

const signUp = async (req: Request, res: Response) => {
  try {
    const data = await create(req.body);

    return response(res, 200, { message: "User created", data: null });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const data = await updateOne(req.params.id, body);

    if (!data) return response(res, 404, { message: "User not found", data });

    return response(res, 200, { message: "User updated", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};


const deleteUser = async (req: Request, res: Response) => {
  const _id = req.params.id;
  try {
    const data = await deleteOne(_id);

    if (!data) return response(res, 404, { message: "User not found", data });

    return response(res, 200, { message: "User deleted", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
};

const getUserMeetings = async (req: Request, res: Response) => {
  const _id = req.params.id;
  try {
    const data = await getMeetingsByUserId(_id);
    if (!data) return response(res, 404, { message: "User meetings not found", data });

    return response(res, 200, { message: "User meetings found", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
}

const getUserTodos = async (req: Request, res: Response) => {
  const _id = req.params.id;
  try {
    const data = await getTodosByUserId(_id);
    if (!data) return response(res, 404, { message: "User todos not found", data });

    return response(res, 200, { message: "User todos found", data });
  } catch (error) {
    console.log(error);
    return response(res, 500, { message: "Error", data: error });
  }
}


export {
  signIn,
  signUp,
  getUsers,
  updateUser,
  deleteUser,
  getUserMeetings,
  getUserTodos
};

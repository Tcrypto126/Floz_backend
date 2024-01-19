import { Types } from "mongoose";
import { User, Project, Meeting, Todo } from "../../models";
import { IUser, IUpdateUser } from "../../models/user.model";

export const getUserById = async (_id: string) => {
  try {
    const user = await User.findById(_id);
    return user;
  } catch (error) {
    
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const data = await User.findOne({ email });
    return data;
  } catch (error) {
    throw error;
  }
};

export const findMany = async (query: any) => {
  try {
    const users = await User.find(query);
    return users;
  } catch (error) {
    throw error;
  }
};

export const create = async (user: IUser) => {
  try {
    const newUser = await User.create(user);
    return newUser;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: Types.ObjectId | string, user: IUpdateUser) => {
  try {
    const newUser = User.findByIdAndUpdate(_id, user, {
      new: true,
    });
    return newUser;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = User.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMeetingsByUserId = async (_id: string) => {
  try {
    const userObj = await User.findById(_id).exec();
    if (!userObj || !userObj._id) {
      return Promise.reject("User not found");
    }

    const projects = await Project.find({ userId: userObj._id }).exec();
    if (!projects || projects.length === 0) {
      return Promise.reject("No projects found");
    }

    const data = await Meeting.find({ projectId: { $in: projects.map((project) => project._id) } })
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTodosByUserId = async (_id: string) => {
  try {
    const userObj = await User.findById(_id).exec();

    if (!userObj || !userObj._id) {
      return Promise.reject("User not found");
    }

    const projects = await Project.find({ userId: userObj._id }).exec();

    if (!projects || projects.length === 0) {
      return Promise.reject("No projects found");
    }

    const data = await Todo.find({ projectId: { $in: projects.map((project) => project._id) } }).populate('meetingId').exec();

    return data;
  } catch (error) {
    throw error;
  }
}


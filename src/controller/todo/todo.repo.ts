import { Todo } from "../../models";
import { ITodo } from "../../models/todo.model";

export const getById = async (_id: string) => {
  try {
    const data = await Todo.findById(_id);
    return data;
  } catch (error) {
    
  }
};



export const findMany = async (query: any) => {
  try {
    const data = await Todo.find(query).populate("meetingId");
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: ITodo) => {
  try {
    const data = await Todo.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: ITodo) => {
  try {
    const data = Todo.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = Todo.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteMany = async (query: any) => {
  try {
    const response = Todo.deleteMany(query);
    return response;
  } catch (error) {
    throw error;
  }
};


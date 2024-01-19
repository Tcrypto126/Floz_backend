import { Event } from "../../models";
import { IEvent } from "../../models/event.model";

export const getById = async (_id: string) => {
  try {
    const data = await Event.findById(_id);
    return data;
  } catch (error) {
    
  }
};

export const findMany = async (query: any) => {
  try {
    const data = await Event.find(query);
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: IEvent) => {
  try {
    const data = await Event.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: IEvent) => {
  try {
    const data = Event.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = Event.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};


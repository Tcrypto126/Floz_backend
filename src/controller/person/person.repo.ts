import { Person } from "../../models";
import { IPerson } from "../../models/person.model";

export const getById = async (_id: string) => {
  try {
    const data = await Person.findById(_id);
    return data;
  } catch (error) {
    
  }
};

export const findMany = async (query: any) => {
  try {
    const data = await Person.find(query);
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: IPerson) => {
  try {
    const data = await Person.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: IPerson) => {
  try {
    const data = Person.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = Person.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};


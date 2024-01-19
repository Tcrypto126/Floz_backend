import { Financial } from "../../models";
import { IFinancial } from "../../models/financial.model";

export const getById = async (_id: string) => {
  try {
    const data = await Financial.findById(_id);
    return data;
  } catch (error) {
    
  }
};

export const findMany = async (query: any) => {
  try {
    const data = await Financial.find(query);
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: IFinancial) => {
  try {
    const data = await Financial.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: IFinancial) => {
  try {
    const data = Financial.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = Financial.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};


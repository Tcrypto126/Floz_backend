import { DocumentModel } from "../../models";
import { IDocument } from "../../models/document.model";

export const getById = async (_id: string) => {
  try {
    const data = await DocumentModel.findById(_id);
    return data;
  } catch (error) {
    
  }
};

export const findMany = async (query: any) => {
  try {
    const data = await DocumentModel.find(query);
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: IDocument) => {
  try {
    const data = await DocumentModel.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: IDocument) => {
  try {
    const data = DocumentModel.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = DocumentModel.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};


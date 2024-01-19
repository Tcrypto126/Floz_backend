import { Transcript } from "../../models";
import { ITranscript } from "../../models/transcript.model";

export const getById = async (_id: string) => {
  try {
    const data = await Transcript.findById(_id);
    return data;
  } catch (error) {
    
  }
};

export const findMany = async (query: any) => {
  try {
    const data = await Transcript.find(query);
    return data;
  } catch (error) {
    throw error;
  }
};

export const create = async (body: ITranscript) => {
  try {
    const data = await Transcript.create(body);
    return data;
  } catch (error) {
    throw error;
  }
};


export const updateOne = async (_id: string, body: ITranscript) => {
  try {
    const data = Transcript.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return data;
  } catch (error) {
    throw error;
  }
};


export const deleteOne = async (_id: string) => {
  try {
    const response = Transcript.findByIdAndDelete(_id);
    return response;
  } catch (error) {
    throw error;
  }
};


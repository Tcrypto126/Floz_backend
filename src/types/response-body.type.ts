import { Response } from "express";

type body = {
  message: string;
  data: any;
  error?: any;
};

const response = (res: Response, status: number, { message, data, error }: body) => {
  return res.status(status).json({ message, data, error });
};

export { response, body };

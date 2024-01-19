require("dotenv").config();
import axios, { AxiosResponse } from 'axios';
import logger from "../tools/winston";

export default function chat(input: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Define the API URL for chat completions
    const url = 'https://api.openai.com/v1/chat/completions'; // Ensure this is the correct URL for chat models

    // Set up the request headers with the API key
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    };

    // Set up the data payload for the API request
    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }], // This is the format for chat completions
    };

    // Make the API call using axios
    axios.post(url, data, { headers })
      .then((response: AxiosResponse) => {
        if (response.data.choices && response.data.choices.length > 0) {
          // Resolve the promise with the text content of the response
          resolve(response.data.choices[0].message.content); // Note the different structure here for chat completions
        } else {
          // If there are no choices in the response, reject the promise
          reject(new Error('No choices found in the OpenAI response'));
        }
      })
      .catch((error) => {
        // Reject the promise if there's an error making the API call
        console.error('Error during chat with OpenAI:', error.response?.status, error.response?.data);
        reject(error);
      });
  });
}

export const getTranscriptSummary = async (transcribedText: string) => {
  try {
    logger.info("Creating meeting summary.")
    const summary = await chat(`As a professional project manager with extensive experience in the construction industry, can you provide a summary of the following meeting? \n\n${transcribedText}`);
    logger.info("Meeting summary created.")
    return summary;
  } catch (error) {
    logger.error(error)
    throw error;
  }
}

export const getToDosFromSummary = async (summarizedText: string | undefined) => {
  try {
    logger.info("Creating todos form meeting summary.")
    const todos = await chat(`Give me todolist and cost, deadline in JSON file formated as {"Speaker A": { "todolist": [{ task, cost, deadline }] }}, for each person separated by Speaker A and B, C and etc. from this following meeting history \n\n"${summarizedText}"`);
    logger.info("Todos from meeting summary created.")
    return todos;
  } catch (error) {
    logger.error(error)
    throw error;
  }
}

export const generateEmail = async (role: string, name: string, summary: string): Promise<string> => {
  try {
    logger.info("Creating email content for meeting.")
    const emailContent = await chat(`generate the shortest email depended on the role of ${role} with this json data ${name} . \n\n${summary}`);
    logger.info("Email content for meeting created.")
    return emailContent as string;
  } catch (error) {
    logger.error(error)
    throw error;
  }
}

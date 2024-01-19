require("dotenv").config();
import * as fs from 'fs';
import { Deepgram } from '@deepgram/sdk';
import axios from 'axios';

const deepgramApiKey: string = '4ca52a5358670295ac50b22c1d0a6401e1f8a87b';
const deepgram = new Deepgram(deepgramApiKey);

const aws = require("aws-sdk");

aws.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: "us-east-1",
});

const s3 = new aws.S3();

// Function to replace speaker labels
function replaceSpeakers(text: string): string {
  // Define a regex pattern to match "Speaker" followed by a number
  const regex = /Speaker (\d+):/g;

  // Replace matches with Speaker A, Speaker B, etc.
  let replacedText = text.replace(regex, (_, speakerNumber) => `Speaker ${String.fromCharCode(65 + parseInt(speakerNumber, 10))}:`);

  return replacedText;
}

function transcribe(audioBuffer: Buffer, mimetype: string): Promise<{ transcript: string; paragraph: string }> {
  return new Promise((resolve, reject) => {
    const source = {
      buffer: audioBuffer,
      mimetype: mimetype,
    };

    deepgram.transcription
      .preRecorded(source, {
        smart_format: true,
        model: 'nova',
        diarize: true,
        punctuate:true,
        utterances:true
      })
      .then((response) => {
        const transcript = response.results?.channels[0]?.alternatives[0]?.transcript || "";
        const paragraph = response.results?.channels[0]?.alternatives[0]?.paragraphs?.transcript || "";
        resolve({ transcript, paragraph });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export const transcribeS3File = async (bucket: string, key: string, mimetype: string): Promise<{ transcript: string; paragraph: string }> => {
  try {
    // Download the audio file from S3
    const s3Object = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    // Transcribe the audio buffer
    let { transcript, paragraph } = await transcribe(s3Object.Body as Buffer, mimetype);

    if (paragraph) {
      // Replace speaker labels
      paragraph = replaceSpeakers(paragraph);
    }
  
    return { transcript, paragraph };
  } catch (error) {
    console.error('Error transcribing S3 file:', error);
    throw error;
  }
}



// module.exports = function transcribe(url) {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(url, { responseType: 'arraybuffer' })
//       .then((response) => {
//         const audio = response.data;
//         const source = {
//           buffer: audio,
//           mimetype: mimetype,
//         };
//
//         deepgram.transcription
//           .preRecorded(source, {
//             smart_format: true,
//             model: 'nova',
//           })
//           .then((response) => {
//             const transcript = response.results.channels[0].alternatives[0].transcript;
//             resolve(transcript);
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

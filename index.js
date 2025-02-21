require("dotenv").config();
const express = require('express');
const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
const transcribe = require("./src/deepgram/transcribe");
const chat = require("./src/chatgpt/chat");
const store = require("./src/store");
const { extractCost, extractDeadline, extractTodoList } = require("./src/utils/extractors");
const sendEmail = require("./src/utils/email");
const cors = require('cors')

const app = express();
const port = 3000;
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');


// Initialize the OAuth2 client globally
let oAuth2Client;

app.use(express.json());
app.use(cors())

app.get('/audio/:key', function(req, res) {

  console.log("received request");

  var key = req.params.key;

  var music = './data/audio/' + key;

  var stat = fs.statSync(music);
  range = req.headers.range;
  var readStream;

  if (range !== undefined) {
      var parts = range.replace(/bytes=/, "").split("-");

      var partial_start = parts[0];
      var partial_end = parts[1];

      if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
          return res.sendStatus(500); //ERR_INCOMPLETE_CHUNKED_ENCODING
      }

      var start = parseInt(partial_start, 10);
      var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
      var content_length = (end - start) + 1;

      res.status(206).header({
          'Content-Type': 'audio/wav',
          'Content-Length': content_length,
          'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
      });

      readStream = fs.createReadStream(music, {start: start, end: end});
  } else {
      res.header({
          'Content-Type': 'audio/wav',
          'Content-Length': stat.size
      });
      readStream = fs.createReadStream(music);
  }
  readStream.pipe(res);
});

// Function to get a new token after prompting for user authorization
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  // console.log('Authorize this app by visiting this URL:', authUrl);
  callback(authUrl);
}

// Function to create an OAuth2 client and start the authentication flow
function authorize(credentials, callback) {
  const { client_id, client_secret, redirect_uris } = credentials.web;
  oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token
  fs.readFile(TOKEN_PATH, (err, token) => {
    // console.log(token, TOKEN_PATH);
    if (err) {
      getNewToken(oAuth2Client, callback);
    } else {
      oAuth2Client.setCredentials(JSON.parse(token));
      callback();
    }
  });
}

app.get('/sendEmail', async (req, res) => {
  req.query.email = req.query.email || 'russell.johnson.navy@gmail.com';
  req.query.content = req.query.content || 'test';
  console.log(req.query.oAuthToken);
  const data = await sendEmail(req.query.oAuthToken, req.query.content, req.query.email);
  return data;
})

app.get('/test', (req, res) => {
  res.json({success: true});
})

app.get('/polish', async (req, res) => {
  try {
    const result = await chat(`polish this email. ${req.query.emailPrompt}`);
    res.json({result:result});
  } catch (error) {
    res.json({result:'error'})
  }
})

app.get('/send', async (req, res) => {
  req.query.email = req.query.email || 'russell.johnson.navy@gmail.com';
  req.query.content = req.query.content || 'test';
  console.log(req.query.oAuthToken);

  console.log("11111111111111111111111111111111111111111111111");
  fs.readFile(CREDENTIALS_PATH, async (err, content) => {

    const credentials = JSON.parse(content);
    const { client_id, client_secret, redirect_uris } = credentials.web;

    oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    
    fs.readFile(TOKEN_PATH, (err, token) => {
      // console.log(token, TOKEN_PATH);
      if (err) {
        // getNewToken(oAuth2Client, callback);
        console.error("Don't get token file")
      } else {
        // oAuth2Client.setCredentials(JSON.parse(token));
        token = JSON.parse(token);
        oAuth2Client.setCredentials({
          access_token: req.query.access_token,
          refresh_token: req.query.refresh_token,
        })
        sendEmail(oAuth2Client, req.query.email, req.query.content);
      }
    });
  });
})

app.get('/generateEmail', async (req, res) => {
  req.query.role = req.query.role || 'Project manager';
  req.query.name = req.query.name || 'Russell Johnson';
  req.query.summary = req.query.summary || '{"Speaker A":{"todoList":[{"task":"Get cost estimation for adding a new window to the bathroom","cost":"$300","deadline":"1 week"},{"task":"Receive multiple window options with different prices and types","cost":"N/A","deadline":"N/A"},{"task":"Send a follow-up email with all the necessary information","cost":"N/A","deadline":"N/A"}]},"Speaker B":{"todoList":[{"task":"Provide a cost estimation for adding a new window to the bathroom","cost":"$300","deadline":"1 week"},{"task":"Send multiple window options with different prices and types","cost":"N/A","deadline":"Tonight"}]}}';
  
  const result = await chat(`generate the shortest email depended on the role of ${req.query.role} with this json data ${req.query.name} . \n\n${req.query.summary}`);
  res.json({'result':result})
})

// get meegin summary and todolist and cost, deadline
app.get('/getMeetingData', async (req, res) => {
  const audioFilePath = path.join(__dirname, 'data/audio/audio3.mp4');
  const data = await explain_local(audioFilePath);
  res.send(data);
})

// Route to start the auth flow 
app.get('/auth', (req, res) => {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    
    if (err) return console.log('Error loading client secret file:', err);
    authorize(JSON.parse(content), (authUrl) => {
      res.redirect(authUrl);
    });
  });
});

// Route to handle OAuth2 callback
app.get('/oauth2callback', (req, res) => {
  const code = req.query.code;
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    console.log("ok")
    oAuth2Client.setCredentials(token);
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) return console.error(err);
      // console.log('Token stored to', TOKEN_PATH);
    });
    res.send(token);
    console.log("oauth2client", JSON.stringify(oAuth2Client), "=====", oAuth2Client);
  });
});

// local main function
async function explain_local(audioUrl) {
  try {
    const audioBuffer = fs.readFileSync(audioUrl);
    // const transcript = await transcribe(audioBuffer);
     const transcript = await transcribe(audioBuffer);
    //  console.log(transcript);
    
     const meetingSummary = await chat(`Summarize and seperate people by Speaker A and B, C and etc and their speech in this chatting histroy. and Show me? \n\n${transcript}`);
     const todosText = await chat(`give me todolist and cost, deadline in JSON file for each person seperated by Speaker A and B, C and etc  from this following meeting history  \n\n"${meetingSummary}"`);    
    //  const todos = extractTodoList(todosText);
    //  console.log("meetingSummary",meetingSummary);
    //  console.log("todos", todosText);
    //  const costs = await chat(`You are clever, And give me project desctiption and the cost from this chatting history. \n\n${transcript}"`)
    //  const deadlines = await chat(`You are clever, And give me project desctiption and the cost from this chatting history. \n\n"${transcript}"`);
     // Generate the email content using ChatGPT
    //  const summaryForEmail = await chat(`Please smmarize this chatting history. \n\n${transcript}`);
    //  const emailPrompt = await chat(`Please draft an email with the following details:Meeting Summary:${summaryForEmail} To-dos:${todos}  and Kindly format the email professionally.`);
     
     const data = {
       transcript:meetingSummary,
       todos: todosText,
     };
     console.log(data);
     console.log("Done!");
     return data;
  } catch (err) {
    console.error(err);
  }
}

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log(`Please visit http://localhost:${port}/auth to authenticate with Google`);
});

import express from "express";
import morgan from "morgan";
import routes from "./routes/routes";
import cors from "cors";
import sendEmail from "./utils/email";

const app = express();

app.use(cors({
    origin: "*",
}));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(routes);

app.post('/sendEmail', async (req, res) => {
    try {
        const email = req.body.email as Array<string>;
        const content = req.body.content as string;
        const oAuthToken = req.body.oAuthToken as string;
        const refreshToken = req.body.refreshToken as string;
    
        if (!email || !content || !oAuthToken) {
          return res.status(400).json({ error: 'Missing required parameters' });
        }
        const data = await sendEmail(oAuthToken, refreshToken, email, content)
        return res.status(200).json({ message: 'Email sent successfully', data });
    } catch (error) {
        return res.status(500).json({ message: 'Email not sent', error });
    }
  })

app.get("/", (req, res) => {
    res.send("Hello, Everything is working fine!");
});

export default app;

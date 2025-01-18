import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import twitchAnalytics from "./utils/twitchAnalytics";

import { UserRoute } from "./routes/user.route";

dotenv.config();

twitchAnalytics.initialize();

const app: Express = express();
const port = process.env.API_PORT || 3000;
const baseUrl = process.env.BASE_URL || "/";

app.get(baseUrl, (req, res) => {
    res.send("Hello");
});

app.use(baseUrl, UserRoute());

app.listen(port, () => {
    console.log(`Twitch Analytics is running at http://localhost:${port}${baseUrl}`);
});

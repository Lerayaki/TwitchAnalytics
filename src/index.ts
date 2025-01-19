import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import twitchAnalytics from "./utils/twitchAnalytics";

import { UserRoute } from "./routes/user.route";
import { StreamRoute } from "./routes/stream.route";

dotenv.config();
twitchAnalytics.initialize();

const app: Express = express();
const port = process.env.API_PORT || 3000;
const baseUrl = process.env.BASE_URL || "/";

app.use(baseUrl, UserRoute());
app.use(baseUrl, StreamRoute());

app.listen(port, () => {
    console.log(`Twitch Analytics is running at http://localhost:${port}${baseUrl}`);
});

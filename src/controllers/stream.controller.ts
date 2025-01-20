import { Response, Request } from "express";
import { HttpStatusCode } from "../constants/httpStatusCode";
import twitchAnalytics from "../utils/twitchAnalytics";
import { type TwitchResponse } from "../models/twitchAnalytics.model";

const getStreams = async (request: Request, response: Response) => {
    try {
        const twitchResponse: TwitchResponse = await twitchAnalytics.getStreams();

        switch (twitchResponse.status) {
            case HttpStatusCode.OK:
                response.status(HttpStatusCode.OK).json(twitchResponse.streams);
                break;
            case HttpStatusCode.NOT_FOUND:
                response.status(HttpStatusCode.NOT_FOUND).json({ error: "User not found." });
                break;
            case HttpStatusCode.UNAUTHORIZED:
                response
                    .status(HttpStatusCode.UNAUTHORIZED)
                    .json({ error: "Unauthorized. Twitch access token is invalid or has expired." });
                break;
            default:
                throw new Error();
        }
    } catch (error) {
        response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: "Internal server error." });
    }
};

export { getStreams };

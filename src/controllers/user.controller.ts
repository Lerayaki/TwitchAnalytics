import { Request, Response } from "express";
import { HttpStatusCode } from "../constants/httpStatusCode";
import twitchAnalytics from "../utils/twitchAnalytics";
import { type TwitchResponse } from "../models/twitchAnalytics.model";

const getUser = async (request: Request, response: Response) => {
    try {
        const id = request.query.id as string;

        if (!twitchAnalytics.validateUserId(id)) {
            response.status(HttpStatusCode.BAD_REQUEST).json({ error: "Invalid or missing 'id' parameter." });
            return;
        }

        const twitchResponse: TwitchResponse = await twitchAnalytics.getUser(id);

        switch (twitchResponse.status) {
            case HttpStatusCode.OK:
                response.status(HttpStatusCode.OK).json(twitchResponse.user);
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

export { getUser };

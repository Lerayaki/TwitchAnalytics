import { Request, Response } from "express";
import { HttpStatusCode } from "../constants/httpStatusCode";
import twitchAnalytics, { type TwitchUserResponse } from "../utils/twitchAnalytics";

const isValidUserId = (id: string): boolean => {
    return !!id && id.length < 11 && !isNaN(Number(id)) && Number(id) > 0;
};

const getUser = async (request: Request, response: Response) => {
    try {
        const id = request.query.id as string;

        if (!isValidUserId(id)) {
            response.status(HttpStatusCode.BAD_REQUEST).json({ error: "Invalid or missing 'id' parameter." });
            return;
        }

        const twitchUserResponse: TwitchUserResponse = await twitchAnalytics.getUser(id);

        switch (twitchUserResponse.status) {
            case HttpStatusCode.OK:
                response.status(HttpStatusCode.OK).json(twitchUserResponse.user);
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

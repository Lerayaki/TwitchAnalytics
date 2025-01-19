import { HttpStatusCode } from "../constants/httpStatusCode";

export type TwitchToken = {
    access_token: string;
    expires_in: number;
    token_type: string;
};

export type TwitchUser = {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    created_at: string;
};

export type TwitchStream = {
    title: string;
    user_name: string;
};

export type TwitchResponse = {
    status: number;
    user?: TwitchUser;
    streams?: TwitchStream[];
};

var token: TwitchToken;
const getToken = (): TwitchToken => {
    return token;
};
const setToken = (value: TwitchToken): void => {
    token = value;
};
const getAccessToken = (): string | undefined => {
    return token?.access_token ?? undefined;
};

const initialize = async (): Promise<void> => {
    try {
        const token = await getTwitchToken();

        if (token) {
            setToken(token);
        }
    } catch (error) {
        console.log("[twitchAnalytics] initialize: ", error);
        throw error;
    }
};

const getTwitchToken = async (): Promise<TwitchToken | undefined> => {
    const clientId = process.env.TWITCH_OAUTH_CLIENT_ID as string;
    const clientSecret = process.env.TWITCH_OAUTH_CLIENT_SECRET as string;
    const twitchUrl = process.env.TWITCH_OAUTH_URL as string;

    try {
        const searchParams = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
        });

        const response = await fetch(`${twitchUrl}/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: searchParams.toString(),
        });

        if (!response.ok) {
            return;
        }

        const token = (await response.json()) as TwitchToken;

        return token;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const validateToken = async (): Promise<boolean> => {
    const twitchUrl = process.env.TWITCH_OAUTH_URL as string;

    try {
        const access_token = getAccessToken();

        const response = await fetch(`${twitchUrl}/validate`, {
            method: "GET",
            headers: {
                Authorization: `OAuth ${access_token}`,
            },
        });

        if (!response.ok) {
            const token = await getTwitchToken();
            if (token) {
                setToken(token);
                return true;
            }
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

const getUser = async (id: string): Promise<TwitchResponse> => {
    const clientId = process.env.TWITCH_OAUTH_CLIENT_ID as string;
    const twitchApiUrl = process.env.TWITCH_API_URL as string;

    try {
        if (!validateToken()) {
            return { status: HttpStatusCode.UNAUTHORIZED, user: undefined };
        }

        const twitchResponse = await fetch(`${twitchApiUrl}/users?id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                "Client-Id": clientId,
            },
        });

        if (!twitchResponse.ok) {
            if (twitchResponse.status == HttpStatusCode.UNAUTHORIZED) {
                return { status: HttpStatusCode.UNAUTHORIZED };
            }
            return { status: HttpStatusCode.INTERNAL_SERVER_ERROR };
        }

        const responseData = await twitchResponse.json();

        if (!responseData?.data || !Array.isArray(responseData.data) || responseData.data.length != 1) {
            return { status: HttpStatusCode.NOT_FOUND, user: undefined };
        }

        const user = responseData.data[0] as TwitchUser;
        return { status: HttpStatusCode.OK, user: user };
    } catch (error) {
        return { status: HttpStatusCode.INTERNAL_SERVER_ERROR };
    }
};

const getStreams = async (): Promise<TwitchResponse> => {
    const clientId = process.env.TWITCH_OAUTH_CLIENT_ID as string;
    const twitchApiUrl = process.env.TWITCH_API_URL as string;

    try {
        if (!validateToken()) {
            return { status: HttpStatusCode.UNAUTHORIZED, user: undefined };
        }

        const twitchResponse = await fetch(`${twitchApiUrl}/streams`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                "Client-Id": clientId,
            },
        });

        if (!twitchResponse.ok) {
            if (twitchResponse.status == HttpStatusCode.UNAUTHORIZED) {
                return { status: HttpStatusCode.UNAUTHORIZED };
            }
            return { status: HttpStatusCode.INTERNAL_SERVER_ERROR };
        }

        const responseData = await twitchResponse.json();

        if (!responseData?.data || !Array.isArray(responseData.data || responseData.data.length != 1)) {
            return { status: HttpStatusCode.NOT_FOUND, streams: undefined };
        }

        const streams: TwitchStream[] = responseData.data.map(
            (stream: any): TwitchStream => ({ title: stream.title, user_name: stream.user_name })
        );

        return { status: HttpStatusCode.OK, streams: streams };
    } catch (error) {
        return { status: HttpStatusCode.INTERNAL_SERVER_ERROR };
    }
};

export default { getToken, initialize, getAccessToken, getUser, getStreams };

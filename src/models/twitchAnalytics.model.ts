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

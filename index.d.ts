declare global {
    namespace NodeJS {
        interface ProcessEnv {
            APP_ID: string;
            CLIENT_SECRET: string;
            DISCORD_API_HOST: string;
            OAUTH_REDIRECT_URI: string;
        }
    }
}

export {};

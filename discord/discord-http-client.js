import axios from "axios";
import AxiosCurlirize from "axios-curlirize";
import url from "url";

export default class DiscordHtttpClient {
    static instance;

    constructor() {
        this.axios = axios.create({
            baseURL: process.env.DISCORD_API_HOST,
        });
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new DiscordHtttpClient();
        }

        return this.instance;
    }

    async oauth(code) {
        const formData = new url.URLSearchParams({
            client_id: process.env.APP_ID.toString(),
            client_secret: process.env.CLIENT_SECRET.toString(),
            grant_type: "authorization_code",
            code: code.toString(),
            //redirect_uri: process.env.OAUTH_REDIRECT_URI.toString()
        });
        AxiosCurlirize(this.axios);
        return await this.axios.post("/oauth2/token", formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    }
}

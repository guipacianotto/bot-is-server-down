import "dotenv/config";
import express from "express";
import {
    InteractionType,
    InteractionResponseType,
    InteractionResponseFlags,
    MessageComponentTypes,
    ButtonStyleTypes,
} from "discord-interactions";
import { VerifyDiscordRequest, getRandomEmoji, DiscordRequest } from "./utils.js";
import { getShuffledOptions, getResult } from "./game.js";
import FirebaseHandler from "./firebase/firebase-connector.js";
import RolesHandlerFirebase from "./roles/roles-handler-firebase.js";
import DiscordHtttpClient from "./discord/discord-http-client.js";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

FirebaseHandler.getInstance();
RolesHandlerFirebase.getInstance();

//console.log("Roles: ", await RolesHandlerFirebase.getInstance().getRoles())

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
    // Interaction type and data
    const { type, id, data } = req.body;

    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        // "test" command
        if (name === "test") {
            // Send a message into the channel where command was triggered from
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    // Fetches a random emoji to send from a helper function
                    content: "hello world " + getRandomEmoji(),
                },
            });
        }
    }
});

app.get("/oauth", async function (req, res) {
    const { code } = req.query;

    if (code) {
        const discorHttpClient = DiscordHtttpClient.getInstance();

        const output = await discorHttpClient.oauth(code);

        return res.send(output);
    }

    return res.send({ error: "code not provided." });
});

app.listen(PORT, () => {
    console.log("Listening on port", PORT);
});

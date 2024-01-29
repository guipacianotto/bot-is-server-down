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
import DiscordWordHandler from "./discord/discord-word-handler.js";
import RoleAuthenticator from "./roles/role-authenticator.js";

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
app.post("/interactions", 
    RoleAuthenticator.auth, 
    async function (req, res) {
    // Interaction type and data
    const { type, id, data, member, guild_id, token } = req.body;

    console.log("body: ",req.body);

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
                    content: "Olá " + member.user.global_name
                },
            });
        }

        if(name === "test-user") {

            /* const availableRoles = RolesHandlerFirebase.getInstance().getRoles(); */



            const firebaseRoles = await RolesHandlerFirebase.getInstance().fetchRolesByGuild(guild_id);

            const discordHttpClient = DiscordHtttpClient.getInstance();
            const guildRoles = (await discordHttpClient.getGuildRoles(guild_id)).data;

            const jsonContentGuildRoles = JSON.stringify(guildRoles, null, "\t");
            const jsonContentFirebaseRoles = JSON.stringify(firebaseRoles, null, "\t")

            const output = "Olá " + 
                member.user.global_name + 
                " \nguild_id: " + guild_id + 
                " \nGuild Roles: ```json\n" + jsonContentGuildRoles +"```" +
                " \nFirebase Roles: ```json\n" + jsonContentFirebaseRoles +  "```";

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: DiscordWordHandler.formatMessage(output, "**Mensagem muito longa, encurtando...**")
                }
            })
            
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

app.get("/guild", async function (req,res) {

  return req.send(await DiscordRequest("/guild/1197187451232473170", {}));
});

app.listen(PORT, () => {
    console.log("Listening on port", PORT);
});

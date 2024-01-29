//@ts-check

import { InteractionResponseType, InteractionType } from "discord-interactions";
import RolesHandlerFirebase from "./roles-handler-firebase.js";
import GlobalErrors from "../errors/global-errors.json" assert {type: "json"}
import ErrorHandler from "../errors/error-handler.js";

export default class RoleAuthenticator {

    /**
     * @param {any[]} rolesArray
     */
    static filterRolesById(rolesArray) {
        let result = [];

        for (let i = 0; i < rolesArray.length; i++) {
            result.push(rolesArray[i].id);
        }

        return result;
    }

    /**
     * @param {any[]} firebaseScopes
     * @param {string[]} memberRoles
     * @param {string} commandName
     * @returns {{title: string, message: string} | boolean}
     */
    static verifyRolePermission(firebaseScopes, memberRoles, commandName) {
        for (let i = 0; i < memberRoles.length; i++) {
            const element = memberRoles[i];
            
            if(!firebaseScopes[element]) {
                continue;
            }

            if(firebaseScopes[element]["commands-allowed"].includes(commandName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     * @param {import("express").NextFunction} next
     */
    static async auth(req, res, next) {
        const {type, guild_id, data, member} = req.body;

        if (type === InteractionType.APPLICATION_COMMAND) {
            const firebaseRoles = await RolesHandlerFirebase.getInstance().fetchRolesByGuild(guild_id);
            const {name} = data;
            const {roles} = member;
            
            if(!firebaseRoles) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: ErrorHandler.stringfy(GlobalErrors.auth["AUTH-003"])
                    }
                });
            }

            const verification = RoleAuthenticator.verifyRolePermission(firebaseRoles.scopes, roles, name);

            if(verification === true) {
                next();
            }
            
            if(verification === false) {
                return res.send({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: {
                        content: ErrorHandler.stringfy(GlobalErrors.auth["AUTH-002"])
                    }
                });
            }
        }

        
    }
}
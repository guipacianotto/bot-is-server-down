//@ts-check
export default class DiscordWordHandler {
    //farei aqui um handler para o número máximo de caracteres que o discord permite nas mensagens
    
    static DISCORD_MAX_CHARS = 2000;

    /**
     * @param {string} inputString
     * @param {string} target
     */
    static countOccurrences(inputString, target) {
        const regex = new RegExp(target, "g");
        return (inputString.match(regex) || []).length;
    }

    /**
     * @param {string} str
     * @param {number} offset
     */
    static cropMessage(str, offset) {
        if(this.isStringMaxed(str)) {
            return str.slice(0, this.DISCORD_MAX_CHARS - offset);
        }
        return str;
    }

    /**
     * @param {string} str
     * @param {string | undefined} label
     */
    static formatMessage(str, label) {
        if(this.isStringMaxed(str)) {
            if(label) {
                const croppedMessage = this.cropMessage(str, label.length);

                if(str.includes("```")) {
                    if(this.countOccurrences(croppedMessage, "```") % 2 != 0) {
                        const adjustedCroppetMessage = this.cropMessage(str, label.length + 3);

                        return adjustedCroppetMessage + "```" + label;
                    }
                }
                

                return croppedMessage + label;
            }
        }
        return str;
    }

    /**
     * 
     * @param {string} str 
     * @returns {boolean}
     */
    static isStringMaxed(str) {
        if(str.length > this.DISCORD_MAX_CHARS) {
            return true;
        }
        return false;
    }
}
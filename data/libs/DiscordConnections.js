const DiscordPlayer = require("./Player/DiscordPlayer.js");
const { getVoiceConnection } = require("@discordjs/voice");
const {VoiceChannel} = require("discord.js");
class DiscordConnections{
    constructor(){
        this.connections={};
    }
    /**
     * 
     * @param {string} guildId 
     * @returns {DiscordPlayer|undefined}
     */
    getconnection = (guildId)=>{return this.connections[guildId]}
    /**
     * 
     * @param {VoiceChannel} voice 
     * @returns {DiscordPlayer}
     */
    add = (voice)=>{return this.connections[voice.guildId]=new DiscordPlayer(voice)}
}
module.exports = DiscordConnections;
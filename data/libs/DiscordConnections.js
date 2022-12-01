const DiscordPlayer = require("./Player/DiscordPlayer.js");
const { getVoiceConnection, VoiceConnectionStatus } = require("@discordjs/voice");
const {VoiceChannel} = require("discord.js");
class DiscordConnections{
    constructor(){
        this.connections={};
    }
    /**
     * 
     * @param {string} guildId 
     * @returns {{connected:boolean,connection:DiscordPlayer|undefined}}
     */
    getconnection = (guildId)=>{
        let connection = getVoiceConnection(guildId)
        if(connection?.state?.status==VoiceConnectionStatus.Destroyed||
        connection?.state?.status==VoiceConnectionStatus.Disconnected) return {connected:false,connection:this.connections[guildId]};
        return {connected:true,connection:this.connections[guildId]};
    }
    /**
     * 
     * @param {VoiceChannel} voice 
     * @returns {DiscordPlayer}
     */
    add = (voice)=>{return this.connections[voice.guildId]=new DiscordPlayer(voice)}
    delete = (guildId)=>{delete this.connections[guildId]};
}
module.exports = DiscordConnections;
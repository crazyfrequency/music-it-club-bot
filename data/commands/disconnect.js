const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"disconnect",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:true,
    aliases:["d","leave"],
    permissions:["musicplayer"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, message, args, settings, {}={})=>{
        // return message.reply("Player offline!!!");
        var Player;
        if(message.guild.me.voice.channel&&client.connections.getconnection(message.guildId))
            Player = client.connections.getconnection(message.guildId);
        if(!Player) return message.react('❗').catch(()=>null);
        if(await Player.disconnect().catch(()=>null))
            message.react("✅").catch(()=>null);
    },
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Interaction} interaction 
     * @param {string[]} args 
     * @param {*} param3 
     */
    slashcommand:async (client, interaction, args, settings, {}={})=>{
        
    }
}
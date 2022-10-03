const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"repeat",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:true,
    aliases:[],
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
        switch(client.Auto(args[0])){
            case "0":Player.playlist.repeat=0;return message.react("✅").catch(()=>null);
            case "1":Player.playlist.repeat=1;return message.react("✅").catch(()=>null);
            case "2":Player.playlist.repeat=2;return message.react("✅").catch(()=>null);
            case "":Player.playlist.repeat=0;return message.react("✅").catch(()=>null);
            case "one":Player.playlist.repeat=1;return message.react("✅").catch(()=>null);
            case "all":Player.playlist.repeat=2;return message.react("✅").catch(()=>null);
            default:return message.react("❗").catch(()=>null);
        }
        
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
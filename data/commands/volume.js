const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"volume",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:true,
    aliases:["v","vol"],
    permissions:["musicplayer"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, message, args, settings, {}={})=>{
        // message.reply("Player offline!!!")
        var Player,volume=Number(client.Auto(args[0]).replace(",",".")
        .replace("ю",".").replace("б","."));
        if(message.guild.me.voice.channel)
            Player = client.connections.getconnection(message.guildId)
        else{
            return message.react('❗').catch(()=>null);
        }
        Player.options.setVolume(volume,Player.ffmpeg);
        
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
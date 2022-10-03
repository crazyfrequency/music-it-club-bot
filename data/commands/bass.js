const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"bass",
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
        // message.reply("Player offline!!!")
        var Player,bass=Number(client.Auto(args[0]).replace(",",".")
        .replace("ю",".").replace("б","."));
        if(message.guild.me.voice.channel)
            Player = client.connections.getconnection(message.guildId)
        else{
            return message.react('❗').catch(()=>null);
        }
        if(args[0]=="on")
            Player.options.setFilter("bass",10,Player.ffmpeg)
        else if(args[0]=="off")
            Player.options.setFilter("bass",0,Player.ffmpeg)
        else
            Player.options.setFilter("bass",bass,Player.ffmpeg);
        
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
const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"speed",
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
        var Player,speed=Number(client.Auto(args[0]).replace(",",".")
        .replace("ю",".").replace("б","."));
        if(message.guild.me.voice.channel)
            Player = client.connections.getconnection(message.guildId)
        else{
            return message.react('❗').catch(()=>null);
        }if(speed<0.5||speed>2) return message.react('❗').catch(()=>null);
        Player.options.setSpeed(speed,Player.ffmpeg);
        let position = Player.resource.playbackDuration/1000;
        Player.time =(Player.time+(position-Player.position)*Player.options.speed+0.2);
        Player.position=position;
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
const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"play",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:true,
    aliases:["p"],
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
        else if(message.member.voice.channel){
            Player = client.connections.add(message.member.voice.channel);
            message.reply(`Подключился к "<#${message.member.voice.channelId}>"`).catch(()=>null);
        }else{
            message.react('❗').catch(()=>null);message.reply('Подключитесь к каналу!').catch(()=>null);
            return;
        }if(!Player) return message.react('❗').catch(()=>null);
        if(args.length)
            Player.play(args.join(" "),message);
        else if(message.attachments.first()){
            Player.play("!LOCAL!",message);
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
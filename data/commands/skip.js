const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"skip",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:true,
    aliases:["s"],
    permissions:["musicplayer"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, message, args, settings={musicplayer:"all"}, {}={})=>{
        if(settings?.musicplayer=="all"||settings?.musicplayer==message.member.roles){
            var Player;
            if(message.guild.me.voice.channel)
                Player = client.connections.getconnection(message.guildId)
            else{
                message.react('❗').catch(()=>null);return;
            }
            let res=Player.skip(args[0]);
            if(res&&res!="ok") message.reply(`Удалён ${res.title}`).catch(()=>null);
            message.react("✅").catch(()=>null);
        }else{
            var Player;
            if(message.guild.me.voice.channel)
                Player = client.connections.getconnection(message.guildId)
            else{
                message.react('❗').catch(()=>null);return;
            }
            if(!message.member.voice?.channel)
            return message.reply("Вы не в голосовом канале");
            if(message.member.voice.channel.members.size>2){
                return message.reply("да да");
            }
            let res=Player.skip(args[0]);
            if(res&&res!="ok") message.reply(`Удалён ${res.title}`).catch(()=>null);
            message.react("✅").catch(()=>null);
            // message.reply().catch(()=>null);
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
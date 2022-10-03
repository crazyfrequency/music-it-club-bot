const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"join",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:true,
    aliases:["j","connect"],
    permissions:["musicplayer"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, message, args, settings, {}={})=>{
        if(false){message.react('❗');message.reply('Уже подключен!')}
        else{
            var voice=undefined
            if(args!=undefined&&args[0]!='') voice=await message.guild.channels.cache.find(channel => (channel.name === args[0]||channel.id === args[0]) && channel.type === 'GUILD_VOICE')
            if(voice!=undefined){
                client.connections[message.guildId]=new client.player(voice,message.channelId);
                message.react('✅');message.reply(`Подключился к "<#${voice.id}>"`);
                return
            }
            if(message.member.voice.channel!=undefined){
                client.connections[message.guildId]=new client.player(message.member.voice.channel,message.channelId);
                message.react('✅');message.reply(`Подключился к "<#${message.member.voice.channel.id}>"`);
            }else{
                message.react('❗');message.reply('Подключитесь к каналу!')
            }
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
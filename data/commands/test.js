const DiscordClient = require("../libs/client");
const {Interaction,MessageEmbed,Message, CommandInteraction, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"test",
    help:{
        description:"Test",
        options:[
            {
                name:"None"
            },
        ],
    },
    aliases:[],
    enable:true,
    permissions:["Test"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, message, args, settings, {}={})=>{
        // for(let i of message.attachments)
        //     if(i[1].contentType?.startsWith("audio")||[1].contentType?.startsWith("video"))
        //         console.log(i[1].url,1)
        // message.reply({content:"test",components:[new MessageActionRow().addComponents(
        //     new MessageButton().setCustomId("h1").setLabel("help").setStyle("SECONDARY")
        //     ),
        //     new MessageActionRow().addComponents(
        //         new MessageSelectMenu().setCustomId("select")
        //         .setPlaceholder("ok").setOptions([
        //             {label:"ok1",description:"ok1",value:"ok1"},
        //             {label:"ok2",description:"ok2",value:"ok2"}
        //         ])
        //     )
        // ]})
        console.log(message.author.id);
        if(message.author.id!="340070146276065281") return;
        var Player,speed=Number(client.Auto(args[0]).replace(",",".")
        .replace("ю",".").replace("б","."));
        if(message.guild.me.voice.channel)
            Player = client.connections.getconnection(message.guildId)
        else{
            return message.react('❗').catch(()=>null);
        }
        Player.ffmpeg.stdin.write(`^C${args.join(" ")}\n`);
    },
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {string[]} args 
     * @param {*} param3 
     */
    slashcommand:async (client, interaction, args, settings, {}={})=>{
        
    }
}
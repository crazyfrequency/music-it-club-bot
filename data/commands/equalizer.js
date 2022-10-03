const DiscordClient = require("../libs/client");
const {Message,Interaction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"equalizer",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:true,
    aliases:["eq"],
    permissions:["eq"],
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
        let menu=[];
        for(let i in Player.options.equalizer) menu.push({label:i,value:i});
        message.reply({
            embeds:[new MessageEmbed().setDescription(await Player.options.getEqualizer().catch(()=>null))],
            components:[
                new MessageActionRow().addComponents([
                    new MessageButton().setCustomId("equalizer:-5").setStyle("PRIMARY").setLabel("-5"),
                    new MessageButton().setCustomId("equalizer:-1").setStyle("PRIMARY").setLabel("-1"),
                    new MessageButton().setCustomId("equalizer:0").setDisabled(true).setStyle("SECONDARY").setLabel(" "),
                    new MessageButton().setCustomId("equalizer:+1").setStyle("PRIMARY").setLabel("+1"),
                    new MessageButton().setCustomId("equalizer:+5").setStyle("PRIMARY").setLabel("+5")
                ]),
                new MessageActionRow().addComponents([
                    new MessageSelectMenu().setCustomId("equalizer:HZ").setOptions(menu)
                ])
            ]
        })
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
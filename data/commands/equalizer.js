const DiscordClient = require("../libs/client");
const {interaction,Interaction, Bu, ActionRowBuilder, ButtonBuilder, SelectMenuBuilder} = require("discord.js");
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
    enable:false,
    aliases:["eq"],
    permissions:["eq"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
    command:async (client, interaction, settings, {}={})=>{
        // return interaction.reply("Player offline!!!");
        var Player;
        if(interaction.guild.me.voice.channel&&client.connections.getconnection(interaction.guildId))
            Player = client.connections.getconnection(interaction.guildId);
        if(!Player) return interaction.react('❗').catch(()=>null);
        let menu=[];
        for(let i in Player.options.equalizer) menu.push({label:i,value:i});
        interaction.reply({
            embeds:[new interactionEmbed().setDescription(await Player.options.getEqualizer().catch(()=>null))],
            components:[
                new ActionRowBuilder().addComponents([
                    new ButtonBuilder().setCustomId("equalizer:-5").setStyle("PRIMARY").setLabel("-5"),
                    new ButtonBuilder().setCustomId("equalizer:-1").setStyle("PRIMARY").setLabel("-1"),
                    new ButtonBuilder().setCustomId("equalizer:0").setDisabled(true).setStyle("SECONDARY").setLabel(" "),
                    new ButtonBuilder().setCustomId("equalizer:+1").setStyle("PRIMARY").setLabel("+1"),
                    new ButtonBuilder().setCustomId("equalizer:+5").setStyle("PRIMARY").setLabel("+5")
                ]),
                new ActionRowBuilder().addComponents([
                    new SelectMenuBuilder().setCustomId("equalizer:HZ").setOptions(menu)
                ])
            ]
        })
    },
}
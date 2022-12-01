const DiscordClient = require("../libs/client");
const {Interaction,interactionEmbed,interaction, CommandInteraction, interactionActionRow, interactionButton, interactionSelectMenu} = require("discord.js");
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
    enable:false,
    permissions:["Test"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
    command:async (client, interaction, settings, {}={})=>{
        // for(let i of interaction.attachments)
        //     if(i[1].contentType?.startsWith("audio")||[1].contentType?.startsWith("video"))
        //         console.log(i[1].url,1)
        // interaction.reply({content:"test",components:[new interactionActionRow().addComponents(
        //     new interactionButton().setCustomId("h1").setLabel("help").setStyle("SECONDARY")
        //     ),
        //     new interactionActionRow().addComponents(
        //         new interactionSelectMenu().setCustomId("select")
        //         .setPlaceholder("ok").setOptions([
        //             {label:"ok1",description:"ok1",value:"ok1"},
        //             {label:"ok2",description:"ok2",value:"ok2"}
        //         ])
        //     )
        // ]})
        console.log(interaction.author.id);
        if(interaction.author.id!="340070146276065281") return;
        var Player,speed=Number(client.Auto(args[0]).replace(",",".")
        .replace("ю",".").replace("б","."));
        if(interaction.guild.me.voice.channel)
            Player = client.connections.getconnection(interaction.guildId)
        else{
            return interaction.react('❗').catch(()=>null);
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
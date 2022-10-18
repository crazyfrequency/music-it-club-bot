const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"trackinfo",
    help:{
        description:"Информация по треку(без параметра отобразит всё)",
        options:[
            {
                name:"track",
                type:"string",
                description:"Интересующий трек(0 - текущий)",
                autocomplete:true
            },
        ],
    },
    enable:false,
    aliases:[],
    permissions:null,
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
    command:async (client, interaction, settings, {}={})=>{
        // interaction.reply("Player offline!!!")
        var Player,volume=interaction.options.get("value").value;
        if(client.connections.getconnection(interaction.guildId).connected)
            Player = client.connections.getconnection(interaction.guildId).connection
        else{
            return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        }
        Player.options.setVolume(volume,Player.ffmpeg);
        interaction.reply({content:`Громкость установлена на ${volume}`,ephemeral:true}).catch(()=>null);
    },
    /**
     * 
     * @param {DiscordClient} client 
     * @param {AutocompleteInteraction} interaction 
     * @param {*} param3 
     */
    autocomplete:async (client, interaction, settings, {}={})=>{
        let focusedValue = interaction.options.getFocused(),
        connection = client.connections.getconnection(interaction.guildId).connection,
        tracks=[connection.track].concat(connection.playlist.playlist);
        await interaction.member.respond(
            tracks.map((value,index)=>({name:`${index}: `+value.title,value:value.id.toString()})).splice(0,25)
        ).catch(()=>null)
    }
}
const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"pause",
    help:{
        description:"Останавливает воспроизведение",
        options:[],
    },
    enable:true,
    aliases:[],
    permissions:null,
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
     command:async (client, interaction, settings, {}={})=>{
        // return interaction.reply("Player offline!!!");
        var Player,connection=client.connections.getconnection(interaction.guildId);
        if(connection.connected&&connection.connection)
            Player = connection.connection;
        if(!Player) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        Player.pause();
        interaction.reply({content:`Остановленно.`,ephemeral:true}).catch(()=>null);
    },
}
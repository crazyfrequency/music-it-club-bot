const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"disconnect",
    help:{
        description:"Отключение от канала",
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
        let status = client.connections.getconnection(interaction.guildId);
        var Player;
        if(status.connected&&status.connection)
            Player = status.connection;
        if(!Player) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        delete client.connections.delete(Player.connection.joinConfig.guildId)
        if(await Player.disconnect().catch(()=>null))
            interaction.reply({content:'✅',ephemeral:true}).catch(()=>null);
    },
}
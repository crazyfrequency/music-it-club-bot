const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"ping",
    help:{
        description:"Проверка пинга",
        options:[],
    },
    enable:false,
    aliases:[],
    permissions:null,
    permissions_roles:[],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
     command:async (client, interaction, settings, {}={})=>{
        let connection = client.connections.getconnection(interaction.guildId).connection;
        interaction.reply({content:`🏓Pong!\nЗадержка API: ${client.bot.ws.ping}ms\n`+
        `${connection.connection.ping.ws}\n${connection.connection.ping.udp}`,ephemeral:true}).catch(()=>null);
    },
}
const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"musicinfo",
    help:{
        description:"Отображает информацию о треках(без параметров отображает плейлист)",
        options:[
            {
                name:"track",
                type:"string",
                description:"Подробная информация о треке",
                autocomplete:true
            },
        ],
    },
    enable:false,
    aliases:[],
    permissions:null,
    permissions_roles:["musicrole"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, interaction, args, settings={musicplayer:"all"}, {}={})=>{
        let value = Number(interaction.options.get("track")?.value);
        var Player,connection=client.connections.getconnection(interaction.guildId);
        if(connection.connected&&connection.connection)
            Player = connection.connection;
        if(!Player) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        if(value)
            return interaction.reply({content:"Трек:",embeds:[Player.find_id(value)?.getFullEmbed()],ephemeral:true});
        return interaction.reply({embeds:[Player.playlist.getEmbed()],ephemeral:true}).catch(()=>null);
        
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
        await interaction.respond(
            tracks.map((value,index)=>({name:`${index}: `+value.title,value:value.id.toString()}))
            .filter(value=>value.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0,25)
        ).catch(()=>null)
    }
}
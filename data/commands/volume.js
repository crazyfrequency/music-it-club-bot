const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"volume",
    help:{
        description:"Изменяет громкость",
        options:[
            {
                name:"value",
                type:"number",
                description:"значение громкости(1 - обычная)",
                required:true
            },
        ],
    },
    enable:true,
    aliases:[],
    permissions:["musicplayer"],
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
    }
}
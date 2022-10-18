const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"speed",
    help:{
        description:"Изменяет скорость воспроизведения",
        options:[
            {
                name:"value",
                type:"number",
                description:"значение скорости(1 - обычная)",
                required:true,
                min:0.5,
                max:2
            },
        ],
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
        // interaction.reply("Player offline!!!")
        var Player,speed=interaction.options.get("value").value;
        if(client.connections.getconnection(interaction.guildId).connected)
            Player = client.connections.getconnection(interaction.guildId).connection;
        else{
            return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        }
        Player.options.setSpeed(speed,Player.ffmpeg);
        let position = Player.resource.playbackDuration/1000;
        Player.time =(Player.time+(position-Player.position)*Player.options.speed+0.2);
        Player.position=position;
        interaction.reply({content:`Скорость установлена на ${speed}`,ephemeral:true}).catch(()=>null);
    }
}
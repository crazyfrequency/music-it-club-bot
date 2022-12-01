const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"repeat",
    help:{
        description:"Включение/выключение повтора трека",
        options:[
            {
                name:"mode",
                type:"string",
                description:"Режим",
                choices:["no","one","all"]
            },
        ],
    },
    enable:true,
    aliases:[],
    permissions:null,
    permissions_roles:["musicrole"],
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
        let mode = interaction.options.get("mode")?.value
        switch(mode){
            case "no":Player.playlist.repeat=0;return interaction.reply({content:"Установлен режим без повтора.",ephemeral:true}).catch(()=>null);
            case "one":Player.playlist.repeat=1;return interaction.reply({content:"Установлен режим повтора 1 трека.",ephemeral:true}).catch(()=>null);
            case "all":Player.playlist.repeat=2;return interaction.reply({content:"Установлен режим повтора всех треков.",ephemeral:true}).catch(()=>null);
            default:return interaction.reply({
                content:`${Player.playlist.repeat==0?"Выключен.":Player.playlist.repeat==1?"Включен повтор одного трека.":"Включен повтор всех треков."}`
                ,ephemeral:true}).catch(()=>null);
        }
        
    },
}
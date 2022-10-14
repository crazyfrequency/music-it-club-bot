const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"bass",
    help:{
        description:"Режим басса",
        options:[
            {
                name:"enable",
                type:"string",
                description:"Включение/выключение басса",
                choices:["on","off"]
            },
            {
                name:"db",
                type:"number",
                description:"Сила басса в db(0 без изменений, -10 на 10db тише)",
                min:-100,max:100
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
        let status = client.connections.getconnection(interaction.guildId);
        var Player,bass_enable=interaction.options.get("enable"),
        bass_value=interaction.options.get("db");
        if(status.connected&&status.connection)
            Player = client.connections.getconnection(interaction.guildId).connection;
        else{
            return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        }
        if(bass_enable)Player.options.bassboost=(bass_enable.value=="on");
        if(bass_value)Player.options.bassboostdegree=bass_value.value;
        if(bass_enable||bass_value)Player.options.setFilter("bass",undefined,Player.ffmpeg);
        interaction.reply({
            content:`Басс ${Player.options.bassboost?"включен":"выключен"}, значение установленно как ${Player.options.bassboostdegree}`,
            ephemeral:true}).catch(()=>null);
    },
}
const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"play",
    help:{
        description:"Проигрывает/добавляет в плейлист песню",
        options:[
            {
                name:"url",
                type:"string",
                description:"Ссылка на песню",
                required:true
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
        let status = client.connections.getconnection(interaction.guildId);
        var Player;console.log(interaction.member.voice)
        if(status.connected&&status.connection)
            Player = client.connections.getconnection(interaction.guildId).connection;
        else if(status.connection){
            Player = await status.connection.moveto();
        }else if(interaction.member.voice.channel){
            Player = client.connections.add(interaction.member.voice.channel);
            await interaction.reply(`Подключился к "<#${interaction.member.voice.channelId}>"`).catch(async(e)=>console.error(e));
        }else return interaction.reply({content:'Подключитесь к каналу!',ephemeral:true}).catch(()=>null);
        if(!Player) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        let url = interaction.options.get("url")
        if(url)
            Player.play(url.value,interaction);
        else if(interaction?.attachments?.first()){
            Player.play("!LOCAL!",interaction);
        }
    }
}
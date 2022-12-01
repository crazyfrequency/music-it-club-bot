const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"join",
    help:{
        description:"Подключить бота к голосовому каналу",
        options:[
            {
                name:"channel",
                type:"channel",
                description:"голосовой канал",
                channeltypes:[ChannelType.GuildVoice]
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
        let channel = interaction.options.get("channel");
        if(channel){
            let status = client.connections.getconnection(interaction.guildId);
            if(status.connection){
                if((status.connection.connection.joinConfig.channelId==channel.channel.id)&&status.connected)
                    return interaction.reply({content:"Уже подключен!",ephemeral:true}).catch(()=>null);
                let res = await status.connection.moveto(channel.channel).catch(()=>null);
                if(!res) return interaction.reply({content:"Ошибка",ephemeral:true}).catch(()=>null)
                interaction.reply({content:`Подключился к "<#${channel.channel.id}>"`}).catch(()=>null)
            }else{
                client.connections.add(channel.channel);
                interaction.reply({content:`Подключился к "<#${channel.channel.id}>"`}).catch(()=>null)
            }
        }else{
            let status = client.connections.getconnection(interaction.guildId);
            if(status.connected&&status.connection){
                return interaction.reply({content:"Уже подключен!",ephemeral:true}).catch(()=>null);
            }else if(status.connection){
                let Player = await status.connection.moveto();
                interaction.reply({content:`Подключился к "<#${Player.connection.joinConfig.channelId}>"`}).catch(()=>null)
            }else if(interaction.member.voice.channel){
                client.connections.add(interaction.member.voice.channel);
                await interaction.reply(`Подключился к "<#${interaction.member.voice.channelId}>"`).catch(async(e)=>console.error(e));
            }else return interaction.reply({content:'Подключитесь к каналу!',ephemeral:true}).catch(()=>null);
        }
    },
}
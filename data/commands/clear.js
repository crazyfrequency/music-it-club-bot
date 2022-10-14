const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"clear",
    help:{
        description:"",
        options:[
            {
                name:""
            },
        ],
    },
    enable:false,
    aliases:[],
    permissions:[],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
    command:async (client, interaction, settings, {}={})=>{
        let number;
        try{
           number = Number(args[0]) 
        }catch{number=0}
        try{await interaction.channel.bulkDelete(number+1)}catch{
            return await interaction.channel.send("Невозможно удалить!\n(Можно удалять сообщения отправленые не более 14 дней назад)")
            .then(async(mes)=>{
                interaction.delete().catch(async()=>{})
                setTimeout(() => {
                    mes.delete().catch(async()=>{})
                }, 3000);
            })
        }
        interaction.channel.send(`Удалено ${number} ${number%10==1?"сообщение":(number%10>=2&&number%10<=4)?"сообщения":"сообщений"}!`)
        .then(async(interaction)=>{
            setTimeout(() => {
                interaction.delete().catch(async()=>{})
            }, 3000);
        })
    },
}
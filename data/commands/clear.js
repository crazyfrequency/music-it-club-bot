const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
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
    enable:true,
    aliases:[],
    permissions:[],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, message, args, settings, {}={})=>{
        let number;
        try{
           number = Number(args[0]) 
        }catch{number=0}
        try{await message.channel.bulkDelete(number+1)}catch{
            return await message.channel.send("Невозможно удалить!\n(Можно удалять сообщения отправленые не более 14 дней назад)")
            .then(async(mes)=>{
                message.delete().catch(async()=>{})
                setTimeout(() => {
                    mes.delete().catch(async()=>{})
                }, 3000);
            })
        }
        message.channel.send(`Удалено ${number} ${number%10==1?"сообщение":(number%10>=2&&number%10<=4)?"сообщения":"сообщений"}!`)
        .then(async(message)=>{
            setTimeout(() => {
                message.delete().catch(async()=>{})
            }, 3000);
        })
    },
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Interaction} interaction 
     * @param {string[]} args 
     * @param {*} param3 
     */
    slashcommand:async (client, interaction, args, settings, {}={})=>{
        
    }
}
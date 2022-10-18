const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
const modes={"playing":0,"listening":2,"watching":3,"competing":5}
module.exports = {
    name:"status",
    help:{
        description:"Устанавливает статус бота",
        options:[
            {
                name:"mode",
                type:"string",
                description:"Режим",
                required:true,
                choices:["playing","listening","watching","competing"]
            },
            {
                name:"name",
                type:"string",
                description:"Текст статуса",
                required:true
            },
        ],
    },
    enable:true,
    aliases:[],
    permissions:PermissionFlagsBits.Administrator,
    permissions_roles:["musicrole"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
    command:async (client, interaction, settings, {}={})=>{
        // interaction.reply("Player offline!!!")
        try{
            client.bot.user.setActivity({name:interaction.options.get("name").value,
            type:modes[interaction.options.get("mode").value]})
            interaction.reply({content:"ok",ephemeral:true}).catch(()=>null)
        }catch{interaction.reply({content:"error",ephemeral:true}).catch(()=>null)}
    },
}
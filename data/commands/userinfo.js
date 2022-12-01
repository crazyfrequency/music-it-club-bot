const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"userinfo",
    help:{
        description:"Показывает информацию о пользователе",
        options:[
            {
                name:"пользователь"
            },
        ],
    },
    aliases:[],
    enable:false,
    permissions:null,
    permissions_roles:["musicrole"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {CommandInteraction} interaction 
     * @param {*} param3 
     */
    command:async (client, interaction, settings, {}={})=>{
        
    },
}
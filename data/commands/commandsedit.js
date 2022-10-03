const DiscordClient = require("../libs/client");
const {Message,Interaction} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"commandedit",
    help:{
        description:"Изменение команд",
        options:[
            {
                name:"команда"
            },
        ],
    },
    enable:true,
    aliases:["comedit"],
    permissions:["botsettings"],
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Message} message 
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, message, args, settings, {}={})=>{
        if(args[0]) args[0]=args[0].toLowerCase()
        if(args[0]=="delete"||args[0]=="del"){
            if(args[1]){
                args[1]=client.Auto(args[1].toLowerCase())
                message.reply(await client.deletecommand(args[1]))
            }
        }else if(args[0]=="add"||args[0]=="load"){
            if(args[1]){
                args[1]=client.Auto(args[1].toLowerCase())
                message.reply(await client.loadcommand(args[1]+".js"))
            }
        }else if(args[0]=="reload"){
            if(args[1]){
                args[1]=client.Auto(args[1].toLowerCase())
                message.reply(await client.reloadcommand(args[1]))
            }
        }
        
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
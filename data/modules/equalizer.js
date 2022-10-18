const DiscordClient = require("../libs/client");
const {Message,Interaction,Modal, MessageActionRow, TextInputComponent,MessageEmbed} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
const equalizer_option_number={
    "32":0,
    "64":1,
    "125":2,
    "250":3,
    "500":4,
    "1k":5,
    "2k":6,
    "4k":7,
    "8k":8,
    "16k":9,
    0:"32",
    1:"64",
    2:"125",
    3:"250",
    4:"500",
    5:"1k",
    6:"2k",
    7:"4k",
    8:"8k",
    9:"16k"
}
module.exports = {
    name:"equalizer",
    enable:false,
    permissions:null,
    /**
     * 
     * @param {DiscordClient} client 
     * @param {Interaction} interaction 
     * @param {string[]} args 
     * @param {*} settings 
     * @param {*} param4 
     * @returns 
     */
    module:async (client, interaction, args, settings, {}={})=>{
        //Player.options.setFilter("equalizer",``,Player.ffmpeg);
        if(interaction.isButton()){
            var Player;
            if(interaction.guild.me.voice.channel)
                Player = client.connections.getconnection(interaction.guildId)
            else{
                return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            }
            var options=Player.options,setting=equalizer_option_number[options.selected_equalizer_option],value=options.equalizer[options.selected_equalizer_option];
            switch(args[0]){
                case "next":
                    setting<9?options.selected_equalizer_option=equalizer_option_number[++setting]:options.selected_equalizer_option=equalizer_option_number[0];
                break;
                case "prev":
                    setting<9?options.selected_equalizer_option=equalizer_option_number[++setting]:options.selected_equalizer_option=equalizer_option_number[0];    
                break;
                case "+1":
                    if((++value)<=50)
                        options.setFilter("equalizer",`${options.selected_equalizer_option}:${value}`,Player.ffmpeg)
                    else
                        interaction.reply({content:'от -50 до 50',ephemeral:true}).catch(()=>null);
                break;
                case "-1":
                    if((--value)>=50)
                        options.setFilter("equalizer",`${options.selected_equalizer_option}:${value}`,Player.ffmpeg)
                    else
                        interaction.reply({content:'от -50 до 50',ephemeral:true}).catch(()=>null);
                break;
                case "+5":
                    if((value+5)<=50)
                        options.setFilter("equalizer",`${options.selected_equalizer_option}:${value+5}`,Player.ffmpeg)
                    else
                        interaction.reply({content:'от -50 до 50',ephemeral:true}).catch(()=>null);
                break;
                case "-5":
                    if((value-5)<=50)
                        options.setFilter("equalizer",`${options.selected_equalizer_option}:${value-5}`,Player.ffmpeg)
                    else
                        interaction.reply({content:'от -50 до 50',ephemeral:true}).catch(()=>null);
                break;
            }
            interaction.message.edit({embeds:[new MessageEmbed().setDescription(await Player.options.getEqualizer().catch(()=>null))]}).catch(()=>null);
            interaction.deferUpdate().catch(()=>null);
            
        }
        if(interaction.isSelectMenu()){
            var Player;
            if(interaction.guild.me.voice.channel)
                Player = client.connections.getconnection(interaction.guildId)
            else{
                return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            }
            if(args[0]!="HZ")return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            Player.options.selected_equalizer_option=interaction.values[0];
            interaction.deferUpdate().catch(()=>null);
        }
        if(interaction.isModalSubmit()){
            var Player;
            if(interaction.guild.me.voice.channel)
                Player = client.connections.getconnection(interaction.guildId)
            else{
                return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            }
            
        }
        
        
    }
}
const DiscordClient = require("../libs/client");
const {Message,Interaction,Modal, MessageActionRow, TextInputComponent} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"player",
    enable:false,
    permissions:null,
    permissions_roles:["musicrole"],
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
        // message.reply("Player offline!!!")
        if(interaction.isButton()){
            var Player;
            if(interaction.guild.me.voice.channel)
                Player = client.connections.getconnection(interaction.guildId)
            else{
                return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            }
            switch(args[0]){
                case "skip":
                    Player.skip();interaction.deferUpdate().catch(()=>null);
                break;
                case "res/pau":
                    if(Player.status=="paused") Player.resume();
                    else if(Player.status=="playing"||Player.status=="buffering") Player.pause();
                    else return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
                    interaction.deferUpdate().catch(()=>null);
                break;
                case "repeat":
                    if(Player.playlist.repeat<2)Player.playlist.repeat++;
                    else Player.playlist.repeat=0;
                    Player.chatplayer.sendnewplayer(Player).catch(()=>null);
                    interaction.deferUpdate().catch(()=>null);
                break;
                case "prev":
                    interaction.deferUpdate().catch(()=>null);
                break;
                case "next":
                    interaction.deferUpdate().catch(()=>null);
                break;
                case "reload":
                    Player.chatplayer.sendnewplayer(Player).catch(()=>null);
                    interaction.deferUpdate().catch(()=>null);
                break;
                case "move":
                    const modal = new Modal()
                    .setCustomId('player:move')
                    .setTitle('Перемещение по треку')
                    .addComponents(
                        new MessageActionRow().addComponents(
                            new TextInputComponent()
                            .setCustomId("player:move")
                            .setLabel("Введите позицию для перемещения:")
                            .setStyle("SHORT").setPlaceholder("пример: 60 или 1:00")
                        )
                    )
                    interaction.showModal(modal).catch(()=>null)
                break;
            }
        }
        if(interaction.isSelectMenu()){
            var Player;
            if(interaction.guild.me.voice.channel)
                Player = client.connections.getconnection(interaction.guildId)
            else{
                return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            }
            if(args[0]=="move"){
                Player.move(Number(interaction.values[0]));
                interaction.reply({content:`Перемещено на позицию ${interaction.values[0]}с.`,ephemeral:true}).catch(()=>null);
            }
        }
        if(interaction.isModalSubmit()){
            var Player;
            if(interaction.guild.me.voice.channel)
                Player = client.connections.getconnection(interaction.guildId)
            else{
                return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            }
            if(args[0]=="move"){
                Player.move(interaction.fields.getTextInputValue("player:move"));
                interaction.reply({
                    content:`Перемещено на позицию ${interaction.fields.getTextInputValue("player:move")}`,
                    ephemeral:true
                }).catch(()=>null);
            }
        }
        
        
    }
}
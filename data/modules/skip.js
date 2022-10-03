const DiscordClient = require("../libs/client");
const {Message,Interaction,Modal, MessageActionRow, TextInputComponent} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"skip",
    enable:true,
    permissions:["musicplayer"],
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
            Player = client.connections.getconnection(interaction.guildId);
            let l = interaction.message.content.split('\nПротив:'),
            l1 = l[0]?.match(/<@[0-9]{1,}>/gm),
            l2 = l[1]?.match(/<@[0-9]{1,}>/gm);
            console.log(interaction.member.voice)
            if(!interaction.member?.voice?.members?.size) return;
            if(interaction.member.id in interaction.message.content)
                return interaction.reply({content:"Вы уже проголосовали!",ephemeral:true}).catch(()=>null);
            if(l1?.length>=Math.ceil(interaction.member.voice.members.size/2))
                var res=Player.skip(1);
                if(res&&res!="ok") interaction.reply(`Удалён ${res.title}`).catch(()=>null);
                interaction.message?.delete()?.catch(()=>null);
        }
    }
}
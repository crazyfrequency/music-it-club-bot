const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"move",
    help:{
        description:"Перемешение по треку на заданную минуту/секунду",
        options:[
            {
                name:"position",
                type:"string",
                description:"Позиция( 90 | 1:30 | 0:01:30 )",
                required:true,
                autocomplete:true
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
        // return interaction.reply("Player offline!!!");
        let status = client.connections.getconnection(interaction.guildId);
        var Player, position = interaction.options.get("position").value;
        if(status.connected&&status.connection)
            Player = client.connections.getconnection(interaction.guildId).connection;
        if(!Player) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        if(/[ 0-9:]{1,}/.test(position)){
            let val = interaction.options.get("position").value;
            Player.move(val).catch(()=>null);
            return interaction.reply({content:`Перемещено на позицию: ${client.parseduration(val)}`,ephemeral:true}).catch(()=>null);
        }
        if(!Player.track.chapters) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        let m = Player.track.chapters.find(item=>{if(item.title==position) return true;})
        if(!m) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        Player.move(m.start_time);
        interaction.reply({content:`Перемещено на позицию: ${m.start_time_name}`,ephemeral:true}).catch(()=>null);
    },
    /**
     * 
     * @param {DiscordClient} client 
     * @param {AutocompleteInteraction} interaction 
     * @param {*} param3 
     */
    autocomplete:async (client, interaction, settings, {}={})=>{
        let focusedValue = interaction.options.getFocused(),
        chapters = client.connections.getconnection(interaction.guildId)?.connection?.track?.chapters;
        if(!chapters) return;
        await interaction.respond(
            chapters.filter(value=>{if(value.title.toLowerCase().includes(focusedValue.toLowerCase()))return true;})
            .map(value=>({ name: value.title, value: value.start_time.toString() }))
        ).catch(()=>null)
    }
}
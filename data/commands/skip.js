const DiscordClient = require("../libs/client");
const {CommandInteraction,AutocompleteInteraction,ChannelType,PermissionFlagsBits} = require("discord.js");
const DiscordPlayer = require("../libs/Player/DiscordPlayer");
module.exports = {
    name:"skip",
    help:{
        description:"Пропустить трек",
        options:[
            {
                name:"track",
                type:"string",
                description:"Пропутить трек в очереди(0 - текущий)",
                autocomplete:true
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
     * @param {string[]} args 
     * @param {*} param3 
     */
    command:async (client, interaction, args, settings={musicplayer:"all"}, {}={})=>{
        let value = Number(interaction.options.get("track")?.value);
        var Player,connection=client.connections.getconnection(interaction.guildId);
        if(connection.connected&&connection.connection)
            Player = connection.connection;
        if(!Player) return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
        if(value){
            let res = Player.skip_id(value);
            if(res=="bad") return interaction.reply({content:'❗',ephemeral:true}).catch(()=>null);
            return interaction.reply({content:`Пропущен: ${res.title} - ${res.author}`,ephemeral:true}).catch(()=>null);
        }
        let res = Player.skip();
        return interaction.reply({content:`Пропущен: ${res.title} - ${res.author}`,ephemeral:true}).catch(()=>null);
        
    },
    /**
     * 
     * @param {DiscordClient} client 
     * @param {AutocompleteInteraction} interaction 
     * @param {*} param3 
     */
    autocomplete:async (client, interaction, settings, {}={})=>{
        let focusedValue = interaction.options.getFocused(),
        connection = client.connections.getconnection(interaction.guildId).connection,
        tracks=[connection.track].concat(connection.playlist.playlist);
        console.log(tracks.length,tracks.filter(value=>value.title.includes(focusedValue)).length)
        await interaction.respond(
            tracks.map((value,index)=>({name:`${index}: `+value.title,value:value.id.toString()})).filter(value=>value.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0,25)
        ).catch(()=>null)
    }
}
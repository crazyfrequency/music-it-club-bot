const {Client,GatewayIntentBits, Options, Message, Interaction, Partials, InteractionType} = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior,getVoiceConnection,StreamType,demuxProbe } = require('@discordjs/voice');
const fs = require('fs');
const {exec,fork,spawn} = require('child_process');
const {token,prefix,applicationid} = require('./config.json');
const DiscordClient = require('./data/libs/client');
const client = new DiscordClient(
        [
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessageReactions,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildPresences,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.GuildVoiceStates
        ],[
            Partials.Channel,
            Partials.Message,
            Partials.User
        ],
        token, applicationid
    );
const programms=[
    async(interaction)=>null,async(interaction)=>null,
    /**
     * 
     * @param {Interaction} interaction 
     */
    async(interaction)=>{
        client.commands[interaction.commandName].command(client,interaction)?.catch(async(e)=>console.error(e));
    }
]
client.bot.on("interactionCreate",async(interaction)=>{
    if(interaction.type==InteractionType.ApplicationCommandAutocomplete){
        if(!client.commands[interaction.commandName]?.autocomplete) return;
        client.commands[interaction.commandName].autocomplete(client,interaction)?.catch(async(e)=>console.error(e));
    }if(interaction.type==InteractionType.ApplicationCommand){
        if(!client.commands[interaction.commandName]?.command) return console.error(`Команда ${interaction.commandName} не найдена.`);
        client.commands[interaction.commandName].command(client,interaction)
        ?.catch(async(e)=>console.error(`${"=".repeat(process.stdout.columns)}
        Ошибка в команде: "${interaction.commandName}"
        Название ошибки: ${e.name}\n${"-".repeat(process.stdout.columns)}
        Тип ошибки: ${e.message}\n${"-".repeat(process.stdout.columns)}
        Сообщение ошибки: ${e.stack}
        ${"=".repeat(process.stdout.columns)}`.replace("    ","")));
    }if(interaction.type==InteractionType.Ping) return;

})
client.bot.once("ready",async()=>{
    console.log(`${client.bot.user.username} online`);
    client.bot.user.setPresence({ activities: [{ name: 'разработку' }]});
    
  });

client.log("Подключение к серверам")
client.bot.login(token);
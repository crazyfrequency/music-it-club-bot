const {Client,Intents, Options, Message,MessageEmbed, Interaction} = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior,getVoiceConnection,StreamType,demuxProbe } = require('@discordjs/voice');
const fs = require('fs');
const {exec,fork,spawn} = require('child_process');
const myIntents = new Intents();
const {token,prefix} = require('./config.json');
const DiscordClient = require("./data/libs/client")
myIntents.add(
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES
    );
const client = new DiscordClient(myIntents);

client.bot.on("messageCreate",async(message)=>{try{
    if(message.author.bot) return
    var args = message.content.split(' ');
    var command = client.Auto(args.shift().toLowerCase());
    if(!command.startsWith(prefix)&&!command.startsWith(`<@${client.bot.user.id}>`)) return;
    command=(command.startsWith(`<@${client.bot.user.id}>`)?client.Auto(args.shift().toLowerCase()):command.slice(prefix.length))
    args=args.filter(Boolean);
    if(client.commands[command]?.command){
        if(!message.guild.me.permissions.has("ADMINISTRATOR"))
            message.reply("Внимание нет прав админестратора!\nБот может работать некорректно!!!").catch(()=>{})
        await client.commands[command].command(client,message,args)
    }
}catch(e){client.error(`${"=".repeat(process.stdout.columns)}
Ошибка в команде: "${command?command:"не известно"}"
Название ошибки: ${e.name}\n${"-".repeat(process.stdout.columns)}
Тип ошибки: ${e.message}\n${"-".repeat(process.stdout.columns)}
Сообщение ошибки: ${e.stack}
${"=".repeat(process.stdout.columns)}`);try{await message.react("❗")}catch{}}})

client.bot.on("interactionCreate",async(interaction)=>{
    if(interaction.isCommand()){
        
    }else if(interaction.isMessageComponent()||interaction.isModalSubmit()){try{
        var args = interaction.customId.split(":");
        var module = args.shift();
        if(client.modules[module]?.module){
            await client.modules[module].module(client,interaction,args);
        }
}catch(e){client.error(`${"=".repeat(process.stdout.columns)}
Ошибка в модуле: "${module?module:"не известно"}"
Название ошибки: ${e.name}\n${"-".repeat(process.stdout.columns)}
Тип ошибки: ${e.message}\n${"-".repeat(process.stdout.columns)}
Сообщение ошибки: ${e.stack}
${"=".repeat(process.stdout.columns)}`);try{await interaction.reply({content:"error",ephemeral:true})}catch{}}}
})

function stopprocess(signal) {
    client.log(`Обнаружен сигнал выключения: "${signal}"`);
    process.exit(0);
}

process.on("SIGHUP",(signal)=>{stopprocess(signal)})
process.on("SIGINT",(signal)=>{stopprocess(signal)})
process.on("SIGQUIT",(signal)=>{stopprocess(signal)})
process.on("SIGUSR1",(signal)=>{stopprocess(signal)})
process.on("SIGUSR2",(signal)=>{stopprocess(signal)})
process.on("SIGTERM",(signal)=>{stopprocess(signal)})
process.on("SIGHUP",(signal)=>{stopprocess(signal)})

client.bot.once("ready",async()=>{
    console.log(`${client.bot.user.username} online`);
    client.bot.user.setPresence({ activities: [{ name: 'разработку' }]});
    
  });

client.log("Подключение к серверам")
client.bot.login(token)
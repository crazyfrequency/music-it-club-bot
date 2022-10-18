const {Client,GatewayIntentBits,Partials, SlashCommandBuilder, REST, Routes, PermissionFlagsBits} = require('discord.js');
const {replacer} = require('../../config.json');
const DiscordPlayer = require('./Player/DiscordPlayer.js');
const DiscordConnections = require('./DiscordConnections.js');
const path = require("path");
const fs = require("fs");
/**
 * 
 * @param {console.log} log 
 * @param {console.error} err 
 * @param {string} dir 
 * @returns 
 */
function LoadCommands(log,err,dir=undefined) {
    if(!dir) dir = path.join(__dirname, "..", "commands");
    let files = fs.readdirSync(dir);
    var commands={};
    for(let file of files){
        let command = require(dir + "/" + file);
        if(command.enable)
        if(!command.name || !command.help || !command.command){err(`Ошибка загрузки команды: ${file}`)}
        else{
            commands[command.name] = command;
            if(command.aliases)
            for(let i of command.aliases) commands[i] = command;
            log(`Команда "${command.name}" успешно загружена`);
        }
    }
    log("Команды успешно загружены");
    return commands
}
/**
 * 
 * @param {console.log} log 
 * @param {console.error} err 
 * @param {string} dir 
 * @returns 
 */
function LoadModules(log,err,dir=undefined) {
    if(!dir) dir = path.join(__dirname, "..", "modules");
    let files = fs.readdirSync(dir);
    var modules={};
    for(let file of files){
        let module = require(dir + "/" + file);
        if(module.enable)
        if(!module.module){err(`Ошибка загрузки модуля: ${file}`)}
        else{
            modules[module.name] = module;
            log(`Модуль "${module.name}" успешно загружена`);
        }
    }
    log("Модули успешно загружены");
    return modules
}
function upploadCommands(log,err,token,applicationid,dir=undefined){
    if(!dir) dir = path.join(__dirname, "..", "commands");
    let files = fs.readdirSync(dir);
    var commands=[];
    for(let file of files){
        let command = require(dir + "/" + file);
        if(command.enable)
        if(!command.name || !command.help || !command.command){err(`Ошибка загрузки команды на сервер: ${file}`)}
        else{
            let slashcommand = new SlashCommandBuilder().setName(command.name)
            .setDescription(command.help.description).setDefaultMemberPermissions(command.help?.permissions||null)
            for(let i of command.help.options){
                if(i.type=="string")slashcommand.addStringOption(option=>{option.setName(i.name)
                    .setDescription(i.description?i.description:"").setRequired(i.required?i.required:false)
                    .setAutocomplete(i.autocomplete?true:false);
                    if(i.choices)for(let j of i.choices)
                        option.addChoices({name:j,value:j});
                    if(i.min)option.setMinLength(i.min);if(i.max)option.setMaxLength(i.max);
                    return option;
                });
                if(i.type=="number")slashcommand.addNumberOption(option=>{option.setName(i.name)
                    .setDescription(i.description?i.description:"").setRequired(i.required?i.required:false)
                    .setAutocomplete(i.autocomplete?true:false);
                    if(i.min)option.setMinValue(i.min);if(i.max)option.setMaxValue(i.max);
                    return option;
                });
                if(i.type=="channel")slashcommand.addChannelOption(option=>{
                    option.setName(i.name).setDescription(i.description?i.description:"").setRequired(i.required?i.required:false)
                    for(let j of i.channeltypes)option.addChannelTypes(j);return option;
                });
            }
            commands.push(slashcommand.toJSON());
            log(`Команда "${command.name}" подготовлена`);
        }
    }
    log("Команды подготовлены к загрузке на сервер");
    const rest = new REST({ version: '10' }).setToken(token);
    console.log(commands);
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
            const data = await rest.put(
                Routes.applicationCommands(applicationid),
                { body: commands },
            );
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
    log("Команды успешно загружены на сервер");
    return commands
}

class DiscordClient{
    /**
     * 
     * @param {GatewayIntentBits} intents 
     * @param {Partials} partial 
     * @param {String} token 
     */
     constructor(intents=undefined,partial=undefined,token=undefined,applicationid=undefined){
        this.log = console.log;
        this.error = console.error;
        this.log("Запуск бота...");
        this.bot = new Client({ intents: intents, partials: partial });
        this.log("Загрузка команд на сервер:");
        upploadCommands(this.log,this.error,token,applicationid);
        this.connections = new DiscordConnections();
        this.log("Загрузка команд:");
        let com = LoadCommands(this.log,this.error);
        this.commands = com;
        this.log("Загрузка модулей:");
        let modules_all = LoadModules(this.log,this.error);
        this.modules = modules_all;
    }
    /**
     * 
     * @param {string} file 
     * @param {string} dir 
     */
    async loadcommand(file=undefined,dir=undefined){
        if(!file) return;
        if(!dir) dir = path.join(__dirname, "..", "commands");
        let command = require(dir + "/" + file);
        if(!command.name || !command.help || !command.command){this.error(`Ошибка загрузки команды: ${file}`);}
        this.commands[command.name] = command;
        if(command.aliases)
        for(let i of command.aliases) this.commands[i] = command;
        return `Команда "${command.name}" успешно загружена`
    }
    async loadmodule(file=undefined,dir=undefined){
        if(!file) return;
        if(!dir) dir = path.join(__dirname, "..", "modules");
        let command = require(dir + "/" + file);

    }
    /**
     * String to lower case and to eng keys
     * @param {string} str 
     * @returns {string}
     */
    Auto(str) {
        for(let i=0; i < str.length; i++){
            if( replacer[ str[i].toLowerCase() ] != undefined){
              let replace = replacer[ str[i].toLowerCase() ];    
              str = str.replace(str[i], replace);
            }
        }
       return str;
      }
    parseti(str='0'){
        str=str.toString()
        var t=0,p=0;
        if((str.indexOf('h')!==-1)||(str.indexOf('m')!==-1)||(str.indexOf('s')!==-1)){
            p=str.search('h')
            t=t*60+Number(str.slice(0,p))
            str=str.slice(p+1)
            p=str.search('m')
            t=t*60+Number(str.slice(0,p))
            str=str.slice(p+1)
            p=str.search('s')
            t=t*60+Number(str.slice(0,p))
            str=str.slice(p+1)
            return t
        }else{
            if(str.indexOf(':')===-1){return Number(str)}else
            while(str.indexOf(':')!==-1){
                p=str.indexOf(':')
                t=t*60+Number(str.slice(0,p))
                str=str.slice(p+1)
            }
            t=t*60+Number(str.slice(0))
            return t
        }
    };
    parseduration(time){
        time=Number(time);
        if(!time) return time;
        let hours = Math.floor(time / 3600);time = time - hours * 3600;
        let minutes = Math.floor(time / 60),seconds = time - minutes * 60;
        return `${hours?hours+":":""}${minutes>9?minutes:"0"+minutes}:${seconds>9?seconds:"0"+seconds}`
    };
}

module.exports = DiscordClient;
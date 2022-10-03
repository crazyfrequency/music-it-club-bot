const {Client,Intents} = require('discord.js');
const {replacer} = require('../../config.json');
const DiscordPlayer = require('./Player/DiscordPlayer.js');
const DiscordConnections = require('./DiscordConnections.js');
const path = require("path");
const fs = require("fs");
const reload = require('require-reload')(require);
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
        let command = require(dir + "\\" + file);
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
        let module = require(dir + "\\" + file);
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

class DiscordClient{
    /**
     * 
     * @param {Intents} intents 
     */
    constructor(intents){
        this.log = console.log;
        this.error = console.error;
        this.log("Запуск бота...");
        this.bot = new Client({ intents: intents, partials: ["CHANNEL"] });
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
        let command = reload(dir + "\\" + file);
        if(!command.name || !command.help || !command.command){this.error(`Ошибка загрузки команды: ${file}`);}
        this.commands[command.name] = command;
        if(command.aliases)
        for(let i of command.aliases) this.commands[i] = command;
        return `Команда "${command.name}" успешно загружена`
    }
    async loadmodule(file=undefined,dir=undefined){
        if(!file) return;
        if(!dir) dir = path.join(__dirname, "..", "modules");
        let command = reload(dir + "\\" + file);

    }
    /**
     * 
     * @param {string} name 
     * @returns 
     */
    async reloadcommand(name=undefined){
        if(!name) return;
        if(this.commands[name]){
            if(this.commands[name].aliases)
            for(let i of this.commands[name].aliases) delete this.commands[i];
            delete this.commands[this.commands[name].name]
        }else return "Нет такой команды!"
        let dir = path.join(__dirname, "..", "commands"),file=name;
        let command = reload(dir + "\\" + file);
        if(!command.name || !command.help || !command.command){this.error(`Ошибка загрузки команды: ${file}`);}
        this.commands[command.name] = command;
        if(command.aliases)
        for(let i of command.aliases) this.commands[i] = command;
        return `Команда "${command.name}" успешно перезагружена`
    }
    /**
     * 
     * @param {string} name 
     * @returns 
     */
     async reloadmodule(name=undefined){
        if(!name) return;
        if(this.modules[name]){
            delete this.modules[this.modules[name].name]
        }else return "Нет такого модуля!"
        let dir = path.join(__dirname, "..", "modules"),file=name;
        let module = reload(dir + "\\" + file);
        if(!module.name || !module.module){this.error(`Ошибка загрузки модуля: ${file}`);}
        this.modules[module.name] = module;
        return `Модуль "${module.name}" успешно перезагружен`
    }
    /**
     * 
     * @param {string} name 
     * @returns 
     */
    async deletecommand(name=undefined){
        if(!name) return;
        if(this.commands[name]){
            if(this.commands[name].aliases)
            for(let i of this.commands[name].aliases) delete this.commands[i];
            delete this.commands[this.commands[name].name]
            return "Удалено"
        }else{
            return "Нет такой команды!"
        }
    }
    /**
     * 
     * @param {string} name 
     * @returns 
     */
     async deletemodule(name=undefined){
        if(!name) return;
        if(this.modules[name]){
            delete this.commands[this.modules[name].name]
            return "Удалено"
        }else{
            return "Нет такого модуля!"
        }
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
}

module.exports = DiscordClient;
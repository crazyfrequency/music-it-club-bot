const {PlayList} = require("./PlayList");
const fs = require("fs")
const {MessageEmbed,VoiceChannel,Message,Guild, MessageActionRow, MessageButton, MessageSelectMenu} = require('discord.js');
const {spawn, ChildProcess} = require('child_process');
const {createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, AudioResource, VoiceConnection, AudioPlayer} = require('@discordjs/voice');
const { Track } = require("./Track"), ChatPlayer = require("./ChatPlayer");
const { PlayerOptions } = require("./PlayerOptions");
const user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3534.0 Safari/537.36";
const cookies = "APISID=KvpilY1TzuTWjjF8/AGebHuhBO0BlwqLMk; HSID=AXutkrbtmD-gnU3N_; LOGIN_INFO=AFmmF2swRQIhAPhNv-ZweZ79zRMWXhQAx-1H35E6B2ZNVLum7m7RklbJAiA2v1lS5RnpWslfVeDVFwa1awy-_np8iahP6ZRV8fTVvQ:QUQ3MjNmeGhBcjVwRFhrSkpFWFFHdVdJbFN0M1RXTVExN0FqNm9meVFhS3p4TUpVYW5Lc3U3QmVMX0ZXQ0JzWlg4U3lyLVF5Q2l5bFR4N0t5WFpuUk4zSWYycU1HNmpSX29jSWZDMHR4QS1zMExSbzd6a1diUGtFZDlBeWwxQk5LSGNMbWdiSDBvWk5aQUJYNUJmbF83M3hUMnJ5TU5SbmZ3; SAPISID=z_zjWozPs8OeKZOE/AmJ7jQTuZi_dM1Jwr; SID=GAgE0ryB5sb4p_e3iJi4mhleiM--qNJqXQcj6BKzzMYV3BTvltd_4u8j9i23NBl3-N0Oag.; SIDCC=AJi4QfHCOCBvCDmw9LbqowRss2FXadTYG5mNopaZU8cXORfrg9_n_7Im7dSQ_r-Y9QA078xn; SSID=ArWNCsnPFLLHspWhD; VISITOR_INFO1_LIVE=bQV13xq6F2c; YSC=3NB_UUJ-DE0";
const ffmpegdir=process.platform=="win32"?require("path").resolve(__dirname,"../../ffmpeg/bin/")+"\\":"";


function parseti(str='0'){
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

class DiscordPlayer{
    /**
     * 
     * @param {VoiceChannel} channel 
     * @param {boolean} disableplayer 
     */
    constructor(channel,enableplayer=false){
        /**
         * on/off player in chat
         * @name DiscordPlayer#playerenable
         * @type {boolean}
         */
        this.playerenable=enableplayer;
        /**
         * chat player
         * @name DiscordPlayer#chatplayer
         * @type {ChatPlayer}
         */
        this.chatplayer=new ChatPlayer(this.playerenable);
        /**
         * Guild of player
         * @name DiscordPlayer#guild
         * @type {Guild}
         */
        this.guild=channel.guild;
        /**
         * PlayList of this player
         * @name DiscordPlayer#playlist
         * @type {PlayList}
         */
        this.playlist=new PlayList();
        /**
         * Now playing track
         * @name DiscordPlayer#track
         * @type {Track}
         */
        this.track=undefined;
        /**
         * Audio resource of this player
         * @name DiscordPlayer#resource
         * @type {AudioResource}
         */
        this.resource=undefined;
        /**
         * Ffmpeg process of this player
         * @name DiscordPlayer#ffmpeg
         * @type {ChildProcess}
         */
        this.ffmpeg=undefined;
        /**
         * Time of track for restart and math logic
         * @name DiscordPlayer#time
         * @type {number}
         */
        this.time=0;
        /**
         * Discord connection to voice channel
         * @name DiscordPlayer#connection
         * @type {VoiceConnection}
         */
        this.connection=joinVoiceChannel({
            channelId:channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf:true
        });
        /**
         * Discord player
         * @name DiscordPlayer#player
         * @type {AudioPlayer}
         */
        this.player=createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        this.connection.subscribe(this.player);
        /**
         * Options of this player
         * @name DiscordPlayer#options
         * @type {PlayerOptions}
         */
        this.options=new PlayerOptions();
        /**
         * Skip track
         * @name DiscordPlayer#skip
         * @type {boolean}
         */
        this.skiper=false;
        /**
         * Position to move
         * @name DiscordPlayer#moveposition
         * @type {number}
         */
        this.moveposition=-1;
        /**
         * Position for math operation
         * @name DiscordPlayer#position
         * @type {number}
         */
        this.position=0;
        this.playbackDuration=0;
        /**
         * Status of player
         * @name DiscordPlayer#status
         * @type {"idle"|"buffering"|"paused"|"playing"}
         */
        this.status="idle"
        this.player.on("stateChange",async(o,n)=>{
            let p=this.resource.playbackDuration;
            if(p!=0)this.playbackDuration=p;
            if(n.status!="idle"){
                this.status=(n.status!="autopaused")?n.status:"paused";
                this.chatplayer.editnewplayer(this).catch(()=>null);
                return;
            }try{this.ffmpeg.kill()}catch{}
            if(this.skiper===false&&this.moveposition===-1&&n.status==='idle'){
                if(this.track?.duration>0&&this.track?.errors<5){
                    let time = (this.playbackDuration/1000-this.position)*this.options.speed+this.time;
                    if((this.track?.duration-time)>10){
                        this.track.errors++;
                        return this._play(this.track,time);
                    }
                }
            }this.skiper=false;
            if(this.moveposition!==-1){
                let time = this.moveposition;
                this.moveposition=-1;
                return this._play(this.track,time);
            }
            if(this.playlist.repeat==1){
                return this._play(this.track);
            }else{
                while(true){
                    let nowtrack=this.playlist.get();
                    if(!nowtrack){
                        this.playlist.once("newTrack",async()=>{
                            return this._play(this.playlist.get());
                        });
                        this.chatplayer.editnewplayer(this).catch(()=>null);
                        return;
                    }else
                    if(nowtrack.url) return this._play(nowtrack);
                }
            }
        });
        // /**
        //  * Visual plyer interval function
        //  * @name DiscordPlayer#visual_player
        //  * @type {{player:NodeJS.Timer,message:Message}}
        //  */
        // this.visual_player={
        //     player:setInterval(async()=>{
        //         console.log(`alive ${+new Date()} ${this.visual_player.message.editable}`)
        //         if(!this.visual_player.message) return;
        //         let mess = await getnewplayer(this).catch(async(e)=>console.log(e));
        //         if(mess)
        //         this.visual_player.message.edit(mess).catch((e)=>console.log(e))
        //     },5000),
        //     message:undefined
        // };
        this.playlist.once("newTrack",async()=>{
            this._play(this.playlist.get());
        });
    }
    /**
     * 
     * @param {string} request 
     * @param {Message} message 
     */
    async play(request,message){
        this.playlist.add(request,message);
        if(message.react)
            message.react("✅").catch(()=>null);
        else{message.deferReply().catch(()=>null)}
        // setTimeout(async()=>{
        //     let mess=this.visual_player.message,player=this.visual_player.player;
        //     if(mess) mess.delete().catch(()=>null)
        //     let m=getnewplayer(this).catch((e)=>console.log(e));
        //     let embed=new MessageEmbed().setDescription("Нет информации")
        //     if(m) this.visual_player.message = await message.channel.send({embeds:[embed]}).catch(()=>null)
        //     else this.visual_player.message = await message.channel.send({embeds:[embed]}).catch(()=>null)
        // },1000)
        this.chatplayer.setchannel(message.channel);
    }
    async resume(){
        this.player.unpause();
    }
    async pause(){
        this.player.pause(true);
    }
    /**
     * Move to position in track
     * @param {number|string} time 
     */
    async move(time){
        if(!time) time=0;
        this.moveposition=parseti(time);
        this.player.stop(true);
    }
    /**
     * Skip track
     * @param {number|string} position 
     * @returns {Track}
     */
    skip(position="",count=""){
        position=Number(position);
        count=Number(count)?Number(count):1;
        if(!position){
            this.skiper=true;
            this.player.stop(true);
            return "ok";
        }else{
            return this.playlist.delete(position-1,count)[0];
        }
    }
    /**
     * 
     * @param {Track} track 
     * @param {number} time 
     */
    _play(track,time=0){try{
        let url=track.getUrl();
        var args=['-reconnect',1,'-reconnect_streamed', 1, '-reconnect_delay_max', 5,'-err_detect','ignore_err','-vn','-sn','-user_agent',user_agent];
        if(url.endsWith(".m3u8")&&track.type=="ffprobe") args=args.concat(["-http_persistent","false"]);
        if(time>0){args=args.concat('-ss',time)};
        args=args.concat(['-i',url])
        .concat(this.options.getOptions())
        .concat([
            '-f', 's16le', // PCM 16bits, little-endian
            '-ar', 48000, // Sampling rate
            '-ac', 2, // Stereo
            '-loglevel','warning',
            'pipe:1', // Output on stdout
        ]);console.log(args)
        this.ffmpeg=spawn('ffmpeg',args,{cwd:ffmpegdir});
        this.resource=createAudioResource(this.ffmpeg.stdout,{inputType:'raw'});
        this.player.play(this.resource);
        this.track=track;
        this.position=0;
        this.time=time;
        this.ffmpeg.stderr.setEncoding("utf-8");
        // this.ffmpeg.stderr.on("data",async(data)=>{
        //     console.log(data);this.playbackDuration=this.resource.playbackDuration;
        // });
        this.ffmpeg.on("exit",async(code,signal)=>{console.log(code,signal)});
        setTimeout(() => {
            this.chatplayer.editnewplayer(this).catch((e)=>console.log(e));
        }, 1000);
    }catch(e){console.error(e);}}
    async disconnect(){
        this.playlist=new PlayList();
        this.player.stop();
        try{this.ffmpeg.kill()}catch{};
        return this.connection.disconnect();
    }
    /**
     * 
     * @param {VoiceChannel} channel 
     */
    async moveto(channel=undefined){
        if(channel)
            this.connection.rejoin({
                channelId:channel.id,
                selfDeaf:true,
            })
        else this.connection.rejoin()
    }
}

module.exports=DiscordPlayer
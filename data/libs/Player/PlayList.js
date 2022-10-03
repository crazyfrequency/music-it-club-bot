const {Track} = require("./Track");
const user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3534.0 Safari/537.36";
const cookies = "APISID=KvpilY1TzuTWjjF8/AGebHuhBO0BlwqLMk; HSID=AXutkrbtmD-gnU3N_; LOGIN_INFO=AFmmF2swRQIhAPhNv-ZweZ79zRMWXhQAx-1H35E6B2ZNVLum7m7RklbJAiA2v1lS5RnpWslfVeDVFwa1awy-_np8iahP6ZRV8fTVvQ:QUQ3MjNmeGhBcjVwRFhrSkpFWFFHdVdJbFN0M1RXTVExN0FqNm9meVFhS3p4TUpVYW5Lc3U3QmVMX0ZXQ0JzWlg4U3lyLVF5Q2l5bFR4N0t5WFpuUk4zSWYycU1HNmpSX29jSWZDMHR4QS1zMExSbzd6a1diUGtFZDlBeWwxQk5LSGNMbWdiSDBvWk5aQUJYNUJmbF83M3hUMnJ5TU5SbmZ3; SAPISID=z_zjWozPs8OeKZOE/AmJ7jQTuZi_dM1Jwr; SID=GAgE0ryB5sb4p_e3iJi4mhleiM--qNJqXQcj6BKzzMYV3BTvltd_4u8j9i23NBl3-N0Oag.; SIDCC=AJi4QfHCOCBvCDmw9LbqowRss2FXadTYG5mNopaZU8cXORfrg9_n_7Im7dSQ_r-Y9QA078xn; SSID=ArWNCsnPFLLHspWhD; VISITOR_INFO1_LIVE=bQV13xq6F2c; YSC=3NB_UUJ-DE0";
const {spawn} = require('child_process');
const util = require('util');
const EventEmitter = require('events');
const exec = util.promisify(require('child_process').exec);
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const ytsearch = require('yt-search');
const {Client, Message, Interaction, MessageEmbed } = require("discord.js");
const ffmpegdir=process.platform=="win32"?require("path").resolve(__dirname,"../../ffmpeg/bin/")+"\\":"";

async function findbestaudio(data={},type=1){
    if(type==2){
        var a=[0,data[0]['url']]
        const len=Object.keys(data).length
        for(var i=0;i<len;i++){
            if(data[i]['abr']!==null&&data[i]['abr']!==undefined){
            if(a[0]<data[i]['abr']){a=[data[i]['abr'],data[i]['url']]}
        }else if(data[i]['vcodec']=="none"){return data[len-1]['url']}}
        return a[1]
    }
    if(data[0]){
        var a=[0,data[0].url];
        for(let i of data){
            if(i.audioBitrate)if(i.audioBitrate>a[0]){
                a[1]=i.url;
                a[0]=i.audioBitrate;
            }
        }
        if(a!=0)return a[1];
    }
    for(let i of data){
        if(i.audioQuality=="AUDIO_QUALITY_MEDIUM") return i.url;
    }
    return data[data.length-2].url;
  };

/**
 * 
 * @param {{url:string,width:number,height:number}[]} thumbnails 
 */
function best_thumbnail(thumbnails){
    if(!thumbnails) return;
    var max=[0,thumbnails[0]?thumbnails[0]?.url:""]
    for(let thumbnail of thumbnails){
        if(thumbnail.height*thumbnail.width>max[0])
            max=[thumbnail.height*thumbnail.width,thumbnail.url];
    }
    return max[1];
}

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
/**
 * 
 * @param {string} request
 * @param {{duration:number}} data 
 * @param {number} n 
 * @returns 
 */
async function getdata(request,data={},n=0){
    if(!request) return;if(n>5) return;
    var result={};
    if(ytdl.validateURL(request)){
        let res=await ytdl.getInfo(request,{lang:"ru",requestOptions:{headers:{Cookies:cookies}}});
        if(!res) return;
        result.video_url=res.videoDetails?.video_url;result.type="youtube";
        result.verified=res.videoDetails?.author?.verified;
        result.url=await findbestaudio(res.formats).catch(()=>{});
        result.duration=data.duration?data.duration:Number(res.videoDetails?.lengthSeconds);
        result.title=res.videoDetails?.title;result.author=res.videoDetails?.author?.name;
        result.author_thumbnail=best_thumbnail(res.videoDetails?.author?.thumbnails);
        result.description=res.videoDetails?.description;
        result.thumbnail=best_thumbnail(res.videoDetails?.thumbnails);
        result.uploadDate=res.videoDetails?.uploadDate;
        result.views=Number(res.videoDetails?.viewCount);
        result.chapters=res.videoDetails?.chapters
        result.author_url=res.videoDetails?.author?.channel_url||res.videoDetails?.author?.user_url
    }else if(request.startsWith("https://")||request.startsWith("http://")){
        try{
            let r=await exec(`ffprobe -user_agent "${user_agent}" -print_format json -show_format "${request}"`,{cwd:ffmpegdir}).catch(()=>null),res;
            if(r?.stdout){
                try{res=JSON.parse(r.stdout)?.format}catch{}
                if(res){
                    result.url=request; result.type="ffprobe";
                    result.author=res?.tags?.artist;result.title=res?.tags?.title;
                    result.duration=Number(res?.duration);
                }
            }else{
               let r1=await exec(`youtube-dl -j "${request}"`,{cwd:ffmpegdir}).catch(()=>null);
                try{res=JSON.parse(r1.stdout)}catch{};
                if(res){
                    result.video_url=request;result.url=await findbestaudio(res.formats,2);
                    result.thumbnail=best_thumbnail(res.videoDetails?.thumbnails);
                    result.views=res.view_count;result.author=res.uploader;
                    result.title=res.title;result.type="youtube-dl";
                    result.duration=Number(res.duration);
                }
            }
        }catch{}
    }else{
        let res=(await ytsearch(request).catch(()=>null))?.videos[0];
        return await getdata(res?.url);
    }
    return new Track(result);
}

class PlayList extends EventEmitter{
    constructor(){
        super()
        /**
         * @name PlayList#playlist
         * @type {Track[]}
         * @readonly
         */
        this.playlist=[];
        /**
         * @name PlayList#queue
         * @type {{request:string,message:Message}[]}
         * @readonly
         */
        this.queue=[]
        /**
         * @name PlayList#work
         * @type {boolean}
         * @readonly
         * @private
         */
        this.work=false
        /**
         * @name PlayList#repeat
         * @type {number}
         * @readonly
         */
        this.repeat=0;
    }
    /**
     * data
     */
    async _process(){
        while(this.queue.length){try{
            let item=this.queue.shift();
            if(item.request=="!LOCAL!"){
                for(let file of item.message.attachments){
                    if(i[1].contentType?.startsWith("audio")||[1].contentType?.startsWith("video")){
                        let res = await getdata(item.request).catch(()=>{});
                        if(res){
                            this.playlist.push(res);
                            this.emit("newTrack",item.message);
                        }
                    }
                }
            }
            else if(ytpl.validateID(item.request)){
                let playlist=await ytpl(item.request).catch(()=>{})
                if(playlist){
                    let embed=new MessageEmbed().setColor(14441063).setTitle('Добавлен плэйлист:')
                    .addField('Название:',`[${playlist?.title}](${playlist?.url})`,false)
                    .addFields({name:'Автор:',value:`[${playlist?.author?.name}](${playlist?.author?.url})`,inline:true},
                    {name:'Просмотров',value:playlist?.views?.toString(),inline:true},
                    {name:'Последнее изменение',value:playlist?.lastUpdated?.toString().substring(16),inline:true})
                    .setImage(playlist?.bestThumbnail?.url)
                    for(let track of playlist.items){
                        let res = await getdata(track.shortUrl,{duration:track.durationSec}).catch((err)=>{console.log(err)});
                        if(res?.url){
                            this.playlist.push(res);
                            this.emit("newTrack",item.message);
                        }
                    }
                    item.message.reply({embeds:[embed]}).catch(async(err)=>{console.log(err)});
                }
            }else if(0){
                
            }else{
                let res = await getdata(item.request).catch(()=>{});
                if(res){
                    this.playlist.push(res)
                    this.emit("newTrack",item.message);
                }
                
            }
            
        }catch(e){console.log(e)}}
        this.work=false
    }
    /**
     * Add track to the playlist
     * @param {string} request 
     * @param {Message} message
     */
    add(request,message){
        this.queue.push({request:request,message:message})
        if(this.work) return;
        this.work=true;
        this._process();
    }
    get(count){
        if(this.repeat==0)
            return this.playlist.shift();
        if(this.repeat==2){
            let track = this.playlist.shift();
            this.playlist.push(track);
            return track;
        }
    }
    /**
     * Delete tracks
     * @param {*} positionstart 
     * @param {*} count 
     * @returns 
     */
    delete(positionstart,count=1){
        return this.playlist.splice(positionstart,count);
    }
}

module.exports={PlayList}
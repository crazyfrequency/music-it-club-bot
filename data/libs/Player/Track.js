const cookies = "APISID=KvpilY1TzuTWjjF8/AGebHuhBO0BlwqLMk; HSID=AXutkrbtmD-gnU3N_; LOGIN_INFO=AFmmF2swRQIhAPhNv-ZweZ79zRMWXhQAx-1H35E6B2ZNVLum7m7RklbJAiA2v1lS5RnpWslfVeDVFwa1awy-_np8iahP6ZRV8fTVvQ:QUQ3MjNmeGhBcjVwRFhrSkpFWFFHdVdJbFN0M1RXTVExN0FqNm9meVFhS3p4TUpVYW5Lc3U3QmVMX0ZXQ0JzWlg4U3lyLVF5Q2l5bFR4N0t5WFpuUk4zSWYycU1HNmpSX29jSWZDMHR4QS1zMExSbzd6a1diUGtFZDlBeWwxQk5LSGNMbWdiSDBvWk5aQUJYNUJmbF83M3hUMnJ5TU5SbmZ3; SAPISID=z_zjWozPs8OeKZOE/AmJ7jQTuZi_dM1Jwr; SID=GAgE0ryB5sb4p_e3iJi4mhleiM--qNJqXQcj6BKzzMYV3BTvltd_4u8j9i23NBl3-N0Oag.; SIDCC=AJi4QfHCOCBvCDmw9LbqowRss2FXadTYG5mNopaZU8cXORfrg9_n_7Im7dSQ_r-Y9QA078xn; SSID=ArWNCsnPFLLHspWhD; VISITOR_INFO1_LIVE=bQV13xq6F2c; YSC=3NB_UUJ-DE0";
const {EmbedBuilder} = require("discord.js")
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ytdl = require('ytdl-core');
var youtubeChapters = require('get-youtube-chapters');

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
function parseduration(time){
    time=Number(time);
    let hours = Math.floor(time / 3600);time = time - hours * 3600;
    let minutes = Math.floor(time / 60),seconds = time - minutes * 60;
    return `${hours?hours+":":""}${minutes>9?minutes:"0"+minutes}:${seconds>9?seconds:"0"+seconds}`
}

class Track{
    constructor(data,id=0){
        /**
         * Title of this track
         * @name Track#title
         * @type {string}
         */
        this.title=data.title?data.title:data.video_url?data.video_url:data.url;
        /**
         * Description of this track
         * @name Track#description
         * @type {string}
         */
        this.description=data.description?data.description:"?????? ????????????????";
        /**
         * Author of this track
         * @name Track#author
         * @type {string}
         */
        this.author=data.author?data.author:"?????????? ???? ????????????????";
        /**
         * Url of author channel
         * @name Track#author_url
         * @type {string|undefined}
         */
        this.author_url=data.author_url?data.author_url:undefined
        /**
         * Verification of author
         * @name Track#verified
         * @type {number}
         */
        this.verified=data.verified;
        /**
         * Thumbnail of author
         * @name Track#author_thumbnail
         * @type {string|undefined}
         */
        this.author_thumbnail=data.author_thumbnail;
        /**
         * Upload date of this track
         * @name Track#uploadDate
         * @type {string|undefined}
         */
        this.uploadDate=data.uploadDate;
        /**
         * URL source of this track
         * @name Track#url
         * @type {string}
         */
        this.url=data.url;
        /**
         * URL of this track
         * @name Track#video_url
         * @type {string}
         */
         this.video_url=data.video_url?data.video_url:data.url;
        /**
         * Thumbnail of this track
         * @name Track#thumbnail
         * @type {string}
         */
        this.thumbnail=data.thumbnail?data.thumbnail:"https://cdn.discordapp.com/attachments/911499726644477992/975252886416146452/undefinded.png";
        /**
         * Duration of this track
         * @name Track#duration
         * @type {number}
         */
        this.duration=data.duration?data.duration:-1;
        /**
         * Views count of this track
         * @name Track#views
         * @type {number}
         */
        this.views=data.views;
        /**
         * Likes count of this track
         * @name Track#likes
         * @type {number}
         */
        this.likes=data.likes;
        this.id=id;
        var c=undefined;
        if(data.chapters){
            c=[];
            for(let i of data.chapters){
                c.push({
                    title:i.title,
                    start_time_name:parseduration(parseti(i.start_time)),
                    start_time:parseti(i.start_time)
                })
            }
        }else{
            let chapters = youtubeChapters(this.description)
            c=[];
            if(chapters)
            for(let i of chapters){
                c.push({
                    title:i.title,
                    start_time_name:parseduration(parseti(i.start)),
                    start_time:parseti(i.start)
                })
            };
        }
        /**
         * Chapters of this track
         * @name Track#chapters
         * @type {{title:string,start_time_name:string,start_time:number}[]}
         */
        this.chapters=c;
        /**
         * Person who requested this track
         * @name Track#requestedBy
         * @type {User}
         */
        this.user=data.user;
        /**
         * Type of link
         * @name Track#type
         * @type {string}
         */
        this.type=data.type;
        /**
         * Time when gets url
         * @name Track#shelf_life
         * @type {number}
         */
        this.shelf_life=+new Date();
        /**
         * Error count
         * @name Track#errors
         * @type {number}
         */
        this.errors=0;
    }
    async getUrl(newdata=false){
        if(new Date()-this.shelf_life>21600000){
            let res = await ytdl.getBasicInfo(request,{lang:"ru",requestOptions:{headers:{Cookies:cookies}}}).catch(()=>null);
            if(res)
            this.url = await findbestaudio(res.formats).catch(()=>{})||this.url;
        }
        return this.url;
    }
    getEmbed(){
        let embed = new EmbedBuilder().setColor(14441063).setTitle('???????????????? ????????:')
        .addFields(
            {name:'????????????????',value:`[${this.title}](${this.video_url})`,inline:false},
            {name:'??????????',value:this.author_url?`[${this.author}](${this.author_url})`:this.author,inline:true}
        )
        if(this.likes) embed.addFields({name:'????????????',value:`${this.likes}`,inline:true})
        if(this.views) embed.addFields({name:'????????????????????',value:`${this.views}`,inline:true})
        embed.setAuthor({name:this.author+([""," ???"," ???"][this.verified]),url:this.author_url,iconURL:this.author_thumbnail})
        .setImage(this.thumbnail);
        if(this.uploadDate)embed.setTimestamp(new Date(this.uploadDate));
        return embed;
    }
    getFullEmbed = ()=>this.getEmbed().setFooter(this.description?{text:this.description}:null)
}

module.exports={Track}
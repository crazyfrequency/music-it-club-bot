const cookies = "APISID=KvpilY1TzuTWjjF8/AGebHuhBO0BlwqLMk; HSID=AXutkrbtmD-gnU3N_; LOGIN_INFO=AFmmF2swRQIhAPhNv-ZweZ79zRMWXhQAx-1H35E6B2ZNVLum7m7RklbJAiA2v1lS5RnpWslfVeDVFwa1awy-_np8iahP6ZRV8fTVvQ:QUQ3MjNmeGhBcjVwRFhrSkpFWFFHdVdJbFN0M1RXTVExN0FqNm9meVFhS3p4TUpVYW5Lc3U3QmVMX0ZXQ0JzWlg4U3lyLVF5Q2l5bFR4N0t5WFpuUk4zSWYycU1HNmpSX29jSWZDMHR4QS1zMExSbzd6a1diUGtFZDlBeWwxQk5LSGNMbWdiSDBvWk5aQUJYNUJmbF83M3hUMnJ5TU5SbmZ3; SAPISID=z_zjWozPs8OeKZOE/AmJ7jQTuZi_dM1Jwr; SID=GAgE0ryB5sb4p_e3iJi4mhleiM--qNJqXQcj6BKzzMYV3BTvltd_4u8j9i23NBl3-N0Oag.; SIDCC=AJi4QfHCOCBvCDmw9LbqowRss2FXadTYG5mNopaZU8cXORfrg9_n_7Im7dSQ_r-Y9QA078xn; SSID=ArWNCsnPFLLHspWhD; VISITOR_INFO1_LIVE=bQV13xq6F2c; YSC=3NB_UUJ-DE0";
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const ytdl = require('ytdl-core');

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
    constructor(data){
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
        this.description=data.description?data.description:"нет описания";
        /**
         * Author of this track
         * @name Track#author
         * @type {string}
         */
        this.author=data.author?data.author:"автор не известен";
        /**
         * Url of author channel
         * @name Track#author_url
         * @type {string}
         */
        this.author_url=data.author_url?data.author_url:undefined
        /**
         * Verification of author
         * @name Track#verified
         * @type {boolean}
         */
        this.verified=data.verified;
        /**
         * Thumbnail of author
         * @name Track#author_thumbnail
         * @type {string}
         */
        this.author_thumbnail=data.author_thumbnail;
        /**
         * Upload date of this track
         * @name Track#uploadDate
         * @type {string}
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
        this.thumbnail=data.thumbnail?data.thumbnail:"attachment://undefinded.png";
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
         */
        this.likes=data.likes;
        var c;
        if(data.chapters){
            var c=[];
            for(let i of data.chapters){
                c.push({
                    title:i.title,
                    start_time_name:parseduration(parseti(i.start_time)),
                    start_time:parseti(i.start_time)
                })
            }
        }else c=undefined;
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
    getUrl(newdata=false){
        return this.url;
    }
}

module.exports={Track}
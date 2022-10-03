const {Client,Intents, Options, Message,MessageEmbed, VoiceChannel} = require('discord.js');
const fs = require('fs');
const myIntents = new Intents();
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const {fork,spawn} = require('child_process');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior,getVoiceConnection,StreamType,demuxProbe } = require('@discordjs/voice');
const user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3534.0 Safari/537.36'

function findbestaudio(data={}){
    var a=[0,data[0]['url']]
    const len=Object.keys(data).length
    for(var i=0;i<len;i++){
        if(data[i]['abr']!==null&&data[i]['abr']!==undefined){
        if(a[0]<data[i]['abr']){a=[data[i]['abr'],data[i]['url']]}
    }else if(data[i]['vcodec']=="none"){return data[len-1]['url']}}
    return a[1]
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

class DiscordPlayer{
    constructor(channel,messagechannel,process=undefined,playerenable=true){
        this.playerenable=playerenable
        this.messagechannel=messagechannel
        this.guild=channel.guild
        this.process=process
        this.channel=channel;
        this.playlist=[];
        this.resource=0
        this.searching=false;
        this.status='idle';
        this.ffmpeg=0;
        this.duration=0;
        this.time=0;
        this.connection=joinVoiceChannel({
            channelId:channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        this.player=createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });
        this.connection.subscribe(this.player);
        this.speed=1.0;
        this.move=-1;
        this.settings={};
        this.volume=1.0;
        this.skiper=false;
        this.nowplay={};
        this.guild=channel.guild;
        this.repeat=0;
        this.player.on('stateChange',async(o,n)=>{try{
            this.status=n.status;
            if(this.skiper===false&&this.move===-1&&n.status==='idle'){
                if(this.nowplay.duration!=undefined&&this.nowplay.duration>0){
                    console.log('ok',this.nowplay.duration-(this.duration/1000*this.speed+this.time))
                    if((this.nowplay.duration-(this.duration/1000*this.speed+this.time))>2){
                        this.nowplay.time=this.time+this.duration/1000*this.speed
                        console.error('retry');this.status='playing';
                        this._play(this.nowplay);
                    }
                }
            }this.skiper=false;
            if(this.status==='idle'&&this.playlist.length!==0&&this.move===-1){
                if(this.repeat===0){
                    var now = this.playlist.shift();
                    try{this.ffmpeg.kill()}catch{}
                    this._play(now)
                }else if(this.repeat===1){
                    this.nowplay.time=0;
                    try{this.ffmpeg.kill()}catch{}
                    this._play(this.nowplay);
                }else{
                    this.nowplay.time=0;
                    try{this.ffmpeg.kill()}catch{}
                    this.playlist.push(this.nowplay);
                    var now = this.playlist.shift();
                    this._play(now);
                }
            }else if(this.move!=-1){
                const time = this.move;
                this.move=-1;
                try{this.ffmpeg.kill()}catch{}
                this.nowplay.time=time;
                this._play(this.nowplay);
            }else if(this.status==='idle'&&this.playlist.length===0){
                try{this.ffmpeg.kill()}catch{}
                this.nowplay={};
                if(this.searching===true){
                    setTimeout(async()=>{
                        var now=this.playlist.shift()
                        if(now!==undefined){
                            this._play(now);
                        }
                    },3000)
                }
                this.sender('end')
            }
        }catch{console.error('end error')}});
    }
    disconnect(){
        this.playlist=[];
        this.player.stop();
        try{this.ffmpeg.kill()}catch{};
        this.connection.disconnect();
        this.sender('end')
        return true
    }
    no_in_channel(){
        this.playlist=[];
        this.player.stop();
        try{this.ffmpeg.kill()}catch{};
        this.sender('end')
    }
    is_pl_or_pa(h=true){
        if(this.status!='idle'){
            return true
        }if(h){this.status='playing'}
        return false
    }
    async getdata(url='',time='0',trynumber=1){
        if(url==''||url==' '||url==undefined) return null
        var data={},type=0,newdata={};
        if(url.indexOf('http://')!=-1||url.indexOf('https://')!=-1){
            if(url.indexOf('youtube.com')!=-1||url.indexOf('youtu.be')!=-1){type=1;
                const {stdout,stderr} = await exec('youtube-dl --cookie cookies.txt -i "'+url+'" --source-address 0.0.0.0 --no-check-certificate --no-playlist --skip-download -j');                
                if(stdout!=''){try{
                    data=JSON.parse(stdout);
                }catch(e){console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)}}
                if(stderr!=''){console.error(stderr)}
            }else{type=2;
                var {stdout,stderr} = await exec('youtube-dl -i "'+url+'" --source-address 0.0.0.0 --no-check-certificate --skip-download -j');
                if(stdout!=''){try{
                    data=JSON.parse(stdout);
                }catch(e){console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)}}
                if(stderr!=''){console.error(stderr)}
            }
        }else{type=1;
            const {stdout,stderr} = await exec('youtube-dl --cookie cookies.txt -i ytsearch:"'+url+'" --source-address 0.0.0.0 --no-check-certificate --no-playlist --skip-download -j');
                if(stdout!=''){try{
                    data=JSON.parse(stdout);
                }catch(e){console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)}}
                if(stderr!=''){console.error(stderr)}
        }
        if('entries' in data){data = data['entries'][0]}
        if(type==1){
            newdata.url=findbestaudio(data['formats']);
            var nowdata={};
            try{
                const {stdout,stderr} = await exec('ffprobe -user_agent "'+user_agent+'" -v quiet -print_format json -show_format -i "'+newdata.url+'"');
                nowdata=JSON.parse(stdout);
                if(Object.keys(nowdata).length === 0){
                    if(trynumber>5) return null;
                    return this.getdata(url,time,trynumber+1);
                }
            }catch{
                if(trynumber>5)return null;
                return this.getdata(url,time,trynumber+1);
            }
            newdata.webpage_url=data.webpage_url
            newdata.picture=data.thumbnail
            newdata.duration=data.duration
            newdata.upload_date=data.upload_date
            newdata.title=data.title
            newdata.author=data.uploader
            newdata.description=data.description
            newdata.view_count=data.view_count
            newdata.chapters=data.chapters
            newdata.like_count=data.like_count
            newdata.time=parseti(time);
        }else{
            if(data['formats'][0]['url']!=undefined){
                newdata.url=findbestaudio(data.formats);
                newdata.webpage_url=data.webpage_url
                newdata.picture=data.thumbnail
                newdata.duration=data.duration
                newdata.upload_date=data.upload_date
                newdata.title=data.title
                newdata.author=data.uploader
                newdata.description=data.description
                newdata.view_count=data.view_count
                newdata.chapters=data.chapters
                newdata.like_count=data.like_count
                newdata.time=parseti(time);
            }
            try{
                const {stdout,stderr} = await exec('ffprobe -user_agent "'+user_agent+'" -v quiet -print_format json -show_format -i "'+url+'"');
                nowdata=JSON.parse(stdout).format
                newdata.url=url;
                newdata.webpage_url=url;
                newdata.duration=nowdata?.duration;
                if(nowdata.tags!=undefined){
                    if(nowdata.tags.title!=undefined){newdata.title=nowdata.tags.title}else{newdata.title=url};
                    if(nowdata.tags.artist!=undefined){newdata.author=nowdata.tags.artist}else{newdata.author='внешняя ссылка'}; 
                }
                newdata.time=parseti(time);
            }catch(e){console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)}
            
            
        }
        return newdata
    }
    async add(url='',time='0'){
        this.searching=true
        try{
            var data = await this.getdata(url,time);
            if(data==null||data==undefined) return null
            this.playlist.push(data)
            this.searching=false
            var a = []
            if(data.author!=undefined){a.push({name:'Автор',value:data.author,inline:true})}
            if(data.like_count!=undefined){a.push({name:'Лайков',value:data.like_count.toString(),inline:true})}
            if(data.view_count!=undefined){a.push({name:'Просмотров',value:data.view_count.toString(),inline:true})}
            const embded=new MessageEmbed().setColor(14441063).setTitle('Результат поиска:')
            .addField('Название:',data.title,false).addFields(a).setURL(data.webpage_url)
            if(data.picture!=undefined){embded.setImage(data.picture)}
            this.sender('newmess')
            return embded
        }catch(e){this.searching=false;console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);}
        return null
    }
    async play(url='',time='0'){
        try{
            this.searching=true
            var data = await this.getdata(url,time);
            if(data==null||data==undefined) return null
            this._play(data)
            this.searching=false
            var a = []
            if(data.author!=undefined){a.push({name:'Автор',value:data.author,inline:true})}
            if(data.like_count!=undefined){a.push({name:'Лайков',value:data.like_count.toString(),inline:true})}
            if(data.view_count!=undefined){a.push({name:'Просмотров',value:data.view_count.toString(),inline:true})}
            const embded=new MessageEmbed().setColor(14441063).setTitle('Результат поиска:')
            .addField('Название:',data.title,false).addFields(a).setURL(data.webpage_url)
            if(data.picture!=undefined){embded.setImage(data.picture)}
            this.sender('newmess')
            return embded
        }catch(e){this.searching=false;console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);}
        return null
    }
    skip(position=''){try{
        let pos=Number(position)
        if(position===''||pos===0){
            this.skiper=true;
            this.player.stop(true);

            return 'ok'
        }else{
            var remove = this.playlist.splice(pos-1,1)[0];
            return `Удалено ${pos}: ${remove.title} - ${remove.author}`
        }
    }catch(e){console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack);return null}}

    _play(data){try{
        this.nowplay=data
        var args=['-reconnect_at_eof','1','-reconnect_streamed','1','-reconnect_delay_max','2','-vn','-sn','-user_agent',user_agent];
        if(data.time>0){args=args.concat('-ss',data.time)};

        args=args.concat(['-i',data.url,'-f', 's16le', // PCM 16bits, little-endian
            '-ar', '48000', // Sampling rate
            '-ac', 2, // Stereo
            '-loglevel','debug',
            'pipe:1', // Output on stdout
        ])
        this.ffmpeg = spawn('ffmpeg',args);
        this.resource=createAudioResource(this.ffmpeg.stdout,{inlineVolume:true,inputType:'raw'});
        this.player.play(this.resource);
        this.resource.volume.setVolume(this.volume);
        this.nowplay=data;
        this.time=data.time;
        this.ffmpeg.stderr.on('data',async (chunk)=>{
            if(this.resource.playbackDuration>1024) this.duration=this.resource.playbackDuration
            var textChunk = chunk.toString('utf8');
            console.log(textChunk);
        });}catch(e){console.error('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)}
        this.sender()
    }

    mover(time){
        let t;
        if(time===undefined){t=0}
        else{t=parseti(time)}
        this.move=t;
        this.player.stop(true);
        this.sender('newmess');
    }

    async sender(state='player'){
        if(this.playerenable===false) return
        if(this.process!=undefined){
            if(state==='player'){
                setTimeout(() => {
                    this.process.send({
                        data:this.nowplay,status:this.status,speed:this.speed,
                        volume:this.volume,settings:this.settings,repeat:this.repeat,
                        time:this.time,duration:this.duration,messagechannel:this.messagechannel,
                        guild:this.guild,type:'player',start:Date.now(),
                    });
                }, 500);
            }else if(state==='newmess'){
                this.process.send({
                    data:this.nowplay,status:this.status,speed:this.speed,
                    volume:this.volume,settings:this.settings,repeat:this.repeat,
                    time:this.time,duration:this.duration,messagechannel:this.messagechannel,
                    guild:this.guild,type:'player',start:Date.now(),
                });
            }else if(state==='data'){
                this.process.send({
                    data:this.nowplay,status:this.status,speed:this.speed,
                    volume:this.volume,settings:this.settings,repeat:this.repeat,
                    time:this.time,duration:this.duration,messagechannel:this.messagechannel,
                    guild:this.guild,type:'data',start:Date.now(),
                });
            }else if(state==='end'){
                this.process.send({
                    guild:this.guild,type:'end',
                });
            }
        }
    }

    resume(){this.player.unpause();this.sender('data');}

    pause(){this.player.pause();this.sender('data');}

    setvolume(volume){
        if(this.player.state==='idle'){this.volume=volume;}
        else{
            this.volume=volume;
            this.resource.volume.setVolume(this.volume);
        }
    }
    
    moveto(){
        this.connection.rejoin()
    }
}
module.exports = DiscordPlayer
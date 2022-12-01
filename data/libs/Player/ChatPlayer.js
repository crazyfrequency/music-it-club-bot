const DiscordPlayer = require("./DiscordPlayer");
const {MessageEmbed,VoiceChannel,Message,MessageActionRow,MessageButton,MessageSelectMenu} = require('discord.js');

function parseduration(time){
    time=Number(time);
    let hours = Math.floor(time / 3600);time = time - hours * 3600;
    let minutes = Math.floor(time / 60),seconds = time - minutes * 60;
    return `${hours?hours+":":""}${minutes>9?minutes:"0"+minutes}:${seconds>9?seconds:"0"+seconds}`
}
class ChatPlayer{
    constructor(enableplayer){
        this.message=undefined;
        this.channel=undefined;
        this.work=false
        this.enableplayer=enableplayer;
    }
    setchannel=(channel)=>this.channel=channel;
    /**
     * 
     * @param {DiscordPlayer} element 
     * @param {MessageChannel} channel 
     */
    async editnewplayer(element,channel=undefined){try{
        if(!this.enableplayer) return;
        this.work=true
        if(channel) this.channel=channel;
        let track = element.track;
        if(!track) return this.work=false;
        let embed=new MessageEmbed().setColor(), buttons=[new MessageActionRow(),new MessageActionRow()];
        let position = (element.resource?.playbackDuration|0)/1000,
        pos=~~(element.time+(position-element.position)*element.options.speed+0.2),
        respos=~~(pos/track?.duration*50),
        player=`\`${"-".repeat(respos)}█${"-".repeat(50-respos)}\`\n${parseduration(pos)} / ${parseduration(~~element.track?.duration)}`
        embed.setColor(14441063).setTitle("Сейчас играет:")
        .setDescription(player).addField("Название:",`[${track?.title}](${track?.video_url})`,false)
        let author = track?.author,
        volume=~~(element.options.volume*20),
        speed=(element.options.speed>=1?~~(element.options.speed*4):~~((element.options.speed-0.5)*8));
        if(track?.author_url) author=`[${author}](${track?.author_url})`
        embed.addField("Автор",author,true)
        .addField("Громкость",`${"-".repeat(volume>8?8:volume)}█${"-".repeat(volume>8?6:8-volume)}\n${element.options.volume*5}`,true)
        .addField("Скорость",`${"-".repeat(speed>8?8:speed)}█${"-".repeat(speed>8?6:8-speed)}\n${element.options.speed}`,true)
        if(track.thumbnail) embed.setThumbnail(track.thumbnail);
        let buttons1=[
            new MessageButton().setStyle("SECONDARY")
            .setLabel("⏪").setCustomId("player:prev"),
            new MessageButton().setStyle("PRIMARY")
            .setLabel("⏯").setCustomId("player:res/pau"),
            new MessageButton().setStyle("SECONDARY")
            .setLabel("⏩").setCustomId("player:next")
            
        ],buttons2=[
            new MessageButton().setStyle("SECONDARY")
            .setLabel("🎛️").setCustomId("player:settings"),
            new MessageButton().setStyle("PRIMARY")
            .setLabel("🔃").setCustomId("player:reload"),
            new MessageButton().setStyle("SECONDARY")
            .setLabel("⏪⏩").setCustomId("player:move"),
            new MessageButton().setStyle("SUCCESS")
            .setLabel("➕").setCustomId("player:add"),
            new MessageButton().setStyle("DANGER")
            .setLabel("❌").setCustomId("player:disable"),
        ];switch(element.playlist.repeat){
            case 0:buttons1.push(
                new MessageButton().setStyle("SECONDARY")
                .setLabel("➡️").setCustomId("player:repeat")
            );break;
            case 1:buttons1.push(
                new MessageButton().setStyle("SECONDARY")
                .setLabel("🔂").setCustomId("player:repeat")
            );break;
            case 2:buttons1.push(
                new MessageButton().setStyle("SECONDARY")
                .setLabel("🔁").setCustomId("player:repeat")
            );break;
        };buttons1.push(new MessageButton().setStyle("DANGER")
            .setLabel("⏭").setCustomId("player:skip"))
        buttons[0].addComponents(buttons1);buttons[1].addComponents(buttons2);
        let chapters = element.track?.chapters;
        if(chapters){
            let chapall=[],chap=[],i=0,finded=false;
            while(i<chapters.length&&i<75){
                if(chap.length<25){
                    chap.push({
                        label: chapters[i]?.title,
                        description: chapters[i]?.start_time_name,
                        value: chapters[i]?.start_time?.toString(),
                    })
                }else{
                    chapall.push(chap);chap=[];
                    chap.push({
                        label: chapters[i]?.title,
                        description: chapters[i]?.start_time_name,
                        value: chapters[i]?.start_time?.toString(),
                    })
                }
                if(chapters[i++].start_time>pos&&!finded){
                    embed.addField("Часть:",chapters[i-2].title,false);
                    finded=true;
                }
            }chapall.push(chap);
            if(!finded&&chapters?.length){
                if(chapters.length>75){
                    for(;i<chapters.length;i++){
                        if(chapters[i].start_time>pos){
                            embed.addField("Часть:",chapters[i-1].title,false);
                            finded=true;break;
                        }
                    }
                    if(!finded) embed.addField("Часть:",`${i+1}:`+chapters[i-1].title,false);
                }else
                embed.addField("Часть:",chapters[i-1]?.title,false);
            }
            if(chapters?.length)
            for(i=0;i<chapall.length;i++){
                buttons.push(new MessageActionRow().setComponents(
                    new MessageSelectMenu().setCustomId(i.toString())
                    .setPlaceholder(`Части от ${i*25+1} до ${((i+1)*25>chapters.length)?chapters.length:(i+1)*25}`)
                    .setOptions(chapall[i]).setCustomId(`player:move:${i}`)
                ))
            }
        }
        if(this.message)
        this.message.edit({embeds:[embed],components:buttons}).catch(async()=>{
            this.message = await this.channel?.send({embeds:[embed],components:buttons}).catch(()=>console.log(e));
        })
        this.work=false;
    }catch(e){this.work=false;console.log(e)}}
    
    async sendnewplayer(element,message=undefined){try{
        if(!this.enableplayer) return;
        this.work=true
        if(channel) this.channel=channel;
        let track = element.track;
        if(!track) return this.work=false;
        let embed=new MessageEmbed().setColor(), buttons=[new MessageActionRow(),new MessageActionRow()];
        let position = (element.resource?.playbackDuration|0)/1000,
        pos=~~(element.time+(position-element.position)*element.options.speed+0.2),
        respos=~~(pos/track?.duration*50),
        player=`\`${"-".repeat(respos)}█${"-".repeat(50-respos)}\`\n${parseduration(pos)} / ${parseduration(~~element.track?.duration)}`
        embed.setColor(14441063).setTitle("Сейчас играет:")
        .setDescription(player).addField("Название:",`[${track?.title}](${track?.video_url})`,false)
        let author = track?.author,
        volume=~~(element.options.volume*20),
        speed=(element.options.speed>=1?~~(element.options.speed*4):~~((element.options.speed-0.5)*8));
        if(track?.author_url) author=`[${author}](${track?.author_url})`
        embed.addField("Автор",author,true)
        .addField("Громкость",`${"-".repeat(volume>8?8:volume)}█${"-".repeat(volume>8?6:8-volume)}\n${element.options.volume*5}`,true)
        .addField("Скорость",`${"-".repeat(speed>8?8:speed)}█${"-".repeat(speed>8?6:8-speed)}\n${element.options.speed}`,true)
        if(track.thumbnail) embed.setThumbnail(track.thumbnail);
        let buttons1=[
            new MessageButton().setStyle("SECONDARY")
            .setLabel("⏪").setCustomId("player:prev"),
            new MessageButton().setStyle("PRIMARY")
            .setLabel("⏯").setCustomId("player:res/pau"),
            new MessageButton().setStyle("SECONDARY")
            .setLabel("⏩").setCustomId("player:next")
            
        ],buttons2=[
            new MessageButton().setStyle("SECONDARY")
            .setLabel("🎛️").setCustomId("player:settings"),
            new MessageButton().setStyle("PRIMARY")
            .setLabel("🔃").setCustomId("player:reload"),
            new MessageButton().setStyle("SECONDARY")
            .setLabel("⏪⏩").setCustomId("player:move"),
            new MessageButton().setStyle("SUCCESS")
            .setLabel("➕").setCustomId("player:add"),
            new MessageButton().setStyle("DANGER")
            .setLabel("❌").setCustomId("player:disable"),
        ];switch(element.playlist.repeat){
            case 0:buttons1.push(
                new MessageButton().setStyle("SECONDARY")
                .setLabel("➡️").setCustomId("player:repeat")
            );break;
            case 1:buttons1.push(
                new MessageButton().setStyle("SECONDARY")
                .setLabel("🔂").setCustomId("player:repeat")
            );break;
            case 2:buttons1.push(
                new MessageButton().setStyle("SECONDARY")
                .setLabel("🔁").setCustomId("player:repeat")
            );break;
        };buttons1.push(new MessageButton().setStyle("DANGER")
            .setLabel("⏭").setCustomId("player:skip"))
        buttons[0].addComponents(buttons1);buttons[1].addComponents(buttons2);
        let chapters = element.track?.chapters;
        if(chapters){
            let chapall=[],chap=[],i=0,finded=false;
            while(i<chapters.length&&i<75){
                if(chap.length<25){
                    chap.push({
                        label: chapters[i]?.title,
                        description: chapters[i]?.start_time_name,
                        value: chapters[i]?.start_time?.toString(),
                    })
                }else{
                    chapall.push(chap);chap=[];
                    chap.push({
                        label: chapters[i]?.title,
                        description: chapters[i]?.start_time_name,
                        value: chapters[i]?.start_time?.toString(),
                    })
                }
                if(chapters[i++].start_time>pos&&!finded){
                    embed.addField("Часть:",chapters[i-2].title,false);
                    finded=true;
                }
            }chapall.push(chap);
            if(!finded&&chapters?.length){
                if(chapters.length>75){
                    for(;i<chapters.length;i++){
                        if(chapters[i].start_time>pos){
                            embed.addField("Часть:",chapters[i-1].title,false);
                            finded=true;break;
                        }
                    }
                    if(!finded) embed.addField("Часть:",`${i+1}:`+chapters[i-1].title,false);
                }else
                embed.addField("Часть:",chapters[i-1]?.title,false);
            }
            if(chapters?.length)
            for(i=0;i<chapall.length;i++){
                buttons.push(new MessageActionRow().setComponents(
                    new MessageSelectMenu().setCustomId(i.toString())
                    .setPlaceholder(`Части от ${i*25+1} до ${((i+1)*25>chapters.length)?chapters.length:(i+1)*25}`)
                    .setOptions(chapall[i]).setCustomId(`player:move:${i}`)
                ))
            }
        }
        if(this.message)
        this.message.edit({embeds:[embed],components:buttons}).catch(async()=>{
            this.message = await this.channel?.send({embeds:[embed],components:buttons}).catch(()=>console.log(e));
        })
        this.work=false;
    }catch(e){this.work=false;console.log(e)}}
}

module.exports=ChatPlayer
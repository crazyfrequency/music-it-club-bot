const {ChildProcess} = require("child_process");
const bass = (g) => `=g=${g}:f=110:w=0.3`;

const equalizer_settings={
    "32":17,
    "64":30,
    "125":62,
    "250":125,
    "500":250,
    "1k":500,
    "2k":1000,
    "4k":2000,
    "8k":4000,
    "16k":8000
}

const FilterList = {
    bassboost_low: bass(15),
    bassboost: bass(20),
    bassboost_high: bass(30),
    "8D": "apulsator=hz=0.09",
    vaporwave: "aresample=48000,asetrate=48000*0.8",
    nightcore: "aresample=48000,asetrate=48000*1.25",
    phaser: "aphaser=in_gain=0.4",
    tremolo: "tremolo",
    vibrato: "vibrato=f=6.5",
    treble: "treble=g=5",
    normalizer: "dynaudnorm=g=101",
    normalizer2: "acompressor",
    surrounding: "surround",
    pulsator: "apulsator=hz=1",
    subboost: "asubboost",
    karaoke: "stereotools=mlev=0.03",
    flanger: "flanger",
    gate: "agate",
    haas: "haas",
    mcompand: "mcompand",
    mono: "pan=mono|c0=.5*c0+.5*c1",
    mstlr: "stereotools=mode=ms>lr",
    mstrr: "stereotools=mode=ms>rr",
    compressor: "compand=points=-80/-105|-62/-80|-15.4/-15.4|0/-12|20/-7.6",
    expander: "compand=attacks=0:points=-80/-169|-54/-80|-49.5/-64.6|-41.1/-41.1|-25.8/-15|-10.8/-4.5|0/0|20/8.3",
    softlimiter: "compand=attacks=0:points=-80/-80|-12.4/-12.4|-6/-8|0/-6.8|20/-2.8",
    chorus: "chorus=0.7:0.9:55:0.4:0.25:2",
    chorus2d: "chorus=0.6:0.9:50|60:0.4|0.32:0.25|0.4:2|1.3",
    chorus3d: "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:0.25|0.4|0.3:2|2.3|1.3",
    fadein: "afade=t=in:ss=0:d=10",
    dim: `afftfilt="'real=re * (1-clip((b/nb)*b,0,1))':imag='im * (1-clip((b/nb)*b,0,1))'"`,
    earrape: "channelsplit,sidechaingate=level_in=64"
}

class PlayerOptions{
    constructor(){
        /**
         * Speed of player
         * @name PlayerOptions#speed
         * @type {number}
         * @readonly
         */
        this.speed=1.0;
        /**
         *Vaporwave setting
         @name PlayerOptions#vaporwave
         @type {boolean}
         @readonly
         */
        this.vaporwave=false;
        /**
         * Nightcore setting
         * @name PlayerOptions#nightcore
         * @type {boolean}
         * @readonly
         */
        this.nightcore=false;
        /**
         * Volume of player
         * @name PlayerOptions#volume
         * @type {number}
         * @readonly
         */
        this.volume=0.2;
        /**
         * Bassboost setting
         * @name PlayerOptions#bassboost
         * @type {boolean}
         * @readonly
         */
        this.bassboost=false
        /**
         * Bassboost degree setting
         * @name PlayerOptions#bassboostdegree
         * @type {number}
         * @readonly
         */
        this.bassboostdegree=20
        /**
         * 8D setting
         * @name PlayerOptions#8D
         * @type {boolean}
         * @readonly
         */
        this._8D=false
        /**
         * Equalizer settings in Hz
         * @name PlayerOptions#equalizer
         * @type {{
         *  "32":number,"64":number,"125":number,
         *  "250":number,"500":number,"1k":number,
         *  "2k":number,"4k":number,"8k":number,
         *  "16k":number,
         * }}
         * @readonly
         */
        this.equalizer={
            "32":0,
            "64":0,
            "125":0,
            "250":0,
            "500":0,
            "1k":0,
            "2k":0,
            "4k":0,
            "8k":0,
            "16k":0
        }
        /**
         * Equalizer selected setting
         * @type {string}
         */
        this.selected_equalizer_option="32"

    }
    getOptions(){
        let settings=`volume${this.volume!=1?`=${this.volume}`:""},`;
        if(this.vaporwave)
            settings+=FilterList.vaporwave+","
        else if(this.nightcore)
            settings+=FilterList.nightcore+","
        else
            settings+=`atempo${this.speed!=1?`=${this.speed}`:""},`;
        settings+=`bass${this.bassboost?bass(this.bassboostdegree):"=g=0"},`
        if(this._8D)settings+=FilterList["8D"]+","
        for(let i in this.equalizer){
            settings+=`equalizer@h${i}=f=${i}:t=h:w=${equalizer_settings[i]}${this.equalizer[i]!=0?`:g=${this.equalizer[i]}`:""},`
        }
        return ["-af",settings.substring(0,settings.length-1)]
    }
    /**
     * 
     * @param {number|string} volume 
     * @param {ChildProcess} ffmpeg 
     * @returns 
     */
    setVolume(volume,ffmpeg=undefined){
        volume=Number(volume);if(!volume) return;
        this.volume=volume*0.2;
        try{ffmpeg.stdin.write(`^Cvolume -1 volume ${this.volume}\n`)}
        catch{}
    }
    /**
     * 
     * @param {number|string} speed 
     * @param {ChildProcess} ffmpeg 
     * @returns 
     */
    setSpeed(speed,ffmpeg=undefined){
        speed=Number(speed);if(!speed) return;
        if(speed<0.5||speed>2) return;
        this.speed=speed;
        if(this.nightcore||this.vaporwave){this.nightcore=false;this.vaporwave=false;return true}
        try{ffmpeg.stdin.write(`^Catempo -1 tempo ${speed}\n`)}
        catch{}
    }
    /**
     * 
     * @param {"nightcore"|"vaporwave"|"8D"|"bass"|"equalizer"} filter 
     * @param {number|string} param 
     * @param {ChildProcess} ffmpeg
     */
    setFilter(filter,param=undefined,ffmpeg=undefined){
        switch(filter){
            case "nightcore":this.nightcore=true;this.vaporwave=false;this.speed=1;return true;
            case "vaporwave":this.nightcore=false;this.vaporwave=true;this.speed=1;return true;
            case "8D":this._8D=true;return true;
            case "bass":if(Number(param)==NaN)return;
                this.bassboost=true;if(Number(param))this.bassboostdegree=Number(param);
                for(let i in this.equalizer){
                    if(this.equalizer[i]!=0){
                        this.equalizer[i]=0;
                        try{ffmpeg.stdin.write(`^Cequalizer@h${i} -1 g 0\n`)}
                        catch{}
                    }
                }this.bassboostdegree=Number(param);
                try{ffmpeg.stdin.write(`^Cbass -1 g ${this.bassboostdegree}\n`)}
                catch{}
                try{ffmpeg.stdin.write(`^Cbass -1 f 110\n`)}
                catch{}
                try{ffmpeg.stdin.write(`^Cbass -1 w 0.3\n`)}
                catch{}if(this.bassboostdegree==0)this.bassboost=false;return;
            case "equalizer":try{
                if(this.bassboost){
                    this.bassboost=false;
                    try{ffmpeg.stdin.write(`^Cbass -1 g 0\n`)}
                    catch{}
                    try{ffmpeg.stdin.write(`^Cbass -1 f 0\n`)}
                    catch{}
                    try{ffmpeg.stdin.write(`^Cbass -1 w 0\n`)}
                    catch{}
                }
                if(Number(param.split(":")[1])==NaN)return;
                this.equalizer[`${param.split(":")[0]}`]=Number(param.split(":")[1]);
                try{ffmpeg.stdin.write(`^Cequalizer@h${param.split(":")[0]} -1 g ${Number(param.split(":")[1])}\n`)}
                catch(e){console.log(e)}
            }catch{}return;
        }
    }
    async getEqualizer(){
        let eqstr = "";
        for(let i in this.equalizer){
            eqstr+=`${i}: ${this.equalizer[i]}Hz\n`;
        }
        return eqstr;
    }
}

module.exports={PlayerOptions}
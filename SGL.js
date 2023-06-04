const TYPE={
    Vector:0,
    Rect:1,
    Circle:2,
    Arc:3,
    Text:4,
    Line:5,
};

class SGL{
    constructor(width=500, height=500, title=""){
        try{
            if(title)document.title=title;
            this.width=width;
            this.height=height;
            resizeTo(width, height);
            this.canvas=document.createElement("canvas");
            this.canvas.width=this.width;
            this.canvas.height=this.height;
            this.context=this.canvas.getContext("2d");
            this.context.imageSmoothingEnabled=false;
            this.context.lineWidth=3;
            this.context.lineCap = "round";
            this.context.lineJoin = "round";
            this.context.font="20px Arial";
            this.font="20px Arial";
            this.mouse={x:this.width/2, y:this.height/2, accX:0, accY:0, held:false, left:false, right:false, middle:false};
            this.center=this.vec2(this.width / 2, this.height / 2);
            this.key={};
            addEventListener("mousemove",e=>{
                this.mouse.x=e.clientX;
                this.mouse.y=e.clientY;
                this.mouse.accX=e.movementX;
                this.mouse.accY=e.movementY;
            });
            addEventListener("mousedown",e=>{
                this.mouse.held=true;
                e.preventDefault();
                if(e.button==0)this.mouse.left=true;
                if(e.button==1)this.mouse.middle=true;
                if(e.button==2)this.mouse.right=true;
            });
            addEventListener("mouseup",e=>{
                this.mouse.held=false;
                e.preventDefault();
                if(e.button==0)this.mouse.left=false;
                if(e.button==1)this.mouse.middle=false;
                if(e.button==2)this.mouse.right=false;
            });
            addEventListener("keydown",e=>{
                this.key[e.code]=true;
            });
            addEventListener("keyup",e=>{
                this.key[e.code]=false;
            });
            addEventListener("contextmenu",e=>e.preventDefault());
            document.body.style.overflow="hidden";
            document.body.style.margin="0px";
            document.body.style.padding="0px";
            document.body.style.backgroundColor="black";
            setInterval(()=>{ // Update interval
                if(this.width!=this.canvas.width)this.canvas.width=this.width;
                if(this.height!=this.canvas.height)this.canvas.height=this.height;
                this.context.font=this.font;
                this.center=this.vec2(this.width / 2, this.height / 2);
            });
            document.body.appendChild(this.canvas);
            addEventListener("resize",e=>{
                this.width=innerWidth;
                this.height=innerHeight;
            });
            console.log("SGL Loaded Successfully");
        }catch(e){
            console.log("SGL Error: "+e.message);
            SGL_ERR = "SGL Error: " + e.message;
        }
    }

    Title(title){
        if(title)document.title=title;
    }

    vec2(x, y, color=albedo(0)){ // The parameter `color` should only be specified when rendering a pixel
        if(typeof x!=="number")x=0
        if(typeof y!=="number")y=x;
        return {
            type:TYPE.Vector,
            x, y, color,
            magnitude(){
                return abs(sqrt((this.x*this.x)+(this.y*this.y)));
            },
            sub(b){
                return SGL.prototype.vec2(this.x-b.x, this.y-b.y);
            },
            add(b){
                return SGL.prototype.vec2(this.x+b.x, this.y+b.y);
            },
            mul(b){
                return SGL.prototype.vec2(this.x*b.x, this.y*b.y);
            },
            div(b){
                return SGL.prototype.vec2(this.x/b.x, this.y/b.y);
            },
            distance(b){
                return this.sub(b).magnitude();
            },
            normalize(){
                let mag=this.magnitude();
                return SGL.prototype.vec2(this.x/mag, this.y/mag);
            },
            dot(b){
                return (this.x*b.x) + (this.y*b.y);
            }
        };
    }

    vec3(x, y, z, color=albedo(0)){ // The parameter `color` should only be specified when rendering a pixel
        if(typeof x!=="number"){
            x=0;
            y=0;
            z=0;
        }
        if(typeof y!=="number"){
            y=x;
            z=x;
        }
        if(typeof z!=="number"){
            z=0;
        }
        return {
            type:TYPE.Vector,
            x, y, z, color,
            magnitude(){
                return abs(sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z)));
            },
            sub(b){
                return SGL.prototype.vec3(this.x-b.x, this.y-b.y, this.z-b.z);
            },
            add(b){
                return SGL.prototype.vec3(this.x+b.x, this.y+b.y, this.z+b.z);
            },
            mul(b){
                return SGL.prototype.vec3(this.x*b.x, this.y*b.y, this.z*b.z);
            },
            div(b){
                return SGL.prototype.vec3(this.x/b.x, this.y/b.y, this.z/b.z);
            },
            distance(b){
                return this.sub(b).magnitude();
            },
            normalize(){
                let mag=this.magnitude();
                return SGL.prototype.vec3(this.x/mag, this.y/mag, this.z/mag);
            },
            dot(b){
                return (this.x*b.x) + (this.y*b.y) + (this.z*b.z);
            }
        };
    }

    Rect(pos=this.vec2(), scale=this.vec2(), color=albedo()){
        return {
            type:TYPE.Rect,
            pos, scale, color
        };
    }

    Circle(pos=this.vec2(), radius=0, color=albedo()){
        return {
            type:TYPE.Circle,
            pos, radius, color
        };
    }

    Arc(pos=this.vec2(), radius=0, start=0, circumference=PI_2, color=albedo()){
        return {
            type:TYPE.Arc,
            pos, radius, start, circumference, color
        };
    }

    Text(pos=this.vec2(), text="no text :(", color=albedo(), maxStretch=this.width){
        return {
            type:TYPE.Text,
            pos, text, maxStretch, color
        };
    }

    Line(pos=this.vec2(), to=this.vec2(), color=albedo()){
        return {
            type:TYPE.Line,
            pos, to, color
        };
    }

    Render(nile=this.Arc()||this.Rect()||this.Circle()||this.vec2(), RenderError = true){
        if(SGL_ERR && RenderError)
        {
            this.context.textAlign = "center";
            this.Render(this.Text(this.center, SGL_ERR, albedo(1, 0.3, 0.3, 1)), false);
        }
        if(SGL_PREV_RENDER && nile.type != TYPE.Text) return;

        this.context.fillStyle=this.ParseAlbedo(nile.color);
        if(nile.type==TYPE.Rect && nile.pos.x < this.width && nile.pos.x + nile.scale.x > 0 && nile.pos.y < this.height && nile.pos.y + nile.scale.y > 0){
            this.context.fillRect(nile.pos.x, nile.pos.y, nile.scale.x, nile.scale.y);
            return;
        }
        else if(nile.type==TYPE.Circle && nile.pos.x - nile.radius < this.width && nile.pos.x + nile.radius > 0 && nile.pos.y - nile.radius < this.height && nile.pos.y + nile.radius > 0){
            this.context.beginPath();
            this.context.arc(nile.pos.x, nile.pos.y, nile.radius, 0, PI_2, false);
            this.context.fill();
            this.context.closePath();
            return;
        }
        else if(nile.type==TYPE.Arc){
            this.context.beginPath();
            this.context.arc(nile.pos.x, nile.pos.y, nile.radius, nile.start, nile.circumference, false);
            this.context.fill();
            this.context.closePath();
            return;
        }
        else if(nile.type==TYPE.Vector){
            const img=this.context.getImageData(0, 0, this.width, this.height);
            const pos=nile.y * (this.width * 4) + nile.x * 4;
            img.data[pos]=nile.color.r*255;
            img.data[pos+1]=nile.color.g*255;
            img.data[pos+2]=nile.color.b*255;
            img.data[pos+3]=nile.color.a*255;
            this.context.putImageData(img, 0, 0);
            return;
        }
        else if(nile.type==TYPE.Text){
            this.context.fillText(nile.text, nile.pos.x, nile.pos.y, nile.maxStretch);
            return;
        }
        else if(nile.type==TYPE.Line){
            this.context.beginPath();
            this.context.strokeStyle = this.ParseAlbedo(nile.color);
            this.context.moveTo(nile.pos.x, nile.pos.y);
            this.context.lineTo(nile.to.x, nile.to.y);
            this.context.stroke();
            this.context.strokeStyle = "rgba(0,0,0,0)";
            this.context.closePath();
            return;
        }
    }

    RenderArray(nileArray, cb=(index, reference)=>{}){
        for(let i=0;i<nileArray.length;i++){
            const o = cb(i, nileArray[i]);
            if(typeof o == "number")
            {
                i += o;
            }

            this.Render(nileArray[i]);
        }
    }

    ParseAlbedo(color=albedo()){
        return `rgba(${color.r*255}, ${color.g*255}, ${color.b*255}, ${color.a})`;
    }

    Ref(){
        // this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = "#000000";
        this.context.fillRect(0, 0, this.width, this.height);
    }

    Flow(rate=0.7){
        this.context.fillStyle = this.ParseAlbedo(albedo(0.2, 0.4, 0.4, 1));
        this.context.fillRect(0, 0, this.width, this.height);
    }

    MinIndex(items=[]){
        let i=0;
        let o=Infinity;
        for(let k=0;k<items.length;k++){
            if(items[k]<o){
                o=items[k];
                i=k;
            }
        }

        return i;
    }

    MaxIndex(items=[]){
        let i=0;
        let o=-Infinity;
        for(let k=0;k<items.length;k++){
            if(items[k]>o){
                o=items[k];
                i=k;
            }
        }

        return i;
    }
}

// Global function

function sqrt(x){
    return Math.sqrt(x);
}
function floor(x){
    return Math.floor(x);
}
function abs(x){
    return Math.abs(x);
}
function atan2(pos1=SGL.prototype.vec2(), pos2=SGL.prototype.vec2()){
    return Math.atan2(pos2.y-pos1.y, pos2.x-pos1.x);
}
function albedo(r=0, g=0, b=0, a=1){
    return {
        r, g, b, a
    };
}
function cos(x){
    return Math.cos(x);
}
function sin(x){
    return Math.sin(x);
}
function tan(x){
    return Math.tan(x);
}
function rad(x=1){
    return x*(PI/180)
}
function min(...arr){
    return Math.min(...arr);
}
function max(...arr){
    return Math.max(...arr);
}
function rng()
{
    return Math.random();
}

function rdir()
{
    return Math.random() * 2 - 1;
}

function seededChannel(i = 0)
{
    let k = i * 24892 * 79283;
    return (k % 256) / 255;
}

function seededColor(i = 0)
{
    let ka = seededChannel(i * 2) * 2;
    let kb = seededChannel(i * 33) * 2;
    let kc = seededChannel(i * 444) * 2;

    return albedo(ka, kb, kc, 1);
}

function lerp(a = 0, b = 0, t = 0)
{
    return a + (b - a) * t;
}

function RotVec2(x = vec2(), amount = 0)
{
    let angle = Math.atan2(x.y, x.x) + amount;

    return vec2(cos(angle), sin(angle));
}

const vec2 = SGL.prototype.vec2;
const vec3 = SGL.prototype.vec3;

const PI=Math.PI;
const PI_2=Math.PI*2;
const PI_12=Math.PI/2;
const PI_4=Math.PI*4;

let SGL_DELAY=1;
let SGL_ExtremeRush=false;
let SGL_Threads=1000;
let SGL_FPS=1;
let SGL_TICK0=0;
let SGL_PREV_RENDER = false;
let SGL_RUN = true;
let SGL_ERR = "";
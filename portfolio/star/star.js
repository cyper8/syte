//document.body.addEventListener('mousemove',function(e){void(0)},false);
//document.body.addEventListener('mouseup',function(e){void(0);},false);
function Point(x,y,z){
    var p = new Object();
    if (x) p.x = x;
        else p.x = 0;
    if (y) p.y = y;
        else p.y = 0;
    if (z) p.z = z;
        else p.z = 0;
    return p;
}

function Angles(x,y,z,R) {
    return {
        dX: ((R-Math.abs(x)) == 0) ? (0) : (((z<0) ? ((Math.PI)) : ((y<0) ? (2*Math.PI) : (0)))+((z<0) ? (-1) : (1))*Math.asin(y/(Math.sqrt(Math.pow(R,2)-Math.pow(x,2))))),
        dY: ((R-Math.abs(y)) == 0) ? (0) : (((z<0) ? ((Math.PI)) : ((x<0) ? (2*Math.PI) : (0)))+((z<0) ? (-1) : (1))*Math.asin(x/(Math.sqrt(Math.pow(R,2)-Math.pow(y,2))))),
        dZ: ((R-Math.abs(z)) == 0) ? (0) : (((y<0) ? ((Math.PI)) : ((x<0) ? (2*Math.PI) : (0)))+((y<0) ? (-1) : (1))*Math.asin(x/(Math.sqrt(Math.pow(R,2)-Math.pow(z,2)))))
    };
}

/*
    content = {
        style: "",
        action: function(){};
    }
*/

function RotZ(p,ca,sa){
    return Point(
    (p.x*ca-p.y*sa),
    (p.x*sa+p.y*ca),
    p.z
    );
}

function RotX(p,ca,sa){
    return Point(
    p.x,
    (p.y*ca-p.z*sa),
    (p.y*sa+p.z*ca)
    );
}

function RotY(p,ca,sa){
    return Point(
    (p.x*ca-p.z*sa),
    p.y,
    (p.x*sa+p.z*ca)
    )
}

function Cloud(x,y,water){
    var cloud = document.createElement("div");
    cloud.className = "bowl";
    cloud.cloud = document.createElement("div");
    cloud.cloud.className = "cloud";
    cloud.appendChild(cloud.cloud);
    document.body.appendChild(cloud);
    cloud.style.top = y.toString()+"px";
    cloud.style.left = x.toString()+"px";
    cloud.draggable = false;
    cloud.scaleCenter = null;
    cloud.srR=null;
    cloud.scalingregion = document.createElement("div");
    cloud.scalingregion.className = "scregion";
    cloud.appendChild(cloud.scalingregion);
    cloud.maxRadius = (cloud.offsetTop>cloud.offsetLeft) ? (cloud.offsetTop) : (cloud.offsetLeft);
    cloud.center = {
        x: -2,//cloud.clientWidth/2,
        y: -2,//cloud.clientHeight/2,
        z: 0
    };
    cloud.abscenter = {
        x: cloud.offsetLeft-cloud.center.x,
        y: cloud.offsetTop-cloud.center.y
    };
    cloud.topmost = null;
    cloud.movement = {
        timestamp: null,
        time: null,
        force: null,
        angle: {
            da: 0,
            db: 0,
            dg: 0
        },
        k: 100,
        start: function(){
            
        },
        inertion: function(){
            cloud.rotatebyangle(cloud.movement.angle.da*cloud.movement.k/100,cloud.movement.angle.db*cloud.movement.k/100,cloud.movement.angle.dg*cloud.movement.k/100);
            cloud.movement.k--;
            if (cloud.movement.k<2) {
                cloud.movement.stop();
            }
        },
        stop: function(){
                clearInterval(cloud.movement.force);
                cloud.movement.force = null;
                cloud.movement.k=100;
        }
    }
    cloud.drops = new Array();
    cloud.rotatebyangle = function(da,db,dg){
        for (var i=0; i<cloud.drops.length;i++){
            cloud.drops[i].rotatebyangle(da,db,dg);
            if (cloud.topmost != null){
                if (cloud.topmost.point.z < cloud.drops[i].point.z) {
                    cloud.topmost.classList.remove("topmost");
                    cloud.topmost = cloud.drops[i];
                    cloud.topmost.classList.add("topmost");
                }
            }
            else {
                cloud.topmost = cloud.drops[i];
                cloud.topmost.classList.add("topmost");
            }
        }
    }
    cloud.setradius = function(newrad){
        if (newrad < cloud.maxRadius-20) {
            for (var i=0; i<cloud.drops.length;i++){
                cloud.drops[i].scale(newrad-cloud.drops[i].R);
            }
        }
    };
    for (var i=0; i<water.length; i++){
        
        cloud.drops.push(new Drop(cloud,new Point(0,0,water[i].radius),water[i]));
        cloud.appendChild(cloud.drops[cloud.drops.length-1]);
        cloud.drops[cloud.drops.length-1].num = i;
        var rz = (24*Math.PI)/(water.length);
        var rx = 2*Math.PI*((i+1)/water.length);
        cloud.rotatebyangle(rx,0,0);
        cloud.rotatebyangle(0,0,rz);
    }
    cloud.onmousedown = function(e){
        this.scaleCenter = {x: e.pageX,y: e.pageY};
        this.scalingregion.style.opacity = 0.2;
        this.scalingregion.style.borderColor = "black";
        this.scalingregion.zIndex = 100;
        this.scalingregion.onmouseout = function(){document.cloud.onmouseup()};
        this.srR = this.scalingregion.clientWidth/2;
    };
    cloud.onmouseup = function(){
        if (this.scaleCenter != null){
            this.scalingregion.zIndex = 1;
            this.scalingregion.style.opacity = 0;
            this.scalingregion.style.borderColor = "transparent";
            this.scaleCenter = null;
        }
    };
    cloud.onmousemove = function(e){
        if (this.scaleCenter != null) {
            var nR = this.srR+Math.sqrt(Math.pow(this.scaleCenter.x-e.pageX,2)+Math.pow(this.scaleCenter.y-e.pageY,2));
            this.scalingregion.style.WebkitTransform = "scale("+(nR*2/this.scalingregion.clientWidth)+")";
            this.setradius(nR);
        }
    };
    cloud.onmousewheel = function(e){
            if (e.deltaY>0) {
                this.rotatebyangle(((2*Math.PI)/this.drops.length)/5,0,0);
            }
            else {
                this.rotatebyangle((-(2*Math.PI)/this.drops.length)/5,0,0);
            }
    }
//    cloud.onmouseout = function(){
//        cloud.onmouseup();
//    };
    return cloud;
}

function Drop(parent,point,content){
    var drop = document.createElement("div");
    drop.className = "drop";
    drop.draggable = false;
    drop.dragged = false;
    drop.isdraggable = false;
    drop.parentcloud = parent;
    drop.contentEditable = "false";
    drop.contentHTML = content.content;
    drop.innerHTML = drop.contentHTML;
    drop.point = point;
    drop.place = function(point) {
        this.point = point;
        this.R = Math.sqrt(Math.pow(this.point.x,2)+Math.pow(this.point.y,2)+Math.pow(this.point.z,2));
        this.angles = Angles(this.point.x,this.point.y,this.point.z,this.R);
        this.factor = this.point.z/this.parentcloud.maxRadius;
        this.isdraggable = (this.factor > 0) ? (true) : (false);
        this.style.top = ((1+(0.2*this.factor))*Math.ceil(this.parentcloud.center.y + this.point.y)).toString()+"px";
        this.style.left = ((1+(0.2*this.factor))*Math.ceil(this.parentcloud.center.x + this.point.x)).toString()+"px";
        this.style.opacity = (this.factor+1)/2;
        this.style.zIndex = 50+Math.ceil(this.factor*50);
        this.style.WebkitTransform = "scale("+(1+(0.2*(this.factor))).toString()+")";
        return this;
    }
    drop.onselectstart = function(e){
        e.stopPropagation();
        e.defaultPrevented = true;
    };
    drop.onmousedown = function(e){
        this.parentcloud.movement.timestamp = e.timeStamp;
        this.parentcloud.movement.k = 100;
        clearInterval(this.parentcloud.movement.force);
        e.stopPropagation();
        e.defaultPrevented = true;
        if (this.isdraggable) {
            this.mouseoffset = {x: e.x-(this.point.x+this.parentcloud.abscenter.x), y: e.y-(this.point.y+this.parentcloud.abscenter.y)};
            this.onmousemove = function(em){
                if (em.srcElement == this) {
                    em.stopPropagation();
                    e.defaultPrevented = true;
                    if (this.isdraggable) {
                        this.parentcloud.movement.time = em.timeStamp - this.parentcloud.movement.timestamp;
//                        this.rotatebypoint(this.point.x + em.webkitMovementX,this.point.y + em.webkitMovementY);
                        this.rotatebypoint(em.x-this.mouseoffset.x-this.parentcloud.abscenter.x,em.y-this.mouseoffset.y-this.parentcloud.abscenter.y);
                    }
                    else {
                        this.onmousemove = null;
                    }
                    this.parentcloud.movement.timestamp = em.timeStamp;
                }
            }
        }
    }
    drop.onmouseup = function(){
        this.onmousemove = null;
//        this.parentcloud.movement.force = setInterval(this.parentcloud.movement.inertion,200);
    };
    drop.onmouseout = function(e){e.stopPropagation(); if (this.onmousemove != null) this.onmouseup();};
    drop.rotatebypoint = function(x,y){
        var nx = x;
        var ny = y;
        var nz = 0;
        while (Math.pow(this.R,2) < (Math.pow(nx,2) + Math.pow(ny,2))){
            nx = nx - (nx/Math.abs(nx));
            ny = ny - (ny/Math.abs(ny));
            nz--;
        }
        var nz = nz + Math.sqrt(Math.pow(this.R,2) - Math.pow(nx,2) - Math.pow(ny,2));
        var newpointangles = Angles(nx,ny,nz,this.R);
        this.parentcloud.movement.angle.da = this.angles.dX-newpointangles.dX;
        this.parentcloud.rotatebyangle(this.parentcloud.movement.angle.da,0,0);
        this.parentcloud.movement.angle.db = this.angles.dY-newpointangles.dY;
        this.parentcloud.rotatebyangle(0,this.parentcloud.movement.angle.db,0);
        this.parentcloud.movement.angle.dg = this.angles.dZ-newpointangles.dZ;
        this.parentcloud.rotatebyangle(0,0,this.parentcloud.movement.angle.dg);
    }
    drop.rotatebyangle = function(da,db,dg){
        var cda = Math.cos(da); var sda = Math.sin(da);
        var cdb = Math.cos(db); var sdb = Math.sin(db);
        var cdg = Math.cos(dg); var sdg = Math.sin(dg);
        drop.place(RotZ(RotY(RotX(this.point,cda,sda),cdb,sdb),cdg,sdg));
    }
    drop.scale = function(dR){
        var q = (this.R+dR)/this.R;
        drop.place(Point(this.point.x*q,this.point.y*q,this.point.z*q));
    };
    drop.place(point);
    return drop;
}
var bucket = [
    {style: "",action: void(1),content:"1",radius: 100},
    {style: "",action: void(1),content:"2",radius: 100},
    {style: "",action: void(1),content:"3",radius: 100},
    {style: "",action: void(1),content:"4",radius: 100},
    {style: "",action: void(1),content:"5",radius: 100},
    {style: "",action: void(1),content:"6",radius: 100},
    {style: "",action: void(1),content:"7",radius: 100},
    {style: "",action: void(1),content:"8",radius: 100},
    {style: "",action: void(1),content:"9",radius: 100},
    {style: "",action: void(1),content:"10",radius: 100},
    {style: "",action: void(1),content:"11",radius: 100},
    {style: "",action: void(1),content:"12",radius: 100},
    {style: "",action: void(1),content:"13",radius: 100},
    {style: "",action: void(1),content:"14",radius: 100},
    {style: "",action: void(1),content:"15",radius: 100},
    {style: "",action: void(1),content:"16",radius: 100},
    {style: "",action: void(1),content:"17",radius: 100},
    {style: "",action: void(1),content:"18",radius: 100},
    {style: "",action: void(1),content:"19",radius: 100},
    {style: "",action: void(1),content:"20",radius: 100},
    {style: "",action: void(1),content:"21",radius: 100},
    {style: "",action: void(1),content:"22",radius: 100},
    {style: "",action: void(1),content:"23",radius: 100},
    {style: "",action: void(1),content:"24",radius: 100},
    {style: "",action: void(1),content:"25",radius: 100},
    {style: "",action: void(1),content:"26",radius: 100},
    {style: "",action: void(1),content:"27",radius: 100},
    {style: "",action: void(1),content:"28",radius: 100},
    {style: "",action: void(1),content:"29",radius: 100},
    {style: "",action: void(1),content:"30",radius: 100},
    {style: "",action: void(1),content:"31",radius: 100},
    {style: "",action: void(1),content:"32",radius: 100},
    {style: "",action: void(1),content:"33",radius: 100},
    {style: "",action: void(1),content:"34",radius: 100},
    {style: "",action: void(1),content:"35",radius: 100},
    {style: "",action: void(1),content:"36",radius: 100},
    {style: "",action: void(1),content:"37",radius: 100},
    {style: "",action: void(1),content:"38",radius: 100},
    {style: "",action: void(1),content:"39",radius: 100},
    {style: "",action: void(1),content:"40",radius: 100},
    {style: "",action: void(1),content:"41",radius: 100},
    {style: "",action: void(1),content:"42",radius: 100},
    {style: "",action: void(1),content:"43",radius: 100},
    {style: "",action: void(1),content:"44",radius: 100},
    {style: "",action: void(1),content:"45",radius: 100}
];
document.cloud = new Cloud(200,200,bucket);

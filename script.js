const socketRender = io.connect('http://127.0.0.1:3000/')
const socketNotify = io.connect('http://127.0.0.1:4000/')

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let dots = [];
let w = 0;
let h = 0;

let dotRadius = 10;
function resize(){
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
}
function init(){
    dots.push({
      x: 0,
      y: 0,
      r: dotRadius
    });
}

function update(mx, my){
 dots = dots.map(({x,y,r}) => {
    x = mx * 5;
    y = my * 5;
    return {x,y,r}
 });
}
function draw(){
 ctx.clearRect(0,0,w,h);
 ctx.beginPath();
 dots.forEach(({x,y,r}) => {
   ctx.moveTo(x+r, y);
   ctx.arc(x, y, r, 0, Math.PI*2);
 });
 ctx.closePath();
 ctx.fillStyle = 'red';
 ctx.fill();
}
function loop(){
 draw();
 requestAnimationFrame(loop);
}
window.addEventListener("resize", resize);
resize();
init();
loop();

socketRender.emit("render", {
    render: true
})
socketRender.on("render", (data) => {
    update(data.message.longtitude, data.message.latitude);
})

socketNotify.emit("notify", {
    customerLongtitude: 100,
    customerLatitude: 100,
})

socketNotify.on("notify", (data) => {
    console.log(data.message)
    alert(data.message)
})



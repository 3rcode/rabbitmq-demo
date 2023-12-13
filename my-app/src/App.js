import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Establish web socket connection to services (render service and notify service)
    const socketRender = io.connect("http://localhost:5000/");
    const socketNotify = io.connect("http://localhost:5001/");

    // Draw position of shipper in real time
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let dots = [];
    let w = 0;
    let h = 0;

    let dotRadius = 10;
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }
    function init() {
      dots.push({
        x: 0,
        y: 0,
        r: dotRadius,
      });
    }

    function update(mx, my) {
      dots = dots.map(({ x, y, r }) => {
        x = mx * 5;
        y = my * 5;
        return { x, y, r };
      });
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.beginPath();
      dots.forEach(({ x, y, r }) => {
        ctx.moveTo(x + r, y);
        ctx.arc(x, y, r, 0, Math.PI * 2);
      });
      ctx.closePath();
      ctx.fillStyle = "red";
      ctx.fill();
    }
    function loop() {
      draw();
      requestAnimationFrame(loop);
    }
    window.addEventListener("resize", resize);
    resize();
    init();
    loop();
    // Update data continuously from render service
    socketRender.emit("render", {
      render: true,
    });
    socketRender.on("render", (data) => {
      update(data.message.longtitude, data.message.latitude);
    });

    // Update status from notify service
    socketNotify.emit("notify", {
      customerLongtitude: 100,
      customerLatitude: 100,
    });

    socketNotify.on("notify", (data) => {
      console.log(data.message);
      alert(data.message);
    });
    console.log("Here")
  });

  return <canvas id="canvas" />;
}

export default App;

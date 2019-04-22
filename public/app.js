class Whiteboard {
  constructor() {
    this.socket = io();

    this.canvas = document.getElementById('whiteboard');
    this.ctx = this.canvas.getContext('2d');

    this.dimension = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.current = {
      x: 0,
      y: 0
    };
    this.pressed = false;

    this.resize = this.resize.bind(this);
    this.mouseup = this.mouseup.bind(this);
    this.mousemove = this.mousemove.bind(this);
    this.mousedown = this.mousedown.bind(this);

    this.resize();
    this.addEventListeners();
    this.socketListener();
  }

  socketListener() {
    this.socket.on('drawing', ({ x, y, x2, y2 }) => {
      this.drawLine({ x, y, x2, y2, emit: false });
    });
  }

  addEventListeners() {
    window.addEventListener('resize', this.resize, false);
    this.canvas.addEventListener('mouseup', this.mouseup, false);
    this.canvas.addEventListener('mousemove', this.throttle(this.mousemove, 10), false);
    this.canvas.addEventListener('mousedown', this.mousedown, false);
  }

  throttle(fn, delay) {
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        fn.apply(null, arguments);
      }
    };
  }

  drawLine({ x, y, x2, y2, emit = true }) {
    this.ctx.fillStyle = '#000';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x2, y2);
    this.ctx.closePath();
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    if (emit) {
      this.socket.emit('drawing', {
        x, y, x2, y2
      });
    }
  }

  resize() {
    this.canvas.width = this.dimension.width;
    this.canvas.height = this.dimension.height;
  }

  mousedown(e) {
    this.current.x = e.clientX;
    this.current.y = e.clientY;
    this.pressed = true;
  }

  mouseup(e) {
    this.pressed = false;
  }

  mousemove(e) {
    if (!this.pressed) {
      return e.preventDefault();
    }

    this.drawLine({
      x: this.current.x,
      y: this.current.y,
      x2: e.clientX,
      y2: e.clientY
    });
    this.current.x = e.clientX;
    this.current.y = e.clientY;
  }
}

window.onload = new Whiteboard();

var AudioContext = window.AudioContext || window.webkitAudioContext

let audio = new Audio(),
    canvas = document.getElementById('c'),
    canvasCtx = canvas.getContext('2d'),
    audioCtx = new AudioContext(),
    analyser = audioCtx.createAnalyser(),
    fftSize = analyser.fftSize,
    fbc = new Uint8Array(fftSize),
    source

const HEIGHT = canvas.height = window.innerHeight,
      WIDTH = canvas.width = window.innerWidth,
      RADIUS = 80,
      POINTS = 360,
      CENTER = {
        x: WIDTH/2,
        y: HEIGHT/2
      }

audio.type = "audio/mpeg"
audio.crossOrigin = "anonymous"
audio.preload = "preload"
audio.autoplay = "autoplay"
audio.volume = 0.2

source = audioCtx.createMediaElementSource(audio)
source.connect(analyser)
analyser.connect(audioCtx.destination)

var audioInput = document.getElementById('audiofile');
  
  // choose file
  audioInput.addEventListener('change', function(event) {
    stream = URL.createObjectURL(event.target.files[0]);
    audio.src = stream;
    document.getElementsByClassName('msg-selected')[0].innerHTML = event.target.files[0].name;
  });

function draw() {
  requestAnimationFrame(draw)
  analyser.getByteFrequencyData(fbc)
  
  canvasCtx.fillStyle = '#22313F'
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

  for(let i = 0; i < POINTS; i++) {
    let rel = ~~(i * (POINTS/fftSize)),
        x = CENTER.x + RADIUS * Math.cos( (i * 2 * Math.PI) / POINTS ),
        y = CENTER.y + RADIUS * -Math.sin( (i * 2 * Math.PI) / POINTS ),
        x_2 = CENTER.x + (fbc[rel]) * Math.cos( (i * 2 * Math.PI) / POINTS ),
        y_2 = CENTER.y + (fbc[rel]) * -Math.sin( (i * 2 * Math.PI) / POINTS )
    
    canvasCtx.beginPath()
    canvasCtx.moveTo(x, y)
    canvasCtx.lineTo(x_2, y_2)
    //canvasCtx.strokeStyle = "hsl(" + i + ", 100%, 50%)"
    canvasCtx.strokeStyle = "hsl(0, 100%, 100%)"
    canvasCtx.stroke()
  }
}

Array.from(document.querySelectorAll('button')).map(btn => {
  btn.addEventListener('click', e => {
    let id = btn.id
    if(id === "stop") {
      audio.pause();
      audio.currentTime = 0
    } else {
      audio[id]()
    }
  })
})

draw()
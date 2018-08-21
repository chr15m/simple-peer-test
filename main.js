// var Peer = require('simple-peer')
var Peer = window.SimplePeer
var p = new Peer({ initiator: location.search === '?generate', trickle: false })
var out = document.querySelector('#outgoing');
var spinner = document.querySelector("#spinner");

if (location.search === '?generate') {
  spinner.style.display = "block";
  document.getElementById("generate").style.display = "none";
}

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  out.textContent = JSON.stringify(data) + "\n"
})

document.querySelector('form').addEventListener('submit', function (ev) {
  spinner.style.display = "block";
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
})

p.on('connect', function () {
  console.log('CONNECT')
  out.textContent += "CONNECT\n"
  setInterval(function() {
    p.send('whatever' + Math.random())
  }, 2000);
})

p.on('data', function (data) {
  console.log('data: ' + data)
  out.textContent += JSON.stringify(data) + "\n"
})

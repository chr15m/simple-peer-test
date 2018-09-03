// var Peer = require('simple-peer')
console.log("load");
var Peer = window.SimplePeer;
var params = new URLSearchParams(document.location.search);

var p = new Peer({ initiator: params.get('generate') != null, trickle: params.get('trickle') != null })
var out = document.querySelector('#outgoing');
var spinner = document.querySelector("#spinner");

if (params.get('generate') != null) {
  spinner.style.display = "block";
  document.getElementById("generate").style.display = "none";
} else {
  var gparams = new URLSearchParams(params);
  gparams.set("generate", "");
  document.getElementById("generate").innerHTML = "<a href='?" + gparams.toString() + "'>generate offer</a>"
}

var trickleparams = new URLSearchParams(params);
if (params.get('trickle') != null) {
  trickleparams.delete("trickle");
  document.getElementById("trickle").innerHTML = "<a href='?" + trickleparams.toString() + "'>trickle off</a>";
} else {
  trickleparams.set("trickle", "");
  document.getElementById("trickle").innerHTML = "<a href='?" + trickleparams.toString() + "'>trickle on</a>";
}

p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  out.textContent = JSON.stringify(p._pc.localDescription) + "\n"
})

p.on('iceStateChange', function() {
  console.log("iceStateChange", arguments);
});

p.on('iceTimeout', function() {
  console.log("iceTimeout", arguments);
});

p.on('signallingStateChange', function() {
  console.log("signallingStateChange", arguments);
});

p.on('_iceComplete', function() {
  console.log("_iceComplete", arguments);
});

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

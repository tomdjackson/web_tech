// This script is responsible for making the disco ball in the header of the page, setting up the various required properties including the transform
// which gives the illusion of 'rotation'

const pi = Math.PI;
const discoBall = document.getElementById("discoBall");
const discoBallLight = document.getElementById("discoBallLight");
var scaleFactor = document.documentElement.clientWidth/1900;
var radius = 50 * scaleFactor; // Size of the ball
var squareSize = 6.5 * scaleFactor; // Size of each individual 'square' of the ball
var precision = 19.55; // The precision of the rotation of the ball
discoBallLight.style.width = 100 * scaleFactor;
discoBallLight.style.height = 100 * scaleFactor;
var inc = pi / precision;

var currentRadius;
var circumference;
var angleIncrement;
var square;
var squareTile;

//// Continuously Update disco ball based on screen size - Commented out for now as it doesn't work as fully intended but still interesting to see the methodology
//window.onresize = window.onload = function() {
//    scaleFactor = document.documentElement.clientWidth/1900;
//    radius = 50 * scaleFactor;
//    squareSize = 6.5 * scaleFactor;
//    const discoBallLight = document.getElementById('discoBallLight');
//    discoBallLight.style.width = discoBallLight.style.width * scaleFactor;
////    document.getElementById('discoBallLight').style.width = document.getElementById('discoBallLight').style.width * scaleFactor;
////    precision = 19.55 * scaleFactor;
//}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generates a div for each square used and applies the correct transform to it. This does require a lot of divs however memory footprint on Chrome didn't
// seem to be affected too much!
for (var t = 0; t < pi; t+=inc) {
  currentRadius = Math.abs((radius * Math.cos(0) * Math.sin(t)) - (radius * Math.cos(pi) * Math.sin(t))) / 2.5;
  circumference = Math.abs(2 * pi * currentRadius);
  angleIncrement = (pi*2) / Math.floor(circumference / squareSize);
  for (var i = angleIncrement/2; i < (pi*2); i += angleIncrement) {
    square = document.createElement("div");
    tile = document.createElement("div");

    // Set up more styling for the individual square tile of the ball, including it's transformation.
    // This takes into account for webkit transforms as well as normal transforms for multi-browser support
    tile.style.width = squareSize + "px";
    tile.style.height = squareSize + "px";
    tile.style.backgroundColor = "rgb(" + randomNumber(130, 255) + "," + randomNumber(130, 255) + "," + randomNumber(130, 255) + ")"; // Generates the funky colours you see on the screen
    tile.style.backfaceVisibility = "hidden";
    
    tile.style.webkitTransformOrigin = "0 0 0";
    tile.style.webkitTransform = "rotate(" + i + "rad) rotateY(" + t + "rad)";
    tile.style.webkitAnimation = "reflect 2s linear infinite";
    tile.style.webkitAnimationDelay = String(randomNumber(0,20)/10) + "s";
      
    tile.style.transformOrigin = "0 0 0";
    tile.style.transform = "rotate(" + i + "rad) rotateY(" + t + "rad)";
    tile.style.animation = "reflect 2s linear infinite";
    tile.style.animationDelay = String(randomNumber(0,20)/10) + "s";
      
    square.appendChild(tile);
    square.className = "square";
    square.style.webkitTransform = "translateX(" + Math.ceil(radius * Math.cos(i) * Math.sin(t)) + "px) translateY(" + radius * Math.sin(i) * Math.sin(t) + "px) translateZ(" + radius * Math.cos(t) + "px)";
    square.style.transform = "translateX(" + radius * Math.cos(i) * Math.sin(t) + "px) translateY(" + radius * Math.sin(i) * Math.sin(t) + "px) translateZ(" + radius * Math.cos(t) + "px)";
      
    discoBall.appendChild(square);
  }
}

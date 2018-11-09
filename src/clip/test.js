import Clip from "./Clip.js";
require("../../style.css");
require("./test.css");


var demo = document.querySelector(".clip-container");
var img = document.querySelectorAll("img");
var btn = document.querySelectorAll("button");
var c = new Clip( demo , img[0] );

btn[0].onclick = function () {
    img[0].src = require( "./1_03-.jpg" );
    c.render( img[0].src );
}
btn[1].onclick = function () {
    var img2 = new Image();
    img2.src = c.getImageData().url;
    document.body.appendChild(img2);
}
import Accordion from "./Accordion.js";
require("../../style.css");


//
var demo = document.querySelectorAll(".box")[0];
var a = new Accordion( demo ,{
    closeAll : true                                 //手风琴效果
})


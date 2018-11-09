import ScrollContainer from "./ScrollContainer.js";
require("../../style.css");


var demo = document.querySelector(".scroll-container");

var s = new ScrollContainer( demo ,{
    scrollBar : true ,
    backBoune : true
});
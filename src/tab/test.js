import TabContainer from "./TabContainer.js";
require("../../style.css");

var demo = document.querySelectorAll(".tab-container")[0];
var t = new TabContainer( demo ,{
    nav : demo.querySelectorAll("span") ,
    contentBox : demo.querySelectorAll("div") ,
    currClass : "show" ,
})
import Ruler from "./Ruler.js";
require("../../style.css");

let demo = document.querySelector(".range");

let r = new Ruler( demo , {
    label : [10,150,180.88] ,
    fill : true ,
    //fillColor : "brown"
});

r.on("change",function ( data ) {
    //console.log( data )
})
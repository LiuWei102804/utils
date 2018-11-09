import Paging from "./Paging.js";
require("../../style.css");


var el = document.querySelector(".paging");
var p = new Paging( el , {
    max : 80 ,
    limit : 6
})
p.on("change",function ( item ) {
    console.log( item )
})
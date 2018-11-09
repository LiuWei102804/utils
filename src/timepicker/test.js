import TimePicker from "./TimePicker.js";
require("../../style.css");
require("./test.css");


var demo = document.querySelector(".time-container");
let result = document.querySelector(".result");
let result1 = document.querySelector(".result1");
let result2 = document.querySelector(".result2");
var t = new TimePicker( demo , {
    mode : "12" ,
    time : false
});

t.on("change",function ( item ) {
    console.log(item)
})
t.on("select",function ( data ) {
    console.log(data)
})

result.onclick = function () {
    var result = t.result();
}
result1.onclick = function () {
    t.timeStart();
}
result2.onclick = function () {
    t.timeCancel();
}

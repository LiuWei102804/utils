// //时间选择器
// class TimePicker{
//     constructor( el , options ){
//         this.el = el;
//         this.options = {
//             time : options.time || true,
//             mode : options.mode || 24
//         };
//         this.events = {
//             change : [] ,
//             select : []
//         }
//         this.init();
//     };
//     init(){
//         this.createEl();
//
//         if( this.options.time ) {
//             this.posNow();
//         };
//
//         this.scroll();
//     };
//     //创建元素
//     createEl(){
//         let h_data = [];                                //小时数据
//         let m_s_data = [];                              //分秒共用
//         let opt = this.options;
//         for( let i = 0 ; i < opt.mode; i ++ ) {
//             h_data.push( `<li t-idx="${i}">${this.fill( i + 1 == 24 ? 0 : i + 1 )}</li>` );
//         };
//         for( var k = 0; k < 60; k ++ ) {
//             m_s_data.push( `<li t-idx="${k}">${this.fill( k )}</li>` );
//         };
//         var html = `<div>
//                         <ul data-target="hours">${ h_data.join("") }${ h_data.join("") }</ul>
//                      </div>
//                      <b class="time-icon">:</b>
//                      <div>
//                         <ul data-target="minutes">${ m_s_data.join("") }${ m_s_data.join("") }</ul>
//                      </div>
//                      <b class="time-icon">:</b>
//                      <div>
//                          <ul data-target="seconds">${ m_s_data.join("") }${ m_s_data.join("") }</ul>
//                      </div>`;
//
//         this.el.innerHTML = html;
//     };
//     scroll(){
//         let uls = this.el.querySelectorAll("ul");
//         const _ = this;
//         for( let i = 0; i < uls.length; i ++ ) {
//             uls[i].moveY = 0;
//             uls[i].scale = uls[i].scale || 0;
//             this.bind( uls[i] , "touchstart" , __start__ );
//             this.bind( uls[i] , "touchmove" , __move__ );
//             this.bind( uls[i] , "touchend" , __end__ );
//         };
//         //let prevStyle = `color: rgba(0,0,0,.3); transform: rotateX(31deg); transform-origin: 100px; transform-style: preserve-3d;`;
//
//         function __start__( ev ){
//             clearInterval( this.timer );
//             let touch = ev.changedTouches[0];
//             this.beginY = touch.pageY - this.moveY;
//         };
//         function __move__( ev ) {
//             var lastChild = this.children[this.children.length - 1];
//             let touch = ev.changedTouches[0];
//             this.moveY = touch.pageY - this.beginY;
//
//             _.setTransform( this , this.moveY );
//         };
//         function __end__() {
//             var lastChild = this.children[this.children.length - 1];
//             var lastH = parseFloat( _.getStyle(lastChild , "height") );
//             this.scale = Math.round( Math.abs( this.moveY ) / lastH );
//             var target = -( this.scale * lastH );
//             if( this.moveY <= -lastChild.offsetTop ) {
//                 target = -lastChild.offsetTop;
//                 this.scale = this.children.length - 1;
//             }
//
//             if( this.moveY >= 0 ) {
//                 target = 0;
//                 this.scale = 0;
//             }
//
//             _.run( this , target , () => {
//                 _.fire("change" , { type : this.dataset.target , index : this.scale , text : _.text( this.children[this.scale] ) } );
//             });
//         }
//     };
//     //绑定事件
//     bind( el , evt , cb ){
//         if( window.addEventListener )
//             el.addEventListener( evt , cb , false );
//         else
//             el.attachEvent("on" + event , cb );
//     };
//     remove( el , evt , cb ){
//         if( window.removeEventListener )
//             el.removeEventListener( evt , cb , false );
//         else
//             el.detachEvent( "on" + evt , cb );
//     }
//     //定位当前
//     posNow(){
//         let d = new Date();
//         let uls = this.el.querySelectorAll("ul");
//         let h = uls[0],m = uls[1],s = uls[2];
//
//         h.scale = this.currTime( h , d.getHours() % this.options.mode ).idx == 0 ? h.children.length / 2 : this.currTime( h , d.getHours() ).idx;
//         m.scale = this.currTime( m , d.getMinutes() ).idx == 0 ? m.children.length / 2: this.currTime( m , d.getMinutes() ).idx;
//         s.scale = this.currTime( s , d.getSeconds() ).idx == 0 ? s.children.length / 2: this.currTime( s , d.getSeconds() ).idx;
//
//         this.run( h , -h.scale * parseFloat( this.getStyle( h.children[0] ,"height" ) ) );
//         this.run( m , -m.scale * parseFloat( this.getStyle( m.children[0] ,"height" ) ) );
//         this.run( s , -s.scale * parseFloat( this.getStyle( s.children[0] ,"height" ) ) );
//
//
//         this.timerun = setInterval(() => {
//             s.scale ++;
//             this.run(  s , -( s.scale * parseFloat( this.getStyle( s.children[0] ,"height" ) ) ) , () => {
//                 if( s.scale > s.children.length / 2 ) {
//                     s.scale = 1;
//                     s.moveY = -( s.scale * parseFloat( this.getStyle( s.children[0] ,"height" ) ) );
//                     this.setTransform( s , s.moveY );
//                 }
//             });
//             if( s.scale ==  s.children.length / 2 ) {
//                 m.scale ++;
//                 this.run(  m , -( m.scale * parseFloat( this.getStyle( m.children[0] ,"height" ) ) ) , () => {
//                     if( m.scale > m.children.length / 2 ) {
//                         m.scale = 1;
//                         m.moveY = -( m.scale * parseFloat( this.getStyle( m.children[0] ,"height" ) ) );
//                         this.setTransform( m , m.moveY );
//                     }
//                 });
//             };
//             if( m.scale ==  m.children.length / 2 && s.scale ==  s.children.length / 2 ) {
//                 h.scale ++;
//                 this.run(  h , -( h.scale * parseFloat( this.getStyle( h.children[0] ,"height" ) ) ) , () => {
//                     if( h.scale > h.children.length / 2 ) {
//                         h.scale = 1;
//                         h.moveY = -( h.scale * parseFloat( this.getStyle( m.children[0] ,"height" ) ) );
//                         this.setTransform( h , h.moveY );
//                     }
//                 });
//             };
//         },1000)
//
//     };
//     //定位时间节点
//     currTime( el , time ){
//         let children = el.children;
//         for( let i = 0; i < children.length; i ++ ) {
//             if ( this.text( children[i] ) == time ) {
//                 return { el : children[i] , idx : i }
//             }
//         }
//     };
//     //取消计时
//     timeCancel(){
//         clearInterval( this.timerun );
//     };
//     timeStart() {
//         clearInterval( this.timerun );
//         if( this.options.time ) {
//             this.posNow();
//         }
//     }
//     text( el ){
//         return el.textContent;
//     };
//     //补零
//     fill( num ){
//         return num < 10 ? "0" + num : "" + num;
//     };
//     getStyle ( obj , attr ) {
//         return global.getComputedStyle ? global.getComputedStyle( obj , false )[attr] : obj.currentStyle[attr];
//     } ;
//     //获取选择数据
//     result(){
//         let uls = this.el.querySelectorAll("ul");
//         var data = Object.create( null );
//
//         data["hour"] = this.text( uls[0].children[uls[0].scale] );
//         data["minute"] = this.text( uls[1].children[uls[1].scale] );
//         data["second"] = this.text( uls[2].children[uls[2].scale] );
//         data["formatText"] = data["hour"] + ":" + data["minute"] + ":" + data["second"];
//
//         this.fire("select",data);
//         return data;
//     };
//     //transform
//     setTransform( el , val ){
//         el.style.WebkitTransform = "translateY("+ val +"px)";
//         el.style.MozTransform = "translateY("+ val +"px)";
//         el.style.OTransform = "translateY("+ val +"px)";
//         el.style.transform = "translateY("+ val +"px)";
//     };
//     //缓冲动画
//     run( el , target , cb ) {
//         clearInterval( el.timer );
//         el.timer = setInterval(() => {
//             let speed = ( target - el.moveY ) / 5;
//             el.moveY += speed;
//             this.setTransform( el , el.moveY );
//             if( Math.abs( target - el.moveY ) - Math.abs( speed ) < 1 ) {
//                 el.moveY = target;
//                 clearInterval( el.timer );
//                 cb && cb();
//             }
//         },30)
//     };
//     on( evt , cb ){
//         if ( !this.events[evt] ) {
//             this.events[evt] = [];
//         };
//         this.events[evt].push( cb );
//     };
//     fire( evt , data ){
//         var _ = this;
//         if( this.events[evt] instanceof Array ){
//             var handlers = this.events[evt];
//             handlers.forEach(function ( v , k ){
//                 v.call( _ , data );
//             })
//         }
//     };
// }
//
// export default TimePicker;